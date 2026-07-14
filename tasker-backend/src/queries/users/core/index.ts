import { Kysely } from "kysely";
import { DB } from "@/database/types";
import { GoogleUserInput } from "@/modules/users/dto/users.dto";

export const findByIdQuery = async (db: Kysely<DB>, id: string) => {
  return db
    .selectFrom("users")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const findByGoogleIdQuery = async (db: Kysely<DB>, googleId: string) => {
  return db
    .selectFrom("users")
    .selectAll()
    .where("googleId", "=", googleId)
    .executeTakeFirst();
};

export const findOrCreateQuery = async (
  db: Kysely<DB>,
  input: GoogleUserInput,
) => {
  const existing = await findByGoogleIdQuery(db, input.googleId);

  if (existing) {
    return db
      .updateTable("users")
      .set({
        name: input.name,
        avatar: input.avatar,
        updatedAt: new Date().toISOString(),
      })
      .where("id", "=", existing.id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  const userId = crypto.randomUUID();
  const now = new Date().toISOString();

  // Use a transaction for all related profile creation
  return db.transaction().execute(async (trx) => {
    const newUser = await trx
      .insertInto("users")
      .values({
        id: userId,
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatar: input.avatar ?? null,
        updatedAt: now,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await trx
      .insertInto("wallets")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: now,
      })
      .execute();

    await trx
      .insertInto("expert_profiles")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: now,
      })
      .execute();

    await trx
      .insertInto("client_profiles")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: now,
      })
      .execute();

    return newUser;
  });
};

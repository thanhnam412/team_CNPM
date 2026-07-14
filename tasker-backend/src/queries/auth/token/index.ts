import { Kysely } from "kysely";
import { DB } from "@/database/types";

export const saveRefreshTokenQuery = async (
  db: Kysely<DB>,
  userId: string,
  token: string,
  device?: string,
) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  return db
    .insertInto("refresh_tokens")
    .values({
      id: crypto.randomUUID(),
      userId,
      token,
      device: device ?? null,
      expiresAt: expiresAt.toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const validateRefreshTokenQuery = async (
  db: Kysely<DB>,
  userId: string,
  token: string,
) => {
  const row = await db
    .selectFrom("refresh_tokens")
    .selectAll()
    .where("userId", "=", userId)
    .where("token", "=", token)
    .where("expiresAt", ">", new Date())
    .executeTakeFirst();

  return !!row;
};

export const revokeRefreshTokenQuery = async (
  db: Kysely<DB>,
  token: string,
) => {
  return db.deleteFrom("refresh_tokens").where("token", "=", token).execute();
};

export const revokeAllUserTokensQuery = async (
  db: Kysely<DB>,
  userId: string,
) => {
  return db.deleteFrom("refresh_tokens").where("userId", "=", userId).execute();
};

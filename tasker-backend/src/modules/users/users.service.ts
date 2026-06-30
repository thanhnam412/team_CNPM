import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";

import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { GoogleUserInput } from "./dto/users.dto";

@Injectable()
export class UsersService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findById(id: string) {
    return this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async findByGoogleId(googleId: string) {
    return this.db
      .selectFrom("users")
      .selectAll()
      .where("googleId", "=", googleId)
      .executeTakeFirst();
  }

  async findOrCreate(input: GoogleUserInput) {
    const existing = await this.findByGoogleId(input.googleId);

    if (existing) {
      return this.db
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

    return this.db
      .insertInto("users")
      .values({
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatar: input.avatar ?? null,
        id: "",
        updatedAt: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async saveRefreshToken(userId: string, token: string, device?: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.db
      .insertInto("refresh_tokens")
      .values({
        userId,
        token,
        device: device ?? null,
        expiresAt: expiresAt.toISOString(),
        id: "",
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async validateRefreshToken(userId: string, token: string) {
    const row = await this.db
      .selectFrom("refresh_tokens")
      .selectAll()
      .where("userId", "=", userId)
      .where("token", "=", token)
      .where("expiresAt", ">", new Date())
      .executeTakeFirst();

    return !!row;
  }

  async revokeRefreshToken(token: string) {
    return this.db
      .deleteFrom("refresh_tokens")
      .where("token", "=", token)
      .execute();
  }

  async revokeAllUserTokens(userId: string) {
    return this.db
      .deleteFrom("refresh_tokens")
      .where("userId", "=", userId)
      .execute();
  }
}

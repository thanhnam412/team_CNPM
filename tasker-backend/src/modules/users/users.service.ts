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

  async getMeProfile(id: string) {
    return this.db
      .selectFrom("users")
      .leftJoin("wallets", "wallets.userId", "users.id")
      .select([
        "users.id",
        "users.email",
        "users.name",
        "users.currentRole",
        "users.avatar",
        "wallets.balance",
        "wallets.escrowBalance",
      ])
      .where("users.id", "=", id)
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

    const userId = crypto.randomUUID();

    const newUser = await this.db
      .insertInto("users")
      .values({
        id: userId,
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatar: input.avatar ?? null,
        updatedAt: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    await this.db
      .insertInto("wallets")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: new Date().toISOString(),
      })
      .execute();

    await this.db
      .insertInto("expert_profiles")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: new Date().toISOString(),
      })
      .execute();

    await this.db
      .insertInto("client_profiles")
      .values({
        id: crypto.randomUUID(),
        userId,
        updatedAt: new Date().toISOString(),
      })
      .execute();

    return newUser;
  }

  async saveRefreshToken(userId: string, token: string, device?: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    return this.db
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

  async switchRole(id: string, role: "CLIENT" | "EXPERT") {
    return this.db
      .updateTable("users")
      .set({ currentRole: role, updatedAt: new Date().toISOString() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async updateProfile(id: string, data: any) {
    const userUpdate: any = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) userUpdate.name = data.name;
    if (data.avatar !== undefined) userUpdate.avatar = data.avatar;
    if (data.location !== undefined) userUpdate.location = data.location;
    if (data.online !== undefined) userUpdate.online = data.online;

    const user = await this.db
      .updateTable("users")
      .set(userUpdate)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();

    if (
      data.title !== undefined ||
      data.bio !== undefined ||
      data.hourlyRate !== undefined ||
      data.skills !== undefined ||
      data.experienceYears !== undefined ||
      data.portfolioUrl !== undefined
    ) {
      const expertUpdate: any = { updatedAt: new Date().toISOString() };
      if (data.title !== undefined) expertUpdate.title = data.title;
      if (data.bio !== undefined) expertUpdate.bio = data.bio;
      if (data.hourlyRate !== undefined)
        expertUpdate.hourlyRate = data.hourlyRate;
      if (data.skills !== undefined)
        expertUpdate.skills = JSON.stringify(data.skills);
      if (data.experienceYears !== undefined)
        expertUpdate.experienceYears = data.experienceYears;
      if (data.portfolioUrl !== undefined)
        expertUpdate.portfolioUrl = data.portfolioUrl;

      await this.db
        .updateTable("expert_profiles")
        .set(expertUpdate)
        .where("userId", "=", id)
        .execute();
    }

    return user;
  }

  async getPublicProfile(id: string) {
    const user = await this.db
      .selectFrom("users")
      .leftJoin("expert_profiles", "expert_profiles.userId", "users.id")
      .select([
        "users.id",
        "users.name",
        "users.email",
        "users.avatar",
        "users.currentRole",
        "users.location",
        "users.online",
        "users.createdAt",
        "expert_profiles.title",
        "expert_profiles.bio",
        "expert_profiles.skills",
        "expert_profiles.hourlyRate",
        "expert_profiles.experienceYears",
        "expert_profiles.portfolioUrl",
        "expert_profiles.rating",
      ])
      .where("users.id", "=", id)
      .executeTakeFirst();

    if (!user) return null;

    // Get completed tasks count
    const completedTasks = await this.db
      .selectFrom("tasks")
      .where("assigneeId", "=", id)
      .where("status", "=", "DONE")
      .execute();

    return {
      ...user,
      username: user.name?.toLowerCase().replace(/\s+/g, ""),
      reviewCount: 0,
      completedTasks: completedTasks.length,
    };
  }
}

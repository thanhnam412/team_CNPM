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
        id: crypto.randomUUID(),
        googleId: input.googleId,
        email: input.email,
        name: input.name,
        avatar: input.avatar ?? null,
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
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (data.name !== undefined) updateData.name = data.name;
    if (data.avatar !== undefined) updateData.avatar = data.avatar;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.rate !== undefined) updateData.rate = data.rate;
    if (data.location !== undefined) updateData.location = data.location;
    if (data.skills !== undefined) updateData.skills = data.skills;
    if (data.online !== undefined) updateData.online = data.online;

    return this.db
      .updateTable("users")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async getPublicProfile(id: string) {
    const user = await this.db
      .selectFrom("users")
      .select([
        "id",
        "name",
        "email",
        "avatar",
        "role",
        "currentRole",
        "title",
        "bio",
        "skills",
        "rate",
        "location",
        "badge",
        "online",
        "createdAt",
      ])
      .where("id", "=", id)
      .executeTakeFirst();

    if (!user) return null;

    // Get review stats
    const reviews = await this.db
      .selectFrom("reviews")
      .select(["rating"])
      .where("expertId", "=", id)
      .execute();

    const avgRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
          )
        : 0;

    // Get completed tasks count
    const completedTasks = await this.db
      .selectFrom("tasks")
      .where("assigneeId", "=", id)
      .where("status", "=", "DONE")
      .execute();

    return {
      ...user,
      username: user.name?.toLowerCase().replace(/\s+/g, ""),
      rating: avgRating,
      reviewCount: reviews.length,
      completedTasks: completedTasks.length,
    };
  }
}

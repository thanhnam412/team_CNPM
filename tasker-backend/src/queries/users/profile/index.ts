import { Kysely } from "kysely";
import { DB } from "@/database/types";
import { UpdateUserProfileDto } from "@/modules/users/core/dto/profile.dto";

export const getMeProfileQuery = async (db: Kysely<DB>, id: string) => {
  return db
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
};

export const switchRoleQuery = async (
  db: Kysely<DB>,
  id: string,
  role: "CLIENT" | "EXPERT",
) => {
  return db
    .updateTable("users")
    .set({ currentRole: role, updatedAt: new Date().toISOString() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const updateProfileQuery = async (
  db: Kysely<DB>,
  id: string,
  data: UpdateUserProfileDto,
) => {
  const userUpdate: any = { updatedAt: new Date().toISOString() };
  if (data.name !== undefined) userUpdate.name = data.name;
  if (data.avatar !== undefined) userUpdate.avatar = data.avatar;
  if (data.location !== undefined) userUpdate.location = data.location;
  if (data.online !== undefined) userUpdate.online = data.online;

  // We use a transaction so both updates succeed or fail together
  return db.transaction().execute(async (trx) => {
    const user = await trx
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

      await trx
        .updateTable("expert_profiles")
        .set(expertUpdate)
        .where("userId", "=", id)
        .execute();
    }

    return user;
  });
};

export const getPublicProfileQuery = async (db: Kysely<DB>, id: string) => {
  const user = await db
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

  // Get completed tasks count (subquery would be better, but keeping it logic-equivalent for now)
  const completedTasks = await db
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
};

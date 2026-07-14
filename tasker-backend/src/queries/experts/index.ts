import { Kysely, Transaction, sql } from "kysely";
import { DB } from "@/database/types";

export const findAllExpertsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  filters: any,
) => {
  let query = db
    .selectFrom("expert_profiles")
    .innerJoin("users", "users.id", "expert_profiles.userId")
    .select([
      "users.id",
      "users.name",
      "users.avatar",
      "users.online",
      "expert_profiles.title",
      "expert_profiles.bio",
      "expert_profiles.skills",
      "expert_profiles.hourlyRate as rate",
      "expert_profiles.rating as profileRating",
    ]);

  if (filters.search) {
    const term = `%${filters.search}%`;
    query = query.where((eb) =>
      eb.or([
        eb("users.name", "ilike", term),
        eb("expert_profiles.title", "ilike", term),
      ]),
    );
  }

  if (filters.online !== undefined) {
    query = query.where("users.online", "=", filters.online);
  }

  if (filters.excludeUserId) {
    query = query.where("users.id", "!=", filters.excludeUserId);
  }

  return query.execute();
};

export const getCompletedTasksCountsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertIds: string[],
) => {
  if (expertIds.length === 0) return [];
  return db
    .selectFrom("tasks")
    .select(["assigneeId", sql<number>`count(*)`.as("completedTasks")])
    .where("assigneeId", "in", expertIds)
    .where("status", "=", "DONE")
    .groupBy("assigneeId")
    .execute();
};

export const findExpertByIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("expert_profiles")
    .innerJoin("users", "users.id", "expert_profiles.userId")
    .select([
      "expert_profiles.id as cvId",
      "users.id",
      "users.name",
      "users.avatar",
      "users.online",
      "users.location",
      "expert_profiles.title",
      "expert_profiles.bio",
      "expert_profiles.skills",
      "expert_profiles.hourlyRate as rate",
      "expert_profiles.portfolioUrl as showcase",
      "expert_profiles.experienceYears",
      "expert_profiles.rating",
    ])
    .where("expert_profiles.userId", "=", id)
    .executeTakeFirst();
};

export const getCompletedTasksCountQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("tasks")
    .select(sql<number>`count(*)`.as("count"))
    .where("assigneeId", "=", id)
    .where("status", "=", "DONE")
    .executeTakeFirst();
};

export const getQuickTasksHistoryQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["id", "title", "budget", "status", "createdAt"])
    .where("expertId", "=", expertId)
    .where("status", "=", "COMPLETED")
    .execute();
};

export const getProjectTasksHistoryQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("tasks")
    .select(["id", "title", "status", "createdAt"])
    .where("assigneeId", "=", expertId)
    .where("status", "=", "DONE")
    .execute();
};

export const getExpertOverviewQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("users")
    .leftJoin("wallets", "wallets.userId", "users.id")
    .select(["wallets.balance"])
    .where("users.id", "=", expertId)
    .executeTakeFirst();
};

export const getMtdTransactionsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
  firstDayOfMonth: Date,
) => {
  return db
    .selectFrom("transactions")
    .select(["amount"])
    .where("userId", "=", expertId)
    .where("type", "=", "PAYMENT_RECEIVED")
    .where("createdAt", ">=", firstDayOfMonth)
    .execute();
};

export const getActiveQuickTasksQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .innerJoin("users as client", "client.id", "quick_tasks.clientId")
    .select([
      "quick_tasks.id",
      "quick_tasks.title",
      "quick_tasks.budget",
      "quick_tasks.deadline",
      "quick_tasks.status",
      "client.name as clientName",
    ])
    .where("quick_tasks.expertId", "=", expertId)
    .where("quick_tasks.status", "in", ["IN_PROGRESS", "REVIEW"])
    .execute();
};

export const getConversationsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("conversation_participants as cp")
    .innerJoin("conversations as c", "c.id", "cp.conversationId")
    .leftJoin("messages as m", "m.conversationId", "c.id")
    .select([
      "c.id as conversationId",
      "c.name as chatName",
      "m.content as lastMessage",
      "m.createdAt as time",
    ])
    .where("cp.userId", "=", expertId)
    .orderBy("m.createdAt", "desc")
    .execute();
};

export const getRecommendedTasksQuery = async (
  db: Kysely<DB> | Transaction<DB>,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["id", "title", "budget", "createdAt"])
    .where("status", "=", "OPEN")
    .where("expertId", "is", null)
    .orderBy("createdAt", "desc")
    .limit(5)
    .execute();
};

export const getMyProfileQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("expert_profiles")
    .selectAll()
    .where("userId", "=", userId)
    .executeTakeFirst();
};

export const updateExpertProfileQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
  updateData: any,
) => {
  return db
    .updateTable("expert_profiles")
    .set(updateData)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const createExpertProfileQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
  data: any,
) => {
  return db
    .insertInto("expert_profiles")
    .values({
      id: crypto.randomUUID(),
      userId,
      title: data.title || null,
      bio: data.bio || null,
      skills: data.skills
        ? typeof data.skills === "string"
          ? data.skills
          : JSON.stringify(data.skills)
        : null,
      hourlyRate: data.hourlyRate || "0",
      experienceYears: data.experienceYears || 0,
      portfolioUrl: data.portfolioUrl || null,
      rating: data.rating || "0",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirst();
};

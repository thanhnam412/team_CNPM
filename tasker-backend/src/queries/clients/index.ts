import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const getClientWalletQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("wallets")
    .where("userId", "=", userId)
    .select(["balance", "escrowBalance"])
    .executeTakeFirst();
};

export const getClientSpentMtdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
  firstDayOfMonth: Date,
) => {
  return db
    .selectFrom("transactions")
    .where("userId", "=", userId)
    .where("type", "=", "SPENT")
    .where("date", ">=", firstDayOfMonth)
    .select(({ fn }) => [fn.sum<string>("amount").as("totalSpent")])
    .executeTakeFirst();
};

export const getClientActiveProjectsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("projects")
    .innerJoin("project_members", "projects.id", "project_members.projectId")
    .where("project_members.userId", "=", userId)
    .where("project_members.role", "=", "CLIENT_ADMIN")
    .where("projects.status", "not in", ["COMPLETED", "CANCELLED"])
    .select([
      "projects.id",
      "projects.title as name",
      "projects.endDate",
      "projects.status",
      "projects.escrow",
    ])
    .orderBy("projects.createdAt", "desc")
    .limit(5)
    .execute();
};

export const getProjectTasksQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  projectId: string,
) => {
  return db
    .selectFrom("tasks")
    .select(["status"])
    .where("projectId", "=", projectId)
    .execute();
};

export const getClientPendingQuickTasksQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .where("clientId", "=", userId)
    .where("status", "in", ["REVIEW", "IN_PROGRESS"])
    .select(["id", "title as task", "expertId"])
    .execute();
};

export const getUserNameQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("users")
    .where("id", "=", userId)
    .select("name")
    .executeTakeFirst();
};

export const getClientPendingMilestonesQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("milestones")
    .innerJoin("projects", "milestones.projectId", "projects.id")
    .innerJoin("project_members", "projects.id", "project_members.projectId")
    .where("project_members.userId", "=", userId)
    .where("project_members.role", "=", "CLIENT_ADMIN")
    .where("milestones.status", "=", "REVIEW")
    .select([
      "milestones.id",
      "milestones.title as task",
      "projects.title as projectName",
      "milestones.assigneeId",
      "projects.id as projectId",
    ])
    .execute();
};

export const getClientUnreadMessagesQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("messages")
    .innerJoin(
      "conversation_participants",
      "messages.conversationId",
      "conversation_participants.conversationId",
    )
    .innerJoin("users", "messages.senderId", "users.id")
    .where("conversation_participants.userId", "=", userId)
    .where("messages.senderId", "!=", userId)
    .select([
      "messages.id",
      "messages.content as msg",
      "messages.createdAt as time",
      "users.name",
      "messages.conversationId",
    ])
    .orderBy("messages.createdAt", "desc")
    .limit(3)
    .execute();
};

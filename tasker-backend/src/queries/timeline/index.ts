import { Kysely } from "kysely";
import { DB } from "@/database/types";

export const getExpertTasksQuery = async (db: Kysely<DB>, expertId: string) => {
  return db
    .selectFrom("tasks")
    .innerJoin("projects", "tasks.projectId", "projects.id")
    .leftJoin("milestones", "tasks.milestoneId", "milestones.id")
    .select([
      "tasks.id",
      "tasks.title",
      "tasks.status",
      "tasks.priority",
      "tasks.createdAt",
      "tasks.updatedAt",
      "projects.id as projectId",
      "projects.title as projectTitle",
      "milestones.title as milestoneName",
    ])
    .where("tasks.assigneeId", "=", expertId)
    .orderBy("tasks.createdAt", "asc")
    .execute();
};

export const getExpertQuickTasksQuery = async (
  db: Kysely<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .innerJoin("users", "users.id", "quick_tasks.clientId")
    .select([
      "quick_tasks.id",
      "quick_tasks.title",
      "quick_tasks.status",
      "quick_tasks.budget",
      "quick_tasks.deadline",
      "quick_tasks.createdAt",
      "quick_tasks.updatedAt",
      "users.name as clientName",
    ])
    .where("quick_tasks.expertId", "=", expertId)
    .orderBy("quick_tasks.createdAt", "asc")
    .execute();
};

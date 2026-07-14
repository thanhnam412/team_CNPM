import { Kysely, Transaction } from 'kysely';
import { DB } from '@/database/types';

export const checkAdminQuery = async (db: Kysely<DB> | Transaction<DB>, userId: string, projectId: string) => {
  return db
    .selectFrom("project_members")
    .select("id")
    .where("projectId", "=", projectId)
    .where("userId", "=", userId)
    .where("role", "=", "CLIENT_ADMIN")
    .executeTakeFirst();
};

export const findTasksByProjectQuery = async (db: Kysely<DB> | Transaction<DB>, projectId: string) => {
  return db
    .selectFrom("tasks")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute();
};

export const findAllTasksForExpertQuery = async (db: Kysely<DB> | Transaction<DB>, expertId: string) => {
  return db
    .selectFrom("tasks")
    .innerJoin("projects", "tasks.projectId", "projects.id")
    .leftJoin("milestones", "tasks.milestoneId", "milestones.id")
    .selectAll("tasks")
    .select([
      "projects.title as projectName",
      "milestones.title as milestoneName",
    ])
    .where("tasks.assigneeId", "=", expertId)
    .execute();
};

export const getMilestoneAssigneeQuery = async (trx: Transaction<DB>, milestoneId: string) => {
  return trx
    .selectFrom("milestones")
    .select("assigneeId")
    .where("id", "=", milestoneId)
    .executeTakeFirst();
};

export const createTaskQuery = async (trx: Transaction<DB>, data: any) => {
  return trx
    .insertInto("tasks")
    .values({
      id: crypto.randomUUID(),
      projectId: data.projectId,
      title: data.title,
      status: (data.status ?? "TODO") as any,
      priority: (data.priority ?? "MEDIUM") as any,
      milestoneId: data.milestoneId ?? null,
      assigneeId: data.assigneeId,
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getTaskForUpdateQuery = async (db: Kysely<DB> | Transaction<DB>, id: string) => {
  return db
    .selectFrom("tasks")
    .select(["projectId", "milestoneId", "assigneeId"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const updateTaskStatusQuery = async (trx: Transaction<DB>, id: string, status: string) => {
  return trx
    .updateTable("tasks")
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const updateTaskQuery = async (db: Kysely<DB> | Transaction<DB>, id: string, patch: any) => {
  return db
    .updateTable("tasks")
    .set({ ...patch, updatedAt: new Date().toISOString() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const getTaskForDeleteQuery = async (trx: Transaction<DB>, id: string) => {
  return trx
    .selectFrom("tasks")
    .select(["id", "milestoneId", "projectId"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const deleteTaskQuery = async (trx: Transaction<DB>, id: string) => {
  return trx.deleteFrom("tasks").where("id", "=", id).execute();
};

export const getMilestoneStatusQuery = async (trx: Transaction<DB>, milestoneId: string) => {
  return trx
    .selectFrom('milestones')
    .select(['status'])
    .where('id', '=', milestoneId)
    .executeTakeFirst();
};

export const getSiblingTasksQuery = async (trx: Transaction<DB>, milestoneId: string) => {
  return trx
    .selectFrom("tasks")
    .select(["status"])
    .where("milestoneId", "=", milestoneId)
    .execute();
};

export const updateMilestoneStatusQuery = async (trx: Transaction<DB>, milestoneId: string, status: string) => {
  return trx
    .updateTable("milestones")
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where("id", "=", milestoneId)
    .execute();
};

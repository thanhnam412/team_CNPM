import { Kysely } from "kysely";
import { DB } from "@/database/types";

export const findAllProjectsQuery = async (db: Kysely<DB> | any) => {
  return db.selectFrom("projects").selectAll().execute();
};

export const findProjectByIdQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("projects")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getProjectTasksStatsQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("tasks")
    .select(["status"])
    .where("projectId", "=", id)
    .execute();
};

export const getProjectMembersStatsQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("project_members")
    .select(["role"])
    .where("projectId", "=", id)
    .execute();
};

export const getUpcomingMilestonesQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("milestones")
    .selectAll()
    .where("projectId", "=", id)
    .orderBy("createdAt", "asc")
    .limit(3)
    .execute();
};

export const createProjectQuery = async (
  db: Kysely<DB> | any,
  userId: string,
  data: any,
) => {
  const tags = {
    type: data.type || "fixed",
    duration: data.duration || "medium",
    commitment: data.commitment || "part",
    ...data.tags,
  };

  const project = await db
    .insertInto("projects")
    .values({
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description || null,
      industry: data.category || data.industry || null,
      requirements: data.technicalScope || data.requirements || null,
      tags: JSON.stringify(tags),
      budget: data.budgetMax?.toString() || data.budget?.toString() || "0",
      spent: "0",
      escrow: "0",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  await db
    .insertInto("project_members")
    .values({
      id: crypto.randomUUID(),
      projectId: project.id,
      userId,
      role: "CLIENT_ADMIN",
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    })
    .execute();

  return project;
};

export const getProjectFinanceQuery = async (
  db: Kysely<DB> | any,
  projectId: string,
) => {
  return db
    .selectFrom("projects")
    .select(["budget", "spent", "escrow"])
    .where("id", "=", projectId)
    .executeTakeFirst();
};

export const getProjectTransactionsQuery = async (
  db: Kysely<DB> | any,
  projectId: string,
) => {
  return db
    .selectFrom("transactions")
    .selectAll()
    .where("projectId", "=", projectId)
    .orderBy("createdAt", "desc")
    .execute();
};

export const getProjectMilestonesQuery = async (
  db: Kysely<DB> | any,
  projectId: string,
) => {
  return db
    .selectFrom("milestones")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute();
};

export const getMilestoneProposalsQuery = async (
  db: Kysely<DB> | any,
  milestoneIds: string[],
) => {
  if (milestoneIds.length === 0) return [];
  return db
    .selectFrom("proposals")
    .selectAll()
    .where("milestoneId", "in", milestoneIds)
    .execute();
};

export const updateProjectFinanceQuery = async (
  db: Kysely<DB> | any,
  projectId: string,
  newBudget: string,
  newEscrow: string,
) => {
  return db
    .updateTable("projects")
    .set({
      budget: newBudget,
      escrow: newEscrow,
      updatedAt: new Date().toISOString(),
    })
    .where("id", "=", projectId)
    .execute();
};

export const updateProjectQuery = async (
  db: Kysely<DB> | any,
  id: string,
  updateData: any,
) => {
  return db
    .updateTable("projects")
    .set(updateData)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const checkProjectActiveTransactionsQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("transactions")
    .select(["id"])
    .where("projectId", "=", id)
    .limit(1)
    .execute();
};

export const checkProjectActiveMilestonesQuery = async (
  db: Kysely<DB> | any,
  id: string,
) => {
  return db
    .selectFrom("milestones")
    .select(["id"])
    .where("projectId", "=", id)
    .where("status", "in", ["ACTIVE", "REVIEW", "PAID"])
    .limit(1)
    .execute();
};

export const deleteProjectQuery = async (db: Kysely<DB> | any, id: string) => {
  return db.deleteFrom("projects").where("id", "=", id).execute();
};

import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const checkMilestoneAdminQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
  projectId: string,
) => {
  return db
    .selectFrom("project_members")
    .select("id")
    .where("projectId", "=", projectId)
    .where("userId", "=", userId)
    .where("role", "=", "CLIENT_ADMIN")
    .executeTakeFirst();
};

export const findMilestonesByProjectQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  projectId: string,
) => {
  return db
    .selectFrom("milestones")
    .selectAll()
    .where("projectId", "=", projectId)
    .execute();
};

export const findMilestoneProposalsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneIds: string[],
) => {
  if (milestoneIds.length === 0) return [];
  return db
    .selectFrom("proposals as p")
    .innerJoin("users as u", "u.id", "p.expertId")
    .select([
      "p.id",
      "p.milestoneId",
      "p.proposedPrice as amount",
      "p.coverLetter",
      "p.status",
      "u.name as expertName",
      "u.avatar",
    ])
    .where("p.milestoneId", "in", milestoneIds)
    .execute();
};

export const findAvailableMilestonesQuery = async (
  db: Kysely<DB> | Transaction<DB>,
) => {
  return db
    .selectFrom("milestones as m")
    .innerJoin("projects as p", "p.id", "m.projectId")
    .select([
      "m.id",
      "m.title",
      "m.budget",
      "m.status",
      "m.projectId",
      "p.title as projectTitle",
    ])
    .where("m.status", "=", "PENDING")
    .execute();
};

export const findMilestoneByIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("milestones")
    .selectAll()
    .where("id", "=", milestoneId)
    .executeTakeFirst();
};

export const getMilestoneProposalsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("proposals as p")
    .innerJoin("users as u", "u.id", "p.expertId")
    .select([
      "p.id",
      "p.proposedPrice as amount",
      "p.coverLetter as message",
      "p.status",
      "u.name as expertName",
      "u.avatar",
      "p.expertId",
    ])
    .where("p.milestoneId", "=", milestoneId)
    .execute();
};

export const createMilestoneQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  projectId: string,
  data: any,
) => {
  return db
    .insertInto("milestones")
    .values({
      id: crypto.randomUUID(),
      projectId,
      title: data.title,
      budget: (data.amount ?? data.budget ?? 0).toString(),
      status: "PENDING",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getMilestoneProjectQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("milestones")
    .select("projectId")
    .where("id", "=", id)
    .executeTakeFirst();
};

export const updateMilestoneQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
  patch: any,
) => {
  return db
    .updateTable("milestones")
    .set(patch)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const updateMilestoneStatusQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
  status: string,
) => {
  return db
    .updateTable("milestones")
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const getAcceptedProposalQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("proposals")
    .select("expertId")
    .where("milestoneId", "=", milestoneId)
    .where("status", "=", "ACCEPTED")
    .executeTakeFirst();
};

export const getMilestoneStatusAndProjectQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("milestones")
    .select(["status", "projectId"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const deletePendingProposalsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .deleteFrom("proposals")
    .where("milestoneId", "=", milestoneId)
    .where("status", "=", "PENDING")
    .execute();
};

export const deleteMilestoneQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db.deleteFrom("milestones").where("id", "=", id).execute();
};

export const activateMilestoneQuery = async (
  trx: Transaction<DB>,
  milestoneId: string,
  expertId: string,
  price: number,
) => {
  const milestone = await trx
    .selectFrom("milestones")
    .selectAll()
    .where("id", "=", milestoneId)
    .executeTakeFirstOrThrow();

  await trx
    .updateTable("milestones")
    .set({
      assigneeId: expertId,
      status: "ACTIVE" as any,
      updatedAt: new Date().toISOString(),
    })
    .where("id", "=", milestoneId)
    .execute();

  const project = await trx
    .selectFrom("projects")
    .select("escrow")
    .where("id", "=", milestone.projectId)
    .executeTakeFirstOrThrow();

  const newEscrow = (Number(project.escrow) + price).toString();
  await trx
    .updateTable("projects")
    .set({ escrow: newEscrow, updatedAt: new Date().toISOString() })
    .where("id", "=", milestone.projectId)
    .execute();

  const existing = await trx
    .selectFrom("project_members")
    .select(["id"])
    .where("projectId", "=", milestone.projectId)
    .where("userId", "=", expertId)
    .executeTakeFirst();

  if (!existing) {
    await trx
      .insertInto("project_members")
      .values({
        id: crypto.randomUUID(),
        projectId: milestone.projectId,
        userId: expertId,
        role: "EXPERT",
        status: "ACTIVE",
        updatedAt: new Date().toISOString(),
      })
      .execute();
  }
};

export const markMilestoneAsPaidQuery = async (
  trx: Transaction<DB>,
  milestoneId: string,
  amount: number,
) => {
  const milestone = await trx
    .selectFrom("milestones")
    .selectAll()
    .where("id", "=", milestoneId)
    .executeTakeFirstOrThrow();

  await trx
    .updateTable("milestones")
    .set({ status: "PAID" as any, updatedAt: new Date().toISOString() })
    .where("id", "=", milestoneId)
    .execute();

  const project = await trx
    .selectFrom("projects")
    .select(["id", "escrow", "spent"])
    .where("id", "=", milestone.projectId)
    .executeTakeFirst();

  if (project) {
    const newEscrow = Math.max(0, Number(project.escrow) - amount);
    const newSpent = Number(project.spent) + amount;

    await trx
      .updateTable("projects")
      .set({
        escrow: newEscrow.toString(),
        spent: newSpent.toString(),
        updatedAt: new Date().toISOString(),
      })
      .where("id", "=", project.id)
      .execute();
  }
};

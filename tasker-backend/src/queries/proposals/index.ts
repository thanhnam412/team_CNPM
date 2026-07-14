import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const findProposalByIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  proposalId: string,
) => {
  return db
    .selectFrom("proposals")
    .selectAll()
    .where("id", "=", proposalId)
    .executeTakeFirst();
};

export const findProposalsForTaskQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  quickTaskId: string,
) => {
  return db
    .selectFrom("proposals")
    .selectAll()
    .where("quickTaskId", "=", quickTaskId)
    .execute();
};

export const findProposalsForMilestoneQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("proposals")
    .selectAll()
    .where("milestoneId", "=", milestoneId)
    .execute();
};

export const findProposalsForExpertQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("proposals")
    .leftJoin("quick_tasks", "proposals.quickTaskId", "quick_tasks.id")
    .leftJoin("milestones", "proposals.milestoneId", "milestones.id")
    .leftJoin("projects", "milestones.projectId", "projects.id")
    .select([
      "proposals.id",
      "proposals.quickTaskId",
      "proposals.milestoneId",
      "proposals.coverLetter",
      "proposals.proposedPrice",
      "proposals.estimatedDays",
      "proposals.status",
      "proposals.createdAt",
      "quick_tasks.title as quickTaskTitle",
      "milestones.title as milestoneTitle",
      "projects.title as projectTitle",
      "projects.id as projectId",
    ])
    .where("proposals.expertId", "=", expertId)
    .orderBy("proposals.createdAt", "desc")
    .execute();
};

export const getQuickTaskStatusAndClientQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  quickTaskId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["clientId", "status", "budget"])
    .where("id", "=", quickTaskId)
    .executeTakeFirst();
};

export const getMilestoneStatusAndProjectQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("milestones")
    .select(["projectId", "status", "budget"])
    .where("id", "=", milestoneId)
    .executeTakeFirst();
};

export const getProjectClientAdminQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  projectId: string,
) => {
  return db
    .selectFrom("project_members")
    .select(["userId"])
    .where("projectId", "=", projectId)
    .where("role", "=", "CLIENT_ADMIN")
    .executeTakeFirst();
};

export const createProposalQuery = async (
  trx: Transaction<DB>,
  quickTaskId: string | null,
  milestoneId: string | null,
  expertId: string,
  data: any,
) => {
  const proposal = await trx
    .insertInto("proposals")
    .values({
      id: crypto.randomUUID(),
      quickTaskId,
      milestoneId,
      expertId,
      coverLetter: data.coverLetter,
      proposedPrice: (data.proposedPrice ?? 0).toString(),
      estimatedDays: data.estimatedDays ?? 0,
      status: "PENDING",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  if (quickTaskId) {
    await trx
      .updateTable("quick_tasks")
      .set((eb) => ({ proposalsCount: eb("proposalsCount", "+", 1) }))
      .where("id", "=", quickTaskId)
      .execute();
  }

  return proposal;
};

export const acceptProposalQuery = async (
  trx: Transaction<DB>,
  proposalId: string,
) => {
  const proposal = await trx
    .selectFrom("proposals")
    .selectAll()
    .where("id", "=", proposalId)
    .executeTakeFirstOrThrow();

  await trx
    .updateTable("proposals")
    .set({ status: "ACCEPTED" as any, updatedAt: new Date().toISOString() })
    .where("id", "=", proposalId)
    .execute();

  if (proposal.quickTaskId) {
    await trx
      .updateTable("proposals")
      .set({ status: "REJECTED" as any, updatedAt: new Date().toISOString() })
      .where("quickTaskId", "=", proposal.quickTaskId)
      .where("id", "!=", proposalId)
      .where("status", "=", "PENDING")
      .execute();
  }

  if (proposal.milestoneId) {
    await trx
      .updateTable("proposals")
      .set({ status: "REJECTED" as any, updatedAt: new Date().toISOString() })
      .where("milestoneId", "=", proposal.milestoneId)
      .where("id", "!=", proposalId)
      .where("status", "=", "PENDING")
      .execute();
  }
};

export const updateProposalStatusQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  proposalId: string,
  status: "REJECTED" | "WITHDRAWN",
) => {
  return db
    .updateTable("proposals")
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where("id", "=", proposalId)
    .returningAll()
    .executeTakeFirst();
};

export const getProjectIdFromMilestoneQuery = async (
  trx: Transaction<DB> | any,
  milestoneId: string,
) => {
  return trx
    .selectFrom("milestones")
    .select(["projectId"])
    .where("id", "=", milestoneId)
    .executeTakeFirst();
};

export const insertProposalNegotiationQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  proposalId: string,
  actorId: string,
  actorRole: string,
  offeredPrice: number,
) => {
  return db
    .insertInto("proposal_negotiations")
    .values({
      id: crypto.randomUUID(),
      proposalId,
      actorId,
      actorRole,
      offeredPrice: offeredPrice.toString(),
      status: "PENDING",
      createdAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const findNegotiationsForProposalQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  proposalId: string,
) => {
  return db
    .selectFrom("proposal_negotiations")
    .selectAll()
    .where("proposalId", "=", proposalId)
    .orderBy("createdAt", "asc")
    .execute();
};

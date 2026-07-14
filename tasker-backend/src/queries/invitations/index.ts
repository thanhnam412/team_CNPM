import { Kysely } from "kysely";
import { DB } from "@/database/types";

export const getInvitationQuery = async (db: Kysely<DB> | any, params: any) => {
  let query = db
    .selectFrom("invitations")
    .select(["id"])
    .where("clientId", "=", params.clientId)
    .where("expertId", "=", params.expertId);

  if (params.quickTaskId)
    query = query.where("quickTaskId", "=", params.quickTaskId);
  else if (params.milestoneId)
    query = query.where("milestoneId", "=", params.milestoneId);
  else if (params.projectId)
    query = query.where("projectId", "=", params.projectId);

  return query.executeTakeFirst();
};

export const insertInvitationQuery = async (
  db: Kysely<DB> | any,
  data: any,
) => {
  return db
    .insertInto("invitations")
    .values(data)
    .returningAll()
    .executeTakeFirst();
};

export const findInvitationsByExpertQuery = async (
  db: Kysely<DB>,
  expertId: string,
) => {
  return db
    .selectFrom("invitations")
    .innerJoin("users as client", "client.id", "invitations.clientId")
    .leftJoin("projects", "projects.id", "invitations.projectId")
    .leftJoin("milestones", "milestones.id", "invitations.milestoneId")
    .select([
      "invitations.id",
      "invitations.message",
      "invitations.budget",
      "invitations.status",
      "invitations.createdAt",
      "client.id as clientId",
      "client.name as clientName",
      "client.avatar as clientAvatar",
      "projects.id as projectId",
      "projects.title as projectTitle",
      "milestones.id as milestoneId",
      "milestones.title as milestoneTitle",
    ])
    .where("expertId", "=", expertId)
    .orderBy("invitations.createdAt", "desc")
    .execute();
};

export const findInvitationsByClientQuery = async (
  db: Kysely<DB>,
  clientId: string,
) => {
  return db
    .selectFrom("invitations")
    .innerJoin("users as expert", "expert.id", "invitations.expertId")
    .leftJoin("expert_profiles as ep", "ep.userId", "expert.id")
    .leftJoin("projects", "projects.id", "invitations.projectId")
    .leftJoin("milestones", "milestones.id", "invitations.milestoneId")
    .select([
      "invitations.id",
      "invitations.message",
      "invitations.budget",
      "invitations.status",
      "invitations.createdAt",
      "expert.id as expertId",
      "expert.name as expertName",
      "expert.avatar as expertAvatar",
      "ep.title as expertTitle",
      "projects.id as projectId",
      "projects.title as projectTitle",
      "milestones.id as milestoneId",
      "milestones.title as milestoneTitle",
    ])
    .where("clientId", "=", clientId)
    .orderBy("invitations.createdAt", "desc")
    .execute();
};

export const getInvitationStatusQuery = async (trx: any, id: string) => {
  return trx
    .selectFrom("invitations")
    .select(["status"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const updateInvitationStatusQuery = async (
  trx: any,
  id: string,
  status: string,
) => {
  return trx
    .updateTable("invitations")
    .set({ status: status as any, updatedAt: new Date() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const checkProjectMemberQuery = async (
  trx: any,
  projectId: string,
  userId: string,
) => {
  return trx
    .selectFrom("project_members")
    .select(["id"])
    .where("projectId", "=", projectId)
    .where("userId", "=", userId)
    .executeTakeFirst();
};

export const insertProjectMemberQuery = async (trx: any, data: any) => {
  return trx.insertInto("project_members").values(data).execute();
};

export const updateQuickTaskExpertQuery = async (
  trx: any,
  quickTaskId: string,
  expertId: string,
) => {
  return trx
    .updateTable("quick_tasks")
    .set({
      expertId: expertId,
      status: "IN_PROGRESS" as any,
      updatedAt: new Date(),
    })
    .where("id", "=", quickTaskId)
    .execute();
};

export const insertContractQuery = async (trx: any, data: any) => {
  return trx.insertInto("contracts").values(data).execute();
};

export const updateMilestoneStatusQuery = async (
  trx: any,
  milestoneId: string,
) => {
  return trx
    .updateTable("milestones")
    .set({ status: "ACTIVE" as any, updatedAt: new Date() })
    .where("id", "=", milestoneId)
    .execute();
};

import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const findContractsByUserQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("contracts")
    .selectAll()
    .where((eb) =>
      eb.or([eb("clientId", "=", userId), eb("expertId", "=", userId)]),
    )
    .orderBy("createdAt", "desc")
    .execute();
};

export const findContractByIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  contractId: string,
) => {
  return db
    .selectFrom("contracts")
    .selectAll()
    .where("id", "=", contractId)
    .executeTakeFirst();
};

export const findContractByMilestoneQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  milestoneId: string,
) => {
  return db
    .selectFrom("contracts")
    .selectAll()
    .where("milestoneId", "=", milestoneId)
    .executeTakeFirst();
};

export const createContractQuery = async (trx: Transaction<DB>, data: any) => {
  return trx
    .insertInto("contracts")
    .values({
      id: crypto.randomUUID(),
      milestoneId: data.milestoneId ?? null,
      quickTaskId: data.quickTaskId ?? null,
      expertId: data.expertId,
      clientId: data.clientId,
      agreedPrice: data.agreedPrice.toString(),
      escrowStatus: "HELD",
      updatedAt: new Date().toISOString(),
    })
    .execute();
};

export const getClientContractQuery = async (
  trx: Transaction<DB>,
  contractId: string,
  clientId: string,
) => {
  return trx
    .selectFrom("contracts")
    .selectAll()
    .where("id", "=", contractId)
    .where("clientId", "=", clientId)
    .executeTakeFirst();
};

export const markQuickTaskCompletedQuery = async (
  trx: Transaction<DB>,
  quickTaskId: string,
) => {
  return trx
    .updateTable("quick_tasks")
    .set({ status: "COMPLETED" as any, updatedAt: new Date().toISOString() })
    .where("id", "=", quickTaskId)
    .execute();
};

export const markContractReleasedQuery = async (
  trx: Transaction<DB>,
  contractId: string,
) => {
  return trx
    .updateTable("contracts")
    .set({
      escrowStatus: "RELEASED" as any,
      updatedAt: new Date().toISOString(),
    })
    .where("id", "=", contractId)
    .execute();
};

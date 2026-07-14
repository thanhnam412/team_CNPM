import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const findAllQuickTasksQuery = async (
  db: Kysely<DB> | Transaction<DB>,
) => {
  return db.selectFrom("quick_tasks").selectAll().execute();
};

export const findQuickTaskByIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
};

export const createQuickTaskQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  clientId: string,
  data: any,
) => {
  return db
    .insertInto("quick_tasks")
    .values({
      id: crypto.randomUUID(),
      clientId,
      expertId: data.expertId || null,
      title: data.title,
      description: data.description,
      status: data.status || "OPEN",
      budget: data.budget?.toString() || "0",
      deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
      proposalsCount: 0,
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirst();
};

export const findQuickTasksByClientQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  clientId: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .selectAll()
    .where("clientId", "=", clientId)
    .orderBy("createdAt", "desc")
    .execute();
};

export const updateQuickTaskQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
  updateData: any,
) => {
  return db
    .updateTable("quick_tasks")
    .set(updateData)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const updateQuickTaskStatusQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
  status: string,
) => {
  return db
    .updateTable("quick_tasks")
    .set({ status: status as any, updatedAt: new Date().toISOString() })
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
};

export const getQuickTaskStatusAndExpertQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["status", "expertId"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getQuickTaskStatusAndClientQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["status", "clientId"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const getQuickTaskStatusQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("quick_tasks")
    .select(["status"])
    .where("id", "=", id)
    .executeTakeFirst();
};

export const checkQuickTaskContractQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db
    .selectFrom("contracts")
    .select(["id"])
    .where("quickTaskId", "=", id)
    .limit(1)
    .execute();
};

export const deleteQuickTaskQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  return db.deleteFrom("quick_tasks").where("id", "=", id).execute();
};

export const assignExpertToQuickTaskQuery = async (
  trx: Transaction<DB>,
  quickTaskId: string,
  expertId: string,
) => {
  return trx
    .updateTable("quick_tasks")
    .set({
      expertId,
      status: "IN_PROGRESS" as any,
      updatedAt: new Date().toISOString(),
    })
    .where("id", "=", quickTaskId)
    .execute();
};

/**
 * Fetch QuickTaskSnapshot để truyền vào logic layer.
 * JOIN với contracts để lấy contractEscrowStatus (null nếu chưa có contract).
 * Service gọi hàm này trước khi gọi bất kỳ case nào trong src/logic/quick-task/.
 */
export const getQuickTaskSnapshotQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  id: string,
) => {
  const row = await db
    .selectFrom("quick_tasks")
    .leftJoin("contracts", "contracts.quickTaskId", "quick_tasks.id")
    .select([
      "quick_tasks.id",
      "quick_tasks.status",
      "quick_tasks.expertId",
      "quick_tasks.clientId",
      "contracts.escrowStatus as contractEscrowStatus",
    ])
    .where("quick_tasks.id", "=", id)
    .executeTakeFirst();

  if (!row) return null;

  return {
    id: row.id,
    status: row.status as import("@/modules/quick-tasks/core/domain").QuickTaskStatus,
    expertId: row.expertId,
    clientId: row.clientId,
    contractEscrowStatus: row.contractEscrowStatus as
      | import("@/modules/quick-tasks/core/domain").ContractEscrowStatus
      | null,
  };
};

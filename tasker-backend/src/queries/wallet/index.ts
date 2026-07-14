import { Kysely, Transaction } from "kysely";
import { DB } from "@/database/types";

export const getWalletByUserIdQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("wallets")
    .selectAll()
    .where("userId", "=", userId)
    .executeTakeFirst();
};

export const createWalletQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .insertInto("wallets")
    .values({
      id: crypto.randomUUID(),
      userId,
      balance: "0",
      escrowBalance: "0",
      currency: "USD",
      status: "ACTIVE",
      updatedAt: new Date().toISOString(),
    })
    .returningAll()
    .executeTakeFirstOrThrow();
};

export const getUserTransactionsQuery = async (
  db: Kysely<DB> | Transaction<DB>,
  userId: string,
) => {
  return db
    .selectFrom("transactions")
    .selectAll()
    .where("userId", "=", userId)
    .orderBy("date", "desc")
    .execute();
};

export const updateWalletQuery = async (
  trx: Transaction<DB>,
  walletId: string,
  updateData: any,
) => {
  return trx
    .updateTable("wallets")
    .set({ ...updateData, updatedAt: new Date().toISOString() })
    .where("id", "=", walletId)
    .execute();
};

export const insertTransactionQuery = async (
  trx: Transaction<DB>,
  data: any,
) => {
  return trx
    .insertInto("transactions")
    .values({
      id: crypto.randomUUID(),
      userId: data.userId,
      type: data.type,
      amount: data.amount.toString(),
      balanceAfter: data.balanceAfter.toString(),
      desc: data.desc,
      source: data.source,
      status: data.status,
      date: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      ...(data.projectId ? { projectId: data.projectId } : {}),
    })
    .execute();
};

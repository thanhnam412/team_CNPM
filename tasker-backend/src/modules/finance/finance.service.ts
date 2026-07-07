/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class FinanceService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getWallet(userId: string) {
    let wallet = await this.db
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    // Auto-create wallet if it doesn't exist
    if (!wallet) {
      wallet = await this.db
        .insertInto("wallets")
        .values({
          id: crypto.randomUUID(),
          userId,
          balance: "0",
          escrowBalance: "0",
          currency: "USD",
          status: "ACTIVE",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }
    return wallet;
  }

  async getTransactions(userId: string) {
    return this.db
      .selectFrom("transactions")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("date", "desc")
      .execute();
  }

  async createTransaction(userId: string, data: any) {
    return this.db
      .insertInto("transactions")
      .values({
        id: crypto.randomUUID(),
        userId,
        desc: data.desc,
        type: data.type,
        amount: data.amount?.toString() || "0",
        balanceAfter: data.balanceAfter?.toString() || "0",
        source: data.source || "System",
        status: data.status || "COMPLETED",
        date: new Date(),
        createdAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async mockTopup(userId: string, amount: number) {
    const wallet = await this.getWallet(userId);
    const newBalance = Number(wallet.balance) + amount;

    await this.db
      .updateTable("wallets")
      .set({ balance: newBalance.toString(), updatedAt: new Date() })
      .where("id", "=", wallet.id)
      .execute();

    await this.db
      .insertInto("transactions")
      .values({
        id: crypto.randomUUID(),
        userId,
        desc: `Mock Deposit (Momo)`,
        type: "DEPOSIT",
        amount: amount.toString(),
        balanceAfter: newBalance.toString(),
        source: "MOCK_MOMO",
        status: "COMPLETED",
        date: new Date(),
        createdAt: new Date(),
      } as any)
      .execute();

    return { success: true, newBalance };
  }
}

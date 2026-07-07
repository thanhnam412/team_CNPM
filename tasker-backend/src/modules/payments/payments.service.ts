/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class PaymentsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getBalance(userId: string) {
    const wallet = await this.db
      .selectFrom("wallets")
      .select(["balance", "escrowBalance"])
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!wallet) throw new Error("Wallet not found");
    return wallet;
  }

  async getTransactions(userId: string) {
    return this.db
      .selectFrom("transactions")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("createdAt", "desc")
      .execute();
  }

  // MOCK: Nạp tiền giả lập cho môi trường Dev (Bỏ qua Momo)
  async mockTopup(userId: string, amount: number) {
    return this.db.transaction().execute(async (trx) => {
      // Fetch current wallet
      const currentWallet = await trx
        .selectFrom("wallets")
        .select(["id", "balance"])
        .where("userId", "=", userId)
        .executeTakeFirstOrThrow();

      // Caculate new balance safely
      const newBalance = (
        parseFloat(currentWallet.balance as unknown as string) + amount
      ).toString();

      // Cập nhật số dư
      const wallet = await trx
        .updateTable("wallets")
        .set({
          balance: newBalance,
          updatedAt: new Date(),
        })
        .where("userId", "=", userId)
        .returning(["balance"])
        .executeTakeFirstOrThrow();

      // Ghi log giao dịch
      await trx
        .insertInto("transactions")
        .values({
          id: crypto.randomUUID(),
          userId,
          date: new Date(),
          desc: `Mock Deposit (Nạp thử nghiệm)`,
          type: "DEPOSIT" as any,
          amount: amount.toString(),
          balanceAfter: wallet.balance.toString(),
          status: "Success",
          source: "Mock System",
          createdAt: new Date(),
        })
        .execute();

      return { success: true, newBalance: wallet.balance };
    });
  }
}

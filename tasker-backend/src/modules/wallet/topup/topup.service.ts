import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  createWalletQuery,
  getWalletByUserIdQuery,
  insertTransactionQuery,
  updateWalletQuery,
} from "@/queries/wallet";

@Injectable()
export class TopupService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async mockTopup(userId: string, amount: number) {
    return this.db.transaction().execute(async (trx) => {
      let wallet = await getWalletByUserIdQuery(trx, userId);

      if (!wallet) {
        wallet = await createWalletQuery(trx, userId);
      }

      const newBalance = Number(wallet.balance) + amount;

      await updateWalletQuery(trx, wallet.id, {
        balance: newBalance.toString(),
      });

      await insertTransactionQuery(trx, {
        userId,
        type: "DEPOSIT",
        amount: amount,
        balanceAfter: newBalance,
        desc: "Mock Topup",
        source: "BANK_TRANSFER",
        status: "COMPLETED",
      });

      return { success: true, newBalance };
    });
  }
  
  async mockWithdraw(userId: string, amount: number) {
    return this.db.transaction().execute(async (trx) => {
      let wallet = await getWalletByUserIdQuery(trx, userId);

      if (!wallet) {
        throw new Error("Wallet not found");
      }

      const numAmount = Number(amount);
      const currentBalance = Number(wallet.balance);

      if (currentBalance < numAmount) {
        throw new Error("Insufficient funds");
      }

      const newBalance = currentBalance - numAmount;

      await updateWalletQuery(trx, wallet.id, {
        balance: newBalance.toString(),
      });

      await insertTransactionQuery(trx, {
        userId,
        type: "WITHDRAWAL",
        amount: numAmount,
        balanceAfter: newBalance,
        desc: "Mock Withdrawal",
        source: "BANK_TRANSFER",
        status: "COMPLETED",
      });

      return { success: true, newBalance };
    });
  }
}

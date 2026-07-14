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
        type: "CREDIT",
        amount: amount,
        balanceAfter: newBalance,
        desc: "Mock Topup",
        source: "BANK_TRANSFER",
        status: "COMPLETED",
      });

      return { success: true, newBalance };
    });
  }
}

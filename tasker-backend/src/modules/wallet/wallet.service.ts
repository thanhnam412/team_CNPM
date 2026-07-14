import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  createWalletQuery,
  getUserTransactionsQuery,
  getWalletByUserIdQuery,
} from "@/queries/wallet";
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
@Injectable()
export class WalletService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getWalletByUserId(userId: string) {
    let wallet = await getWalletByUserIdQuery(this.db, userId);

    if (!wallet) {
      wallet = await createWalletQuery(this.db, userId);
    }

    return {
      balance: Number(wallet.balance),
      escrowBalance: Number(wallet.escrowBalance),
      currency: wallet.currency,
    };
  }

  async getTransactions(userId: string) {
    const txs = await getUserTransactionsQuery(this.db, userId);
    return txs.map((tx) => ({
      ...tx,
      amount: Number(tx.amount),
      balanceAfter: Number(tx.balanceAfter),
    }));
  }
}

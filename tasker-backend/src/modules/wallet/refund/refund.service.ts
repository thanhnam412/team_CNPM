import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getWalletByUserIdQuery,
  insertTransactionQuery,
  updateWalletQuery,
} from "@/queries/wallet";
import { WalletSnapshot } from "@/modules/wallet/core/domain";
import { validateLogic } from "../core/utils/wallet";

@Injectable()
export class RefundService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async processRefund(
    trx: Transaction<DB>,
    userId: string,
    amount: number,
    desc?: string,
    projectId?: string,
  ) {
    const wallet = await getWalletByUserIdQuery(trx, userId);
    if (!wallet) throw new InternalServerErrorException("Wallet not found");

    const snapshot: WalletSnapshot = {
      balance: Number(wallet.balance),
      escrowBalance: Number(wallet.escrowBalance),
    };

    validateLogic("REFUND", snapshot, amount);

    const newEscrow = snapshot.escrowBalance - amount;
    const newBalance = snapshot.balance + amount;

    await updateWalletQuery(trx, wallet.id, {
      balance: newBalance.toString(),
      escrowBalance: newEscrow.toString(),
    });

    await insertTransactionQuery(trx, {
      userId,
      projectId,
      type: "CREDIT",
      amount: amount,
      balanceAfter: newBalance,
      desc: desc || "Refund from Escrow",
      source: "INTERNAL",
      status: "COMPLETED",
    });
  }
}

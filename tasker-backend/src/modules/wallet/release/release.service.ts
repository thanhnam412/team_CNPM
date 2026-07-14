import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  createWalletQuery,
  getWalletByUserIdQuery,
  insertTransactionQuery,
  updateWalletQuery,
} from "@/queries/wallet";
import { WalletSnapshot } from "@/modules/wallet/core/domain";
import { validateLogic } from "../core/utils/wallet";

@Injectable()
export class ReleaseService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async processRelease(
    trx: Transaction<DB>,
    clientId: string,
    expertId: string,
    amount: number,
    desc?: string,
    projectId?: string,
  ) {
    const clientWallet = await getWalletByUserIdQuery(trx, clientId);
    if (!clientWallet)
      throw new InternalServerErrorException("Client wallet not found");

    const snapshot: WalletSnapshot = {
      balance: Number(clientWallet.balance),
      escrowBalance: Number(clientWallet.escrowBalance),
    };

    const { feeAmount, expertAmount } = validateLogic(
      "RELEASE",
      snapshot,
      amount,
    );

    const newClientEscrow = snapshot.escrowBalance - amount;

    await updateWalletQuery(trx, clientWallet.id, {
      escrowBalance: newClientEscrow.toString(),
    });

    await insertTransactionQuery(trx, {
      userId: clientId,
      projectId,
      type: "DEBIT",
      amount: amount,
      balanceAfter: snapshot.balance,
      desc: `Release escrow to expert ${expertId}`,
      source: "INTERNAL",
      status: "COMPLETED",
    });

    if (feeAmount > 0) {
      await insertTransactionQuery(trx, {
        userId: clientId, // Or SYSTEM user if there's one
        projectId,
        type: "DEBIT",
        amount: feeAmount,
        balanceAfter: snapshot.balance,
        desc: `Platform fee (1%) for releasing escrow`,
        source: "INTERNAL",
        status: "COMPLETED",
      });
    }

    let expertWallet = await getWalletByUserIdQuery(trx, expertId);
    if (!expertWallet) {
      expertWallet = await createWalletQuery(trx, expertId);
    }

    const newExpertBalance = Number(expertWallet.balance) + expertAmount;

    await updateWalletQuery(trx, expertWallet.id, {
      balance: newExpertBalance.toString(),
    });

    await insertTransactionQuery(trx, {
      userId: expertId,
      projectId,
      type: "CREDIT",
      amount: expertAmount,
      balanceAfter: newExpertBalance,
      desc: `Receive payment from client ${clientId} (after fee)`,
      source: "INTERNAL",
      status: "COMPLETED",
    });
  }
}

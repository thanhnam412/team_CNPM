import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  createWalletQuery,
  getUserTransactionsQuery,
  getWalletByUserIdQuery,
  insertTransactionQuery,
  updateWalletQuery,
} from "@/queries/wallet";
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";

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

  async processEscrow(
    trx: Transaction<DB>,
    userId: string,
    amount: number,
    desc?: string,
    projectId?: string,
  ) {
    const wallet = await getWalletByUserIdQuery(trx, userId);
    if (!wallet) throw new InternalServerErrorException("Wallet not found");

    const newBalance = Number(wallet.balance) - amount;
    const newEscrow = Number(wallet.escrowBalance) + amount;

    if (newBalance < 0) {
      throw new InternalServerErrorException("Insufficient balance");
    }

    await updateWalletQuery(trx, wallet.id, {
      balance: newBalance.toString(),
      escrowBalance: newEscrow.toString(),
    });

    await insertTransactionQuery(trx, {
      userId,
      projectId,
      type: "DEBIT",
      amount: amount,
      balanceAfter: newBalance,
      desc: desc || "Escrow for project/milestone",
      source: "INTERNAL",
      status: "COMPLETED",
    });
  }

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

    const newClientEscrow = Number(clientWallet.escrowBalance) - amount;
    if (newClientEscrow < 0) {
      throw new InternalServerErrorException("Insufficient escrow balance");
    }

    await updateWalletQuery(trx, clientWallet.id, {
      escrowBalance: newClientEscrow.toString(),
    });

    await insertTransactionQuery(trx, {
      userId: clientId,
      projectId,
      type: "DEBIT",
      amount: amount,
      balanceAfter: Number(clientWallet.balance),
      desc: `Release escrow to expert ${expertId}`,
      source: "INTERNAL",
      status: "COMPLETED",
    });

    let expertWallet = await getWalletByUserIdQuery(trx, expertId);
    if (!expertWallet) {
      expertWallet = await createWalletQuery(trx, expertId);
    }

    const newExpertBalance = Number(expertWallet.balance) + amount;

    await updateWalletQuery(trx, expertWallet.id, {
      balance: newExpertBalance.toString(),
    });

    await insertTransactionQuery(trx, {
      userId: expertId,
      projectId,
      type: "CREDIT",
      amount: amount,
      balanceAfter: newExpertBalance,
      desc: `Receive payment from client ${clientId}`,
      source: "INTERNAL",
      status: "COMPLETED",
    });
  }
}

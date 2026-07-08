import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

/**
 * WalletService — DOMAIN OWNER của: wallets, transactions
 *
 *  Chỉ service này được phép write vào hai bảng trên.
 *  Mọi UseCase cần thao tác tài chính BẮT BUỘC inject và gọi service này.
 *  Không service nào khác được tự UPDATE wallets hay INSERT transactions.
 */
@Injectable()
export class WalletService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  // ─── READ ───────────────────────────────────────────────────────────────────

  async getWalletByUserId(userId: string) {
    const wallet = await this.db
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!wallet)
      throw new NotFoundException(`Wallet not found for user ${userId}`);
    return wallet;
  }

  /**
   * Lấy hoặc tạo wallet nếu chưa tồn tại (dùng cho flow đầu tiên của user mới).
   */
  async getOrCreateWallet(userId: string) {
    const existing = await this.db
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (existing) return existing;

    return this.db
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

  async getTransactions(userId: string) {
    return this.db
      .selectFrom("transactions")
      .selectAll()
      .where("userId", "=", userId)
      .orderBy("date", "desc")
      .execute();
  }

  // ─── WRITE — CHỈ ĐƯỢC GỌI BỞI USE CASES (với trx) ─────────────────────────

  /**
   * Nạp tiền vào ví (topup / deposit).
   * Cần được bọc trong trx từ UseCase gọi vào.
   */
  async deposit(
    userId: string,
    amount: number,
    desc: string,
    source: string,
    trx: Transaction<DB>,
  ): Promise<void> {
    const wallet = await trx
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!wallet)
      throw new NotFoundException(`Wallet not found for user ${userId}`);

    const newBalance = Number(wallet.balance) + amount;

    await trx
      .updateTable("wallets")
      .set({ balance: newBalance.toString(), updatedAt: new Date() })
      .where("id", "=", wallet.id)
      .execute();

    await this._logTransaction(trx, {
      userId,
      type: "DEPOSIT",
      amount,
      balanceAfter: newBalance,
      desc,
      source,
      status: "COMPLETED",
    });
  }

  /**
   * Khóa tiền vào Escrow (khi Client accept proposal).
   * Trừ balance, cộng escrowBalance, ghi log HELD.
   */
  async escrowFunds(
    userId: string,
    amount: number,
    desc: string,
    trx: Transaction<DB>,
    projectId?: string,
  ): Promise<void> {
    const wallet = await trx
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();

    if (!wallet)
      throw new NotFoundException(`Wallet not found for user ${userId}`);

    if (Number(wallet.balance) < amount) {
      throw new BadRequestException(
        `Insufficient wallet balance. Required: $${amount}, Available: $${wallet.balance}`,
      );
    }

    const newBalance = Number(wallet.balance) - amount;
    const newEscrow = Number(wallet.escrowBalance) + amount;

    await trx
      .updateTable("wallets")
      .set({
        balance: newBalance.toString(),
        escrowBalance: newEscrow.toString(),
        updatedAt: new Date(),
      })
      .where("id", "=", wallet.id)
      .execute();

    await this._logTransaction(trx, {
      userId,
      type: "ESCROW",
      amount,
      balanceAfter: newBalance,
      desc,
      source: "Wallet",
      status: "HELD",
      projectId,
    });
  }

  /**
   * Giải phóng tiền escrow sang ví của Expert (khi Client release payment).
   * Trừ escrowBalance của Client, cộng balance cho Expert.
   */
  async releaseEscrowToExpert(
    clientId: string,
    expertId: string,
    amount: number,
    contractDesc: string,
    trx: Transaction<DB>,
  ): Promise<void> {
    // Cập nhật escrow của Client
    const clientWallet = await trx
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", clientId)
      .executeTakeFirst();

    if (clientWallet) {
      const currentEscrow = Number(clientWallet.escrowBalance);
      if (currentEscrow < amount) {
        throw new BadRequestException(
          `Cannot release more escrow than available. Available: $${currentEscrow}, Requested: $${amount}`,
        );
      }
      const newClientEscrow = currentEscrow - amount;
      await trx
        .updateTable("wallets")
        .set({
          escrowBalance: newClientEscrow.toString(),
          updatedAt: new Date(),
        })
        .where("id", "=", clientWallet.id)
        .execute();

      await this._logTransaction(trx, {
        userId: clientId,
        type: "SPENT",
        amount,
        balanceAfter: Number(clientWallet.balance),
        desc: `Released: ${contractDesc}`,
        source: "Escrow",
        status: "COMPLETED",
      });
    }

    // Cộng tiền vào ví của Expert
    let expertWallet = await trx
      .selectFrom("wallets")
      .selectAll()
      .where("userId", "=", expertId)
      .executeTakeFirst();

    if (!expertWallet) {
      expertWallet = await trx
        .insertInto("wallets")
        .values({
          id: crypto.randomUUID(),
          userId: expertId,
          balance: "0",
          escrowBalance: "0",
          currency: "USD",
          status: "ACTIVE",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    }

    const newExpertBalance = Number(expertWallet.balance) + amount;
    await trx
      .updateTable("wallets")
      .set({ balance: newExpertBalance.toString(), updatedAt: new Date() })
      .where("id", "=", expertWallet.id)
      .execute();

    await this._logTransaction(trx, {
      userId: expertId,
      type: "PAYMENT_RECEIVED",
      amount,
      balanceAfter: newExpertBalance,
      desc: `Payment received: ${contractDesc}`,
      source: "Escrow",
      status: "COMPLETED",
    });
  }

  /**
   * Nạp tiền mock (dev only). Tự quản lý transaction của mình.
   */
  async mockTopup(userId: string, amount: number) {
    return this.db.transaction().execute(async (trx) => {
      await this.deposit(
        userId,
        amount,
        "Mock Deposit (Momo)",
        "MOCK_MOMO",
        trx,
      );
      const wallet = await trx
        .selectFrom("wallets")
        .select(["balance"])
        .where("userId", "=", userId)
        .executeTakeFirstOrThrow();
      return { success: true, newBalance: Number(wallet.balance) };
    });
  }

  // ─── PRIVATE HELPERS ────────────────────────────────────────────────────────

  private async _logTransaction(
    trx: Transaction<DB>,
    data: {
      userId: string;
      type: string;
      amount: number;
      balanceAfter: number;
      desc: string;
      source: string;
      status: string;
      projectId?: string;
    },
  ): Promise<void> {
    await trx
      .insertInto("transactions")
      .values({
        id: crypto.randomUUID(),
        userId: data.userId,
        type: data.type as any,
        amount: data.amount.toString(),
        balanceAfter: data.balanceAfter.toString(),
        desc: data.desc,
        source: data.source,
        status: data.status,
        date: new Date(),
        createdAt: new Date(),
        ...(data.projectId ? { projectId: data.projectId } : {}),
      })
      .execute();
  }
}

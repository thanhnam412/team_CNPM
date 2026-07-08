import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../../../database/database.module';
import { DB } from '../../../database/types';
import { WalletService } from '../../wallet/wallet.service';
import { MilestonesService } from '../../milestones/milestones.service';

/**
 * ReleasePaymentUseCase — Orchestrator cho luồng Release Funds (Client trả tiền cho Expert)
 *
 * Bảng thay đổi trong 1 transaction:
 *   1. contracts    — escrowStatus = RELEASED
 *   2. wallets      — Client: escrowBalance -= price; Expert: balance += price
 *   3. transactions — PAYMENT (client) + EARNED (expert) = 2 rows
 *   4. milestones   — status = PAID (nếu là milestone contract)
 *   5. projects     — escrow -= price, spent += price (nếu là milestone contract)
 *   6. quick_tasks  — status = COMPLETED (nếu là quick task contract)
 */
@Injectable()
export class ReleasePaymentUseCase {
  constructor(
    private readonly walletService: WalletService,
    private readonly milestonesService: MilestonesService,
    @Inject(KYSELY_DB) private db: Kysely<DB>,
  ) {}

  async execute(contractId: string, clientId: string): Promise<{ success: true }> {
    return this.db.transaction().execute(async (trx) => {
      // ── Step 1: Lấy contract, validate ────────────────────────────────────
      const contract = await trx
        .selectFrom('contracts')
        .selectAll()
        .where('id', '=', contractId)
        .where('clientId', '=', clientId)
        .executeTakeFirst();

      if (!contract) {
        throw new NotFoundException('Contract not found or you are not authorized.');
      }

      if (contract.escrowStatus !== 'HELD') {
        throw new BadRequestException(
          `Cannot release funds. Contract escrow status is "${contract.escrowStatus}", expected "HELD".`,
        );
      }

      const amount = Number(contract.agreedPrice);
      const contractDesc = contract.milestoneId
        ? `Milestone contract #${contract.milestoneId.slice(-6)}`
        : `Quick Task contract #${contract.quickTaskId?.slice(-6)}`;

      // ── Step 2: Chuyển tiền từ escrow Client → ví Expert ──────────────────
      await this.walletService.releaseEscrowToExpert(
        clientId,
        contract.expertId,
        amount,
        contractDesc,
        trx,
      );

      // ── Step 3: Cập nhật Milestone hoặc QuickTask ─────────────────────────
      if (contract.milestoneId) {
        await this.milestonesService.markAsPaid(contract.milestoneId, amount, trx);
      }

      if (contract.quickTaskId) {
        await trx
          .updateTable('quick_tasks')
          .set({ status: 'COMPLETED' as any, updatedAt: new Date() })
          .where('id', '=', contract.quickTaskId)
          .execute();
      }

      // ── Step 4: Đổi trạng thái Contract ───────────────────────────────────
      await trx
        .updateTable('contracts')
        .set({ escrowStatus: 'RELEASED' as any, updatedAt: new Date() })
        .where('id', '=', contractId)
        .execute();

      return { success: true };
    });
  }
}

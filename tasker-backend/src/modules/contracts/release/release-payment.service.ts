import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { MilestonesService } from "@/modules/milestones/milestones.service";
import { ReleaseService } from "@/modules/wallet/release/release.service";
import {
  getClientContractQuery,
  markContractReleasedQuery,
  markQuickTaskCompletedQuery,
} from "@/queries/contracts";
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";

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
export class ReleasePaymentService {
  constructor(
    private readonly releaseService: ReleaseService,
    private readonly milestonesService: MilestonesService,
    @Inject(KYSELY_DB) private db: Kysely<DB>,
  ) {}

  async execute(
    contractId: string,
    clientId: string,
  ): Promise<{ success: true }> {
    return this.db.transaction().execute(async (trx) => {
      // ── Step 1: Lấy contract, validate ────────────────────────────────────
      const contract = await getClientContractQuery(trx, contractId, clientId);

      if (!contract) {
        throw new NotFoundException(
          "Contract not found or you are not authorized.",
        );
      }

      if (contract.escrowStatus !== "HELD") {
        throw new BadRequestException(
          `Cannot release funds. Contract escrow status is "${contract.escrowStatus}", expected "HELD".`,
        );
      }

      const amount = Number(contract.agreedPrice);
      const contractDesc = contract.milestoneId
        ? `Milestone contract #${contract.milestoneId.slice(-6)}`
        : `Quick Task contract #${contract.quickTaskId?.slice(-6)}`;

      // ── Step 2: Chuyển tiền từ escrow Client → ví Expert ──────────────────
      await this.releaseService.processRelease(
        trx,
        clientId,
        contract.expertId,
        amount,
        contractDesc,
      );

      // ── Step 3: Cập nhật Milestone hoặc QuickTask ─────────────────────────
      if (contract.milestoneId) {
        await this.milestonesService.markAsPaid(
          contract.milestoneId,
          amount,
          trx,
        );
      }

      if (contract.quickTaskId) {
        await markQuickTaskCompletedQuery(trx, contract.quickTaskId);
      }

      // ── Step 4: Đổi trạng thái Contract ───────────────────────────────────
      await markContractReleasedQuery(trx, contractId);

      return { success: true };
    });
  }
}

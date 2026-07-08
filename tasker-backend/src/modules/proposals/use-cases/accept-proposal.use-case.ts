import { Injectable, Inject, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Kysely } from 'kysely';
import { KYSELY_DB } from '../../../database/database.module';
import { DB } from '../../../database/types';
import { ProposalsService } from '../proposals.service';
import { WalletService } from '../../wallet/wallet.service';
import { MilestonesService } from '../../milestones/milestones.service';
import { QuickTasksService } from '../../quick-tasks/quick-tasks.service';
import { ContractsService } from '../../contracts/contracts.service';

/**
 * AcceptProposalUseCase — Orchestrator cho luồng Accept Proposal
 *
 * Đây là "bản đồ nghiệp vụ" chính xác. Đọc file này là biết Accept ảnh hưởng gì.
 *
 * Bảng thay đổi trong 1 transaction:
 *   1. proposals    — ACCEPTED (1 row) + REJECTED (n rows)
 *   2. wallets      — Client: balance-=price, escrowBalance+=price
 *   3. transactions — ESCROW HELD (1 row)
 *   4. milestones   — status=ACTIVE, assigneeId (nếu là milestone)
 *   5. projects     — escrow+=price (nếu là milestone)
 *   6. project_members — INSERT Expert nếu chưa có (nếu là milestone)
 *   7. quick_tasks  — status=IN_PROGRESS, expertId (nếu là quick task)
 *   8. contracts    — INSERT 1 row
 */
@Injectable()
export class AcceptProposalUseCase {
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly walletService: WalletService,
    private readonly milestonesService: MilestonesService,
    private readonly quickTasksService: QuickTasksService,
    private readonly contractsService: ContractsService,
    @Inject(KYSELY_DB) private db: Kysely<DB>,
  ) {}

  async execute(proposalId: string, _actorId: string): Promise<{ success: true }> {
    return this.db.transaction().execute(async (trx) => {
      // ── Step 1: Tìm proposal, validate trạng thái ──────────────────────────
      const proposal = await this.proposalsService.findByIdOrThrow(proposalId, trx);

      if (proposal.status !== 'PENDING') {
        throw new BadRequestException(
          `Proposal is already ${proposal.status}. Only PENDING proposals can be accepted.`,
        );
      }

      // ── Step 2: Xác định clientId và giá chốt ─────────────────────────────
      const { clientId, price } = await this.proposalsService.resolveClientAndPrice(
        proposal,
        trx,
      );

      if (price <= 0) {
        throw new BadRequestException('Proposal price must be greater than 0.');
      }

      if (clientId !== _actorId) {
        throw new ForbiddenException('You are not authorized to accept proposals for this task/project.');
      }

      // ── Step 3: Escrow tiền từ ví Client ──────────────────────────────────
      const escrowDesc = proposal.milestoneId
        ? `Escrow for Milestone`
        : `Escrow for Quick Task`;

      await this.walletService.escrowFunds(
        clientId,
        price,
        escrowDesc,
        trx,
        proposal.milestoneId
          ? await this._getProjectIdFromMilestone(proposal.milestoneId, trx)
          : undefined,
      );

      // ── Step 4: Activate Milestone hoặc assign QuickTask ──────────────────
      if (proposal.milestoneId) {
        await this.milestonesService.activate(proposal.milestoneId, proposal.expertId, price, trx);
      } else if (proposal.quickTaskId) {
        await this.quickTasksService.assignExpert(proposal.quickTaskId, proposal.expertId, trx);
      }

      // ── Step 5: Accept proposal + reject các proposal còn lại ─────────────
      await this.proposalsService.accept(proposalId, trx);

      // ── Step 6: Tạo Contract ───────────────────────────────────────────────
      await this.contractsService.create(
        {
          milestoneId: proposal.milestoneId ?? undefined,
          quickTaskId: proposal.quickTaskId ?? undefined,
          expertId: proposal.expertId,
          clientId,
          agreedPrice: price,
        },
        trx,
      );

      return { success: true };
    });
  }

  private async _getProjectIdFromMilestone(milestoneId: string, trx: any): Promise<string | undefined> {
    const ms = await trx
      .selectFrom('milestones')
      .select(['projectId'])
      .where('id', '=', milestoneId)
      .executeTakeFirst();
    return ms?.projectId;
  }
}

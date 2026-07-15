import {
  Injectable,
  Inject,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { ProposalsService } from "@/modules/proposals/proposals.service";
import { EscrowService } from "@/modules/wallet/escrow/escrow.service";
import { RefundService } from "@/modules/wallet/refund/refund.service";
import { MilestonesService } from "@/modules/milestones/milestones.service";
import { QuickTasksService } from "@/modules/quick-tasks/quick-tasks.service";
import { ContractsService } from "@/modules/contracts/contracts.service";
import { getProjectIdFromMilestoneQuery } from "@/queries/proposals";
import { validateLogic } from "../core/utils/proposal";
import { ProposalSnapshot } from "../core/domain";

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
export class AcceptProposalService {
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly escrowService: EscrowService,
    private readonly refundService: RefundService,
    private readonly milestonesService: MilestonesService,
    private readonly quickTasksService: QuickTasksService,
    private readonly contractsService: ContractsService,
    @Inject(KYSELY_DB) private db: Kysely<DB>,
  ) {}

  async execute(
    proposalId: string,
    _actorId: string,
  ): Promise<{ success: true }> {
    return this.db.transaction().execute(async (trx) => {
      // ── Step 1: Tìm proposal, validate trạng thái ──────────────────────────
      const proposal = await this.proposalsService.findByIdOrThrow(
        proposalId,
        trx,
      );

      // ── Step 2: Xác định clientId và giá chốt ─────────────────────────────
      const { clientId, price } =
        await this.proposalsService.resolveClientAndPrice(proposal, trx);

      if (price <= 0) {
        throw new BadRequestException("Proposal price must be greater than 0.");
      }

      const snapshot: ProposalSnapshot = {
        id: proposal.id,
        status: proposal.status,
        clientId: clientId,
        expertId: proposal.expertId,
      };

      validateLogic("ACCEPT", snapshot, _actorId);

      // ── Step 3: Escrow tiền (Tùy loại) ──────────────────────────────────
      if (proposal.milestoneId) {
        // Milestone chưa thu tiền trước, nên giờ mới thu
        const projectId = await getProjectIdFromMilestoneQuery(
          trx,
          proposal.milestoneId,
        ).then((res) => res?.projectId);
        
        await this.escrowService.processEscrow(
          trx,
          clientId,
          price,
          "Escrow for Milestone",
          projectId,
        );
      } else if (proposal.quickTaskId) {
        // Quick Task ĐÃ thu tiền (Full Budget) lúc tạo task.
        // Giờ chốt giá (price). Nếu price < budget ban đầu, hoàn lại phần thừa.
        const qt = await trx.selectFrom("quick_tasks").select("budget").where("id", "=", proposal.quickTaskId).executeTakeFirst();
        const initialBudget = Number(qt?.budget || 0);
        
        if (price < initialBudget) {
          const refundAmount = initialBudget - price;
          await this.refundService.processRefund(
            trx,
            clientId,
            refundAmount,
            "Refund excess escrow from accepted deal",
          );
        } else if (price > initialBudget) {
          // Trường hợp hiếm: Nếu Expert deal giá cao hơn budget ban đầu và Client đồng ý
          // -> Phải thu thêm phần chênh lệch
          const additionalAmount = price - initialBudget;
          await this.escrowService.processEscrow(
            trx,
            clientId,
            additionalAmount,
            "Additional escrow for negotiated deal",
          );
        }
      }

      // ── Step 4: Activate Milestone hoặc assign QuickTask ──────────────────
      if (proposal.milestoneId) {
        await this.milestonesService.activate(
          proposal.milestoneId,
          proposal.expertId,
          price,
          trx,
        );
      } else if (proposal.quickTaskId) {
        await this.quickTasksService.assignExpert(
          proposal.quickTaskId,
          proposal.expertId,
          trx,
        );
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
}

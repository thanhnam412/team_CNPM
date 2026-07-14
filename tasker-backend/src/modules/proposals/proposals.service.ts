import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  findProposalByIdQuery,
  findProposalsForTaskQuery,
  findProposalsForMilestoneQuery,
  findProposalsForExpertQuery,
  getQuickTaskStatusAndClientQuery,
  getMilestoneStatusAndProjectQuery,
  getProjectClientAdminQuery,
  createProposalQuery,
  acceptProposalQuery,
  updateProposalStatusQuery,
} from "@/queries/proposals";

@Injectable()
export class ProposalsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByIdOrThrow(proposalId: string, trx?: Transaction<DB>) {
    const db = trx ?? this.db;
    const proposal = await findProposalByIdQuery(db, proposalId);

    if (!proposal)
      throw new NotFoundException(`Proposal ${proposalId} not found`);
    return proposal;
  }

  async getProposalsForTask(quickTaskId: string) {
    return findProposalsForTaskQuery(this.db, quickTaskId);
  }

  async getProposalsForMilestone(milestoneId: string) {
    return findProposalsForMilestoneQuery(this.db, milestoneId);
  }

  async getProposalsForExpert(expertId: string) {
    return findProposalsForExpertQuery(this.db, expertId);
  }

  // ─── WRITE (CRUD) ────────────────────────────────────────────────────────────

  async createProposal(
    params: { quickTaskId?: string; milestoneId?: string },
    expertId: string,
    data: any,
  ) {
    const { quickTaskId, milestoneId } = params;

    if (!quickTaskId && !milestoneId) {
      throw new BadRequestException(
        "Proposal must target a QuickTask or a Milestone.",
      );
    }

    if (quickTaskId) {
      const quickTask = await getQuickTaskStatusAndClientQuery(
        this.db,
        quickTaskId,
      );
      if (!quickTask) throw new NotFoundException("QuickTask not found");
      if (quickTask.status !== "OPEN") {
        throw new BadRequestException(
          "This QuickTask is no longer open for proposals.",
        );
      }
      if (quickTask.clientId === expertId) {
        throw new BadRequestException("You cannot propose to your own task.");
      }
    }

    if (milestoneId) {
      const milestone = await getMilestoneStatusAndProjectQuery(
        this.db,
        milestoneId,
      );
      if (!milestone) throw new NotFoundException("Milestone not found");
      if (milestone.status !== "PENDING") {
        throw new BadRequestException(
          "This Milestone is no longer accepting proposals.",
        );
      }

      const adminMember = await getProjectClientAdminQuery(
        this.db,
        milestone.projectId,
      );
      if (adminMember?.userId === expertId) {
        throw new BadRequestException(
          "You cannot propose to your own project milestone.",
        );
      }
    }

    return this.db.transaction().execute(async (trx) => {
      return createProposalQuery(
        trx,
        quickTaskId ?? null,
        milestoneId ?? null,
        expertId,
        data,
      );
    });
  }

  // ─── DOMAIN ACTIONS (gọi từ UseCase, nhận trx) ──────────────────────────────

  async accept(proposalId: string, trx: Transaction<DB>): Promise<void> {
    await acceptProposalQuery(trx, proposalId);
  }

  async resolveClientAndPrice(
    proposal: any,
    trx: Transaction<DB> | Kysely<DB>,
  ): Promise<{ clientId: string; price: number }> {
    let clientId: string;
    let price = Number(proposal.proposedPrice);

    if (proposal.quickTaskId) {
      const qt = await getQuickTaskStatusAndClientQuery(
        trx,
        proposal.quickTaskId,
      );
      if (!qt) throw new NotFoundException("QuickTask not found");
      clientId = qt.clientId;
      if (price === 0) price = Number(qt.budget);
    } else if (proposal.milestoneId) {
      const ms = await getMilestoneStatusAndProjectQuery(
        trx,
        proposal.milestoneId,
      );
      if (!ms) throw new NotFoundException("Milestone not found");
      if (price === 0) price = Number(ms.budget);

      const member = await getProjectClientAdminQuery(trx, ms.projectId);

      if (!member)
        throw new BadRequestException(
          "No CLIENT_ADMIN found for this project.",
        );
      clientId = member.userId;
    } else {
      throw new BadRequestException(
        "Proposal has no target (quickTaskId or milestoneId).",
      );
    }

    return { clientId, price };
  }

  async updateStatus(
    actorId: string,
    proposalId: string,
    status: "REJECTED" | "WITHDRAWN",
  ) {
    if (status !== "REJECTED" && status !== "WITHDRAWN") {
      throw new BadRequestException(
        "Status can only be updated to REJECTED or WITHDRAWN via this endpoint.",
      );
    }

    const proposal = await this.findByIdOrThrow(proposalId);

    if (status === "WITHDRAWN") {
      if (proposal.expertId !== actorId) {
        throw new ForbiddenException(
          "Only the expert can withdraw their proposal.",
        );
      }
    } else if (status === "REJECTED") {
      const { clientId } = await this.resolveClientAndPrice(proposal, this.db);
      if (clientId !== actorId) {
        throw new ForbiddenException(
          "Only the client can reject this proposal.",
        );
      }
    }

    return updateProposalStatusQuery(this.db, proposalId, status);
  }
}

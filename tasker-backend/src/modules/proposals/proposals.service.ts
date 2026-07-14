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
  insertProposalNegotiationQuery,
  findNegotiationsForProposalQuery,
} from "@/queries/proposals";
import { CreateProposalDto } from "./core/dto/proposals.dto";

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


}

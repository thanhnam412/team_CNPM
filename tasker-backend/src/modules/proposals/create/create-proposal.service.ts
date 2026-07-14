import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { CreateProposalDto } from "../core/dto/proposals.dto";
import {
  getQuickTaskStatusAndClientQuery,
  getMilestoneStatusAndProjectQuery,
  getProjectClientAdminQuery,
  createProposalQuery,
} from "@/queries/proposals";

@Injectable()
export class CreateProposalService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(
    params: { quickTaskId?: string; milestoneId?: string },
    expertId: string,
    data: CreateProposalDto,
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
}

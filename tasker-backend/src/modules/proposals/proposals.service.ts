/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

/**
 * ProposalsService — DOMAIN OWNER của: proposals
 *
 * Chỉ thực hiện CRUD trên bảng proposals.
 * Logic Accept phức tạp (cross-domain) được tách ra AcceptProposalUseCase.
 */
@Injectable()
export class ProposalsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByIdOrThrow(proposalId: string, trx?: Transaction<DB>) {
    const db = trx ?? this.db;
    const proposal = await db
      .selectFrom("proposals")
      .selectAll()
      .where("id", "=", proposalId)
      .executeTakeFirst();

    if (!proposal)
      throw new NotFoundException(`Proposal ${proposalId} not found`);
    return proposal;
  }

  async getProposalsForTask(quickTaskId: string) {
    return this.db
      .selectFrom("proposals")
      .selectAll()
      .where("quickTaskId", "=", quickTaskId)
      .execute();
  }

  async getProposalsForMilestone(milestoneId: string) {
    return this.db
      .selectFrom("proposals")
      .selectAll()
      .where("milestoneId", "=", milestoneId)
      .execute();
  }

  async getProposalsForExpert(expertId: string) {
    return this.db
      .selectFrom("proposals")
      .leftJoin("quick_tasks", "proposals.quickTaskId", "quick_tasks.id")
      .leftJoin("milestones", "proposals.milestoneId", "milestones.id")
      .leftJoin("projects", "milestones.projectId", "projects.id")
      .select([
        "proposals.id",
        "proposals.quickTaskId",
        "proposals.milestoneId",
        "proposals.coverLetter",
        "proposals.proposedPrice",
        "proposals.estimatedDays",
        "proposals.status",
        "proposals.createdAt",
        "quick_tasks.title as quickTaskTitle",
        "milestones.title as milestoneTitle",
        "projects.title as projectTitle",
        "projects.id as projectId",
      ])
      .where("proposals.expertId", "=", expertId)
      .orderBy("proposals.createdAt", "desc")
      .execute();
  }

  // ─── WRITE (CRUD) ────────────────────────────────────────────────────────────

  async createProposal(
    params: { quickTaskId?: string; milestoneId?: string },
    expertId: string,
    data: CreateProposalData,
  ) {
    const { quickTaskId, milestoneId } = params;

    if (!quickTaskId && !milestoneId) {
      throw new BadRequestException(
        "Proposal must target a QuickTask or a Milestone.",
      );
    }

    if (quickTaskId) {
      const quickTask = await this.db
        .selectFrom("quick_tasks")
        .select(["clientId", "status"])
        .where("id", "=", quickTaskId)
        .executeTakeFirst();
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
      const milestone = await this.db
        .selectFrom("milestones")
        .select(["projectId", "status"])
        .where("id", "=", milestoneId)
        .executeTakeFirst();
      if (!milestone) throw new NotFoundException("Milestone not found");
      if (milestone.status !== "PENDING") {
        throw new BadRequestException(
          "This Milestone is no longer accepting proposals.",
        );
      }

      const adminMember = await this.db
        .selectFrom("project_members")
        .select(["userId"])
        .where("projectId", "=", milestone.projectId)
        .where("role", "=", "CLIENT_ADMIN")
        .executeTakeFirst();
      if (adminMember?.userId === expertId) {
        throw new BadRequestException(
          "You cannot propose to your own project milestone.",
        );
      }
    }

    return this.db.transaction().execute(async (trx) => {
      const proposal = await trx
        .insertInto("proposals")
        .values({
          id: crypto.randomUUID(),
          quickTaskId: quickTaskId ?? null,
          milestoneId: milestoneId ?? null,
          expertId,
          coverLetter: data.coverLetter,
          proposedPrice: (data.proposedPrice ?? 0).toString(),
          estimatedDays: data.estimatedDays ?? 0,
          status: "PENDING",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      if (quickTaskId) {
        await trx
          .updateTable("quick_tasks")
          .set((eb) => ({ proposalsCount: eb("proposalsCount", "+", 1) }))
          .where("id", "=", quickTaskId)
          .execute();
      }

      return proposal;
    });
  }

  // ─── DOMAIN ACTIONS (gọi từ UseCase, nhận trx) ──────────────────────────────

  /**
   * Accept 1 proposal, reject tất cả các proposal còn lại của cùng task/milestone.
   */
  async accept(proposalId: string, trx: Transaction<DB>): Promise<void> {
    const proposal = await trx
      .selectFrom("proposals")
      .selectAll()
      .where("id", "=", proposalId)
      .executeTakeFirstOrThrow();

    await trx
      .updateTable("proposals")
      .set({ status: "ACCEPTED" as any, updatedAt: new Date() })
      .where("id", "=", proposalId)
      .execute();

    // Reject tất cả proposal PENDING khác cùng target
    if (proposal.quickTaskId) {
      await trx
        .updateTable("proposals")
        .set({ status: "REJECTED" as any, updatedAt: new Date() })
        .where("quickTaskId", "=", proposal.quickTaskId)
        .where("id", "!=", proposalId)
        .where("status", "=", "PENDING")
        .execute();
    }

    if (proposal.milestoneId) {
      await trx
        .updateTable("proposals")
        .set({ status: "REJECTED" as any, updatedAt: new Date() })
        .where("milestoneId", "=", proposal.milestoneId)
        .where("id", "!=", proposalId)
        .where("status", "=", "PENDING")
        .execute();
    }
  }

  /**
   * Resolve clientId và price từ proposal.
   * Dùng trong UseCase để biết ai là client và giá là bao nhiêu trước khi escrow.
   */
  async resolveClientAndPrice(
    proposal: Awaited<ReturnType<typeof this.findByIdOrThrow>>,
    trx: Transaction<DB> | Kysely<DB>,
  ): Promise<{ clientId: string; price: number }> {
    let clientId: string;
    let price = Number(proposal.proposedPrice);

    if (proposal.quickTaskId) {
      const qt = await trx
        .selectFrom("quick_tasks")
        .select(["clientId", "budget"])
        .where("id", "=", proposal.quickTaskId)
        .executeTakeFirstOrThrow();
      clientId = qt.clientId;
      if (price === 0) price = Number(qt.budget);
    } else if (proposal.milestoneId) {
      const ms = await trx
        .selectFrom("milestones")
        .select(["budget", "projectId"])
        .where("id", "=", proposal.milestoneId)
        .executeTakeFirstOrThrow();
      if (price === 0) price = Number(ms.budget);

      const member = await trx
        .selectFrom("project_members")
        .select("userId")
        .where("projectId", "=", ms.projectId)
        .where("role", "=", "CLIENT_ADMIN")
        .executeTakeFirst();

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

  /**
   * Simple status update (REJECTED / WITHDRAWN) — không cần UseCase.
   */
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

    return this.db
      .updateTable("proposals")
      .set({ status: status as any, updatedAt: new Date() })
      .where("id", "=", proposalId)
      .returningAll()
      .executeTakeFirst();
  }
}

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────

export interface CreateProposalData {
  coverLetter: string;
  proposedPrice?: number;
  estimatedDays?: number;
}

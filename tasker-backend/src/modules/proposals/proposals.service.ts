/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class ProposalsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

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
      const quickTask = await this.db
        .selectFrom("quick_tasks")
        .select(["clientId"])
        .where("id", "=", quickTaskId)
        .executeTakeFirst();
      if (!quickTask) throw new NotFoundException("QuickTask not found");
      if (quickTask.clientId === expertId)
        throw new BadRequestException("You cannot propose to your own task.");
    } else if (milestoneId) {
      const milestone = await this.db
        .selectFrom("milestones")
        .selectAll()
        .where("id", "=", milestoneId)
        .executeTakeFirst();
      if (!milestone) throw new NotFoundException("Milestone not found");
      const project = await this.db
        .selectFrom("projects")
        .select(["id"])
        .where("id", "=", milestone.projectId)
        .executeTakeFirst();
      if (project) {
        const member = await this.db
          .selectFrom("project_members")
          .select(["userId"])
          .where("projectId", "=", project.id)
          .where("role", "=", "CLIENT_ADMIN")
          .executeTakeFirst();
        if (member && member.userId === expertId) {
          throw new BadRequestException(
            "You cannot propose to your own project milestone.",
          );
        }
      }
    }

    return this.db.transaction().execute(async (trx) => {
      const proposal = await trx
        .insertInto("proposals")
        .values({
          id: crypto.randomUUID(),
          quickTaskId: quickTaskId || null,
          milestoneId: milestoneId || null,
          expertId,
          coverLetter: data.coverLetter,
          proposedPrice: data.proposedPrice?.toString() || "0",
          estimatedDays: data.estimatedDays || 0,
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
      .selectAll()
      .where("expertId", "=", expertId)
      .execute();
  }

  async updateProposalStatus(
    proposalId: string,
    status: "ACCEPTED" | "REJECTED" | "WITHDRAWN",
    actingUserId?: string
  ) {
    if (status !== "ACCEPTED") {
      return this.db
        .updateTable("proposals")
        .set({ status, updatedAt: new Date() })
        .where("id", "=", proposalId)
        .returningAll()
        .executeTakeFirst();
    }

    // Logic for ACCEPTED
    return this.db.transaction().execute(async (trx) => {
      const proposal = await trx
        .updateTable("proposals")
        .set({ status: "ACCEPTED", updatedAt: new Date() })
        .where("id", "=", proposalId)
        .returningAll()
        .executeTakeFirstOrThrow();

      let clientId = "";
      const price = Number(proposal.proposedPrice);

      if (proposal.quickTaskId) {
        const qt = await trx
          .selectFrom("quick_tasks")
          .select("clientId")
          .where("id", "=", proposal.quickTaskId)
          .executeTakeFirstOrThrow();
        clientId = qt.clientId;

        // 1. Fetch wallet
        const wallet = await trx
          .selectFrom("wallets")
          .selectAll()
          .where("userId", "=", clientId)
          .executeTakeFirst();
        if (!wallet || Number(wallet.balance) < price) {
          throw new BadRequestException(
            "Insufficient wallet balance for this Quick Task.",
          );
        }

        // 2. Deduct balance, add to escrow
        const newBalance = Number(wallet.balance) - price;
        const newEscrow = Number(wallet.escrowBalance) + price;
        await trx
          .updateTable("wallets")
          .set({
            balance: newBalance.toString(),
            escrowBalance: newEscrow.toString(),
            updatedAt: new Date(),
          })
          .where("id", "=", wallet.id)
          .execute();

        // 3. Insert transaction
        await trx
          .insertInto("transactions")
          .values({
            id: crypto.randomUUID(),
            userId: clientId,
            type: "ESCROW",
            amount: price.toString(),
            balanceAfter: newBalance.toString(),
            desc: "Escrow for Quick Task",
            source: "Wallet",
            status: "HELD",
            date: new Date(),
            createdAt: new Date(),
          } as any)
          .execute();

        // 4. Update Quick Task
        await trx
          .updateTable("quick_tasks")
          .set({
            expertId: proposal.expertId,
            status: "IN_PROGRESS",
            updatedAt: new Date(),
          })
          .where("id", "=", proposal.quickTaskId)
          .execute();

        // 5. Reject others
        await trx
          .updateTable("proposals")
          .set({ status: "REJECTED", updatedAt: new Date() })
          .where("quickTaskId", "=", proposal.quickTaskId)
          .where("id", "!=", proposalId)
          .where("status", "=", "PENDING")
          .execute();

        // 6. Create Contract
        await trx
          .insertInto("contracts")
          .values({
            id: crypto.randomUUID(),
            quickTaskId: proposal.quickTaskId,
            expertId: proposal.expertId,
            clientId,
            agreedPrice: proposal.proposedPrice,
            escrowStatus: "HELD",
            updatedAt: new Date(),
          })
          .execute();
      } else if (proposal.milestoneId) {
        const ms = await trx
          .selectFrom("milestones")
          .selectAll()
          .where("id", "=", proposal.milestoneId)
          .executeTakeFirstOrThrow();
        const prj = await trx
          .selectFrom("projects")
          .selectAll()
          .where("id", "=", ms.projectId)
          .executeTakeFirstOrThrow();

        // Find client admin
        let clientId = actingUserId; // Fallback to acting user
        try {
          const member = await trx.selectFrom("project_members").select("userId").where("projectId", "=", prj.id).where("role", "=", "CLIENT_ADMIN").executeTakeFirstOrThrow();
          clientId = member.userId;
        } catch (e) {
          if (!clientId) throw new BadRequestException("No client found for this project.");
        }

        const availableBudget =
          Number(prj.budget) - Number(prj.spent) - Number(prj.escrow);
        if (availableBudget < price) {
          throw new BadRequestException(
            "Insufficient project budget for this Milestone.",
          );
        }

        const newEscrow = Number(prj.escrow) + price;
        await trx
          .updateTable("projects")
          .set({ escrow: newEscrow.toString(), updatedAt: new Date() })
          .where("id", "=", prj.id)
          .execute();

        await trx
          .insertInto("transactions")
          .values({
            id: crypto.randomUUID(),
            userId: clientId,
            projectId: prj.id,
            type: "ESCROW",
            amount: price.toString(),
            balanceAfter: newEscrow.toString(),
            desc: "Escrow for Milestone",
            source: "Project Budget",
            status: "HELD",
            date: new Date(),
            createdAt: new Date(),
          } as any)
          .execute();

        await trx
          .updateTable("milestones")
          .set({
            assigneeId: proposal.expertId,
            status: "ACTIVE",
            updatedAt: new Date(),
          })
          .where("id", "=", proposal.milestoneId)
          .execute();

        await trx
          .updateTable("proposals")
          .set({ status: "REJECTED", updatedAt: new Date() })
          .where("milestoneId", "=", proposal.milestoneId)
          .where("id", "!=", proposalId)
          .where("status", "=", "PENDING")
          .execute();

        await trx
          .insertInto("contracts")
          .values({
            id: crypto.randomUUID(),
            milestoneId: proposal.milestoneId,
            expertId: proposal.expertId,
            clientId,
            agreedPrice: proposal.proposedPrice,
            escrowStatus: "HELD",
            updatedAt: new Date(),
          })
          .execute();
      }

      return proposal;
    });
  }
}

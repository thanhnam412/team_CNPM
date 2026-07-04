/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class ProposalsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async createProposal(quickTaskId: string, expertId: string, data: any) {
    // Prevent self-proposals
    const quickTask = await this.db
      .selectFrom("quick_tasks")
      .select(["clientId"])
      .where("id", "=", quickTaskId)
      .executeTakeFirst();

    if (!quickTask) {
      throw new Error("QuickTask not found");
    }

    if (quickTask.clientId === expertId) {
      throw new Error("You cannot propose to your own task.");
    }

    return this.db.transaction().execute(async (trx) => {
      const proposal = await trx
        .insertInto("proposals")
        .values({
          id: crypto.randomUUID(),
          quickTaskId,
          expertId,
          coverLetter: data.coverLetter,
          proposedPrice: data.proposedPrice?.toString() || "0",
          estimatedDays: data.estimatedDays || 0,
          status: "PENDING",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      // Increment proposalsCount in quick_tasks
      await trx
        .updateTable("quick_tasks")
        .set((eb) => ({
          proposalsCount: eb("proposalsCount", "+", 1),
        }))
        .where("id", "=", quickTaskId)
        .execute();

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

      // Reject other pending proposals for this task
      await trx
        .updateTable("proposals")
        .set({ status: "REJECTED", updatedAt: new Date() })
        .where("quickTaskId", "=", proposal.quickTaskId)
        .where("id", "!=", proposalId)
        .where("status", "=", "PENDING")
        .execute();

      // Assign expert to QuickTask and set IN_PROGRESS
      const quickTask = await trx
        .updateTable("quick_tasks")
        .set({
          expertId: proposal.expertId,
          status: "IN_PROGRESS",
          updatedAt: new Date(),
        })
        .where("id", "=", proposal.quickTaskId)
        .returningAll()
        .executeTakeFirstOrThrow();

      // Update internal Task assignment
      await trx
        .updateTable("tasks")
        .set({
          assigneeId: proposal.expertId,
          status: "IN_PROGRESS",
          updatedAt: new Date(),
        })
        .where("quickTaskId", "=", proposal.quickTaskId)
        .execute();

      // Lock funds in Escrow
      await trx
        .insertInto("transactions")
        .values({
          id: crypto.randomUUID(),
          userId: quickTask.clientId,
          date: new Date(),
          desc: `Escrow for task: ${quickTask.title}`,
          type: "ESCROW",
          amount: proposal.proposedPrice,
          balanceAfter: "0",
          status: "Success",
          projectId: quickTask.projectId,
          createdAt: new Date(),
        })
        .execute();

      // Auto-add Expert to project team if QuickTask belongs to a project
      if (quickTask.projectId) {
        const existingMember = await trx
          .selectFrom("project_members")
          .select(["id"])
          .where("projectId", "=", quickTask.projectId)
          .where("userId", "=", proposal.expertId)
          .executeTakeFirst();

        if (!existingMember) {
          await trx
            .insertInto("project_members")
            .values({
              id: crypto.randomUUID(),
              projectId: quickTask.projectId,
              userId: proposal.expertId,
              role: "EXPERT",
              status: "ACTIVE",
              updatedAt: new Date(),
            })
            .execute();
        }
      }

      return proposal;
    });
  }
}

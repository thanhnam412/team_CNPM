/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class MilestonesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findByProject(projectId: string) {
    const milestones = await this.db
      .selectFrom("milestones")
      .selectAll()
      .where("projectId", "=", projectId)
      .execute();

    if (milestones.length === 0) return [];

    const proposals = await this.db
      .selectFrom("proposals as p")
      .innerJoin("users as u", "u.id", "p.expertId")
      .select([
        "p.id",
        "p.milestoneId",
        "p.proposedPrice as amount",
        "p.coverLetter",
        "p.status",
        "u.name as expertName",
        "u.avatar",
      ])
      .where(
        "p.milestoneId",
        "in",
        milestones.map((m) => m.id),
      )
      .execute();

    return milestones.map((m) => ({
      ...m,
      proposals: proposals.filter((p) => p.milestoneId === m.id),
    }));
  }

  async findAvailable() {
    return this.db
      .selectFrom("milestones as m")
      .innerJoin("projects as p", "p.id", "m.projectId")
      .select([
        "m.id",
        "m.title",
        "m.budget",
        "m.status",
        "m.projectId",
        "p.title as projectTitle",
      ])
      .where("m.status", "=", "PENDING")
      .execute();
  }

  async create(projectId: string, data: any) {
    return this.db
      .insertInto("milestones")
      .values({
        id: crypto.randomUUID(),
        projectId,
        title: data.title,
        budget: data.amount?.toString() || data.budget?.toString() || "0",
        status: "PENDING",
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.budget = data.amount.toString();
    if (data.budget !== undefined) updateData.budget = data.budget.toString();

    return this.db
      .updateTable("milestones")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async updateStatus(id: string, status: string) {
    return this.db
      .updateTable("milestones")
      .set({ status: status as any, updatedAt: new Date() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async submitDeliverables(id: string, data: any) {
    // Note: The deliverables column was removed from milestones in the V1 schema.
    // Deliverables for milestones should be handled via messages or timeline events.
    // For now, we only update the status.
    return this.db
      .updateTable("milestones")
      .set({
        status: "REVIEW" as any,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(id: string) {
    await this.db.deleteFrom("milestones").where("id", "=", id).execute();

    return { success: true };
  }

  async getProposals(milestoneId: string) {
    return this.db
      .selectFrom("proposals as p")
      .innerJoin("users as u", "u.id", "p.expertId")
      .select([
        "p.id",
        "p.proposedPrice as amount",
        "p.coverLetter as message",
        "p.status",
        "u.name as expertName",
        "u.avatar",
        "p.expertId",
      ])
      .where("p.milestoneId", "=", milestoneId)
      .execute();
  }

  async createProposal(milestoneId: string, data: any) {
    return this.db
      .insertInto("proposals")
      .values({
        id: crypto.randomUUID(),
        milestoneId,
        expertId: data.expertId,
        proposedPrice: data.amount?.toString() || data.proposedPrice?.toString() || "0",
        coverLetter: data.proposalText || data.coverLetter || data.message || "",
        estimatedDays: data.estimatedDays || 0,
        status: "PENDING",
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async acceptProposal(proposalId: string) {
    const proposal = await this.db
      .selectFrom("proposals")
      .selectAll()
      .where("id", "=", proposalId)
      .executeTakeFirst();
    if (!proposal) throw new Error("Proposal not found");

    const milestone = await this.db
      .selectFrom("milestones")
      .selectAll()
      .where("id", "=", proposal.milestoneId)
      .executeTakeFirst();
    if (!milestone) throw new Error("Milestone not found");

    // Accept this proposal
    await this.db
      .updateTable("proposals")
      .set({ status: "ACCEPTED" as any, updatedAt: new Date() })
      .where("id", "=", proposalId)
      .execute();

    // Reject other proposals
    await this.db
      .updateTable("proposals")
      .set({ status: "REJECTED" as any, updatedAt: new Date() })
      .where("milestoneId", "=", proposal.milestoneId)
      .where("id", "!=", proposalId)
      .execute();

    // Update Milestone status
    await this.db
      .updateTable("milestones")
      .set({ status: "ACTIVE" as any, updatedAt: new Date() })
      .where("id", "=", proposal.milestoneId)
      .execute();

    // Add expert to Project members if not exists
    const existingMember = await this.db
      .selectFrom("project_members")
      .selectAll()
      .where("projectId", "=", milestone.projectId)
      .where("userId", "=", proposal.expertId)
      .executeTakeFirst();

    if (!existingMember) {
      await this.db
        .insertInto("project_members")
        .values({
          id: crypto.randomUUID(),
          projectId: milestone.projectId,
          userId: proposal.expertId,
          role: "EXPERT",
          status: "ACTIVE",
          updatedAt: new Date(),
        })
        .execute();
    }

    return { success: true };
  }
}

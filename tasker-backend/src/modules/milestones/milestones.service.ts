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

    const bids = await this.db
      .selectFrom("bids as b")
      .innerJoin("users as u", "u.id", "b.expertId")
      .select([
        "b.id",
        "b.milestoneId",
        "b.amount",
        "b.coverLetter",
        "b.status",
        "u.name as expertName",
        "u.avatar"
      ])
      .where("b.milestoneId", "in", milestones.map(m => m.id))
      .execute();

    return milestones.map(m => ({
      ...m,
      bids: bids.filter(b => b.milestoneId === m.id)
    }));
  }

  async findAvailable() {
    return this.db
      .selectFrom("milestones as m")
      .innerJoin("projects as p", "p.id", "m.projectId")
      .select([
        "m.id",
        "m.title",
        "m.amount",
        "m.status",
        "m.dueDate",
        "m.projectId",
        "p.title as projectTitle"
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
        amount: data.amount?.toString() || '0',
        status: "PENDING",
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.amount !== undefined) updateData.amount = data.amount.toString();
    if (data.dueDate !== undefined) updateData.dueDate = new Date(data.dueDate);

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
    return this.db
      .updateTable("milestones")
      .set({
        deliverables: JSON.stringify(data.deliverables || data),
        status: "REVIEW" as any,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(id: string) {
    await this.db
      .deleteFrom("milestones")
      .where("id", "=", id)
      .execute();

    return { success: true };
  }

  async getBids(milestoneId: string) {
    return this.db
      .selectFrom("bids as b")
      .innerJoin("users as u", "u.id", "b.expertId")
      .select([
        "b.id",
        "b.amount",
        "b.coverLetter",
        "b.status",
        "u.name as expertName",
        "u.avatar",
        "b.expertId"
      ])
      .where("b.milestoneId", "=", milestoneId)
      .execute();
  }

  async createBid(milestoneId: string, data: any) {
    return this.db
      .insertInto("bids")
      .values({
        id: crypto.randomUUID(),
        milestoneId,
        expertId: data.expertId,
        amount: data.amount?.toString() || data.proposedPrice?.toString() || "0",
        coverLetter: data.proposalText || data.coverLetter || "",
        contractType: data.contractType,
        status: "PENDING" as any,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async acceptBid(bidId: string) {
    const bid = await this.db.selectFrom("bids").selectAll().where("id", "=", bidId).executeTakeFirst();
    if (!bid) throw new Error("Bid not found");

    const milestone = await this.db.selectFrom("milestones").selectAll().where("id", "=", bid.milestoneId).executeTakeFirst();
    if (!milestone) throw new Error("Milestone not found");

    // Accept this bid
    await this.db.updateTable("bids").set({ status: "ACCEPTED" as any, updatedAt: new Date() }).where("id", "=", bidId).execute();
    
    // Reject other bids
    await this.db.updateTable("bids").set({ status: "REJECTED" as any, updatedAt: new Date() }).where("milestoneId", "=", bid.milestoneId).where("id", "!=", bidId).execute();
    
    // Update Milestone status
    await this.db.updateTable("milestones").set({ status: "ACTIVE" as any, updatedAt: new Date() }).where("id", "=", bid.milestoneId).execute();

    // Add expert to Project members if not exists
    const existingMember = await this.db.selectFrom("project_members").selectAll()
      .where("projectId", "=", milestone.projectId)
      .where("userId", "=", bid.expertId)
      .executeTakeFirst();

    if (!existingMember) {
      await this.db.insertInto("project_members").values({
        id: crypto.randomUUID(),
        projectId: milestone.projectId,
        userId: bid.expertId,
        role: "EXPERT" as any,
        status: "ACTIVE",
        updatedAt: new Date(),
      }).execute();
    }

    return { success: true };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class ProjectsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll() {
    return this.db.selectFrom("projects").selectAll().execute();
  }

  async findOne(id: string) {
    const project = await this.db
      .selectFrom("projects")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!project) return null;

    const tasks = await this.db
      .selectFrom("tasks")
      .select(["status"])
      .where("projectId", "=", id)
      .execute();

    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((t) => t.status !== "DONE").length;

    const members = await this.db
      .selectFrom("project_members")
      .select(["role"])
      .where("projectId", "=", id)
      .execute();

    const totalMembers = members.length;
    const expertMembers = members.filter((m) => m.role === "EXPERT").length;

    const milestones = await this.db
      .selectFrom("milestones")
      .selectAll()
      .where("projectId", "=", id)
      .orderBy("createdAt", "asc")
      .limit(3)
      .execute();

    return {
      ...project,
      stats: {
        completion:
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100),
        activeTasks,
        totalMembers,
        expertMembers,
      },
      upcomingMilestones: milestones,
    };
  }

  async create(userId: string, data: any) {
    const tags = {
      type: data.type || "fixed",
      duration: data.duration || "medium",
      commitment: data.commitment || "part",
      ...data.tags
    };

    return this.db.transaction().execute(async (trx) => {
      const project = await trx
        .insertInto("projects")
        .values({
          id: crypto.randomUUID(),
          title: data.title,
          description: data.description || null,
          industry: data.category || data.industry || null,
          requirements: data.technicalScope || data.requirements || null,
          tags: JSON.stringify(tags),
          budget: data.budgetMax?.toString() || data.budget?.toString() || "0",
          spent: "0",
          escrow: "0",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      await trx
        .insertInto("project_members")
        .values({
          id: crypto.randomUUID(),
          projectId: project.id,
          userId,
          role: "CLIENT_ADMIN",
          status: "ACTIVE",
          updatedAt: new Date(),
        })
        .execute();

      return project;
    });
  }

  async getFinance(projectId: string) {
    const project = await this.db
      .selectFrom("projects")
      .select(["budget", "spent", "escrow"])
      .where("id", "=", projectId)
      .executeTakeFirst();

    const transactions = await this.db
      .selectFrom("transactions")
      .selectAll()
      .where("projectId", "=", projectId)
      .orderBy("createdAt", "desc")
      .execute();

    return {
      budget: project?.budget || "0",
      spent: project?.spent || "0",
      escrow: project?.escrow || "0",
      transactions,
    };
  }

  async getMarketplace(projectId: string) {
    const milestones = await this.db
      .selectFrom("milestones")
      .selectAll()
      .where("projectId", "=", projectId)
      .execute();
      
    if (milestones.length === 0) return [];

    const milestoneIds = milestones.map((m) => m.id);
    const proposals = await this.db
      .selectFrom("proposals")
      .selectAll()
      .where("milestoneId", "in", milestoneIds)
      .execute();

    return milestones.map((m) => ({
      ...m,
      proposals: proposals.filter((p) => p.milestoneId === m.id),
    }));
  }

  async addFunds(projectId: string, amount: number, userId: string) {
    const project = await this.db
      .selectFrom("projects")
      .select(["budget"])
      .where("id", "=", projectId)
      .executeTakeFirst();

    if (!project) throw new NotFoundException("Project not found");

    const newBudget = (Number(project.budget) + amount).toString();

    await this.db
      .updateTable("projects")
      .set({ budget: newBudget, updatedAt: new Date() })
      .where("id", "=", projectId)
      .execute();

    await this.db
      .insertInto("transactions")
      .values({
        id: crypto.randomUUID(),
        userId,
        date: new Date(),
        desc: "Added funds to project budget",
        type: "DEPOSIT",
        amount: amount.toString(),
        balanceAfter: newBudget,
        status: "Success",
        source: "Credit Card",
        projectId: projectId,
        createdAt: new Date(),
      } as any)
      .execute();

    return { success: true, newBudget };
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.budget !== undefined) updateData.budget = data.budget.toString();

    return this.db
      .updateTable("projects")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(id: string) {
    const project = await this.db
      .selectFrom("projects")
      .select(["escrow", "spent", "status"])
      .where("id", "=", id)
      .executeTakeFirst();

    if (!project) throw new NotFoundException("Project not found");

    if (Number(project.escrow) > 0 || Number(project.spent) > 0) {
      throw new BadRequestException("Cannot delete a project that holds escrow funds or has a financial history.");
    }

    const transactions = await this.db
      .selectFrom("transactions")
      .select(["id"])
      .where("projectId", "=", id)
      .limit(1)
      .execute();

    if (transactions.length > 0) {
      throw new BadRequestException("Cannot delete a project with financial transactions. Please archive it instead.");
    }

    const activeMilestones = await this.db
      .selectFrom("milestones")
      .select(["id"])
      .where("projectId", "=", id)
      .where("status", "in", ["ACTIVE", "REVIEW", "PAID"])
      .limit(1)
      .execute();

    if (activeMilestones.length > 0) {
      throw new BadRequestException("Cannot delete a project that has active, in-review, or paid milestones.");
    }

    await this.db.deleteFrom("projects").where("id", "=", id).execute();

    return { success: true };
  }
}

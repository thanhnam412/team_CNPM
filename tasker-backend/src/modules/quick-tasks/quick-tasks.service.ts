/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class QuickTasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll() {
    return this.db.selectFrom("quick_tasks").selectAll().execute();
  }

  async findOne(id: string) {
    return this.db
      .selectFrom("quick_tasks")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async create(clientId: string, data: any) {
    if (data.expertId && data.expertId === clientId) {
      throw new Error("You cannot assign a task to yourself.");
    }

    return this.db
      .insertInto("quick_tasks")
      .values({
        id: crypto.randomUUID(),
        clientId,
        expertId: data.expertId || null,
        title: data.title,
        description: data.description,
        status: data.status || "OPEN",
        budget: data.budget?.toString() || "0",
        deadline: data.deadline ? new Date(data.deadline) : null,
        proposalsCount: 0,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async findByClient(clientId: string) {
    return this.db
      .selectFrom("quick_tasks")
      .selectAll()
      .where("clientId", "=", clientId)
      .orderBy("createdAt", "desc")
      .execute();
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.budget !== undefined) updateData.budget = data.budget.toString();
    if (data.deadline !== undefined)
      updateData.deadline = new Date(data.deadline);

    return this.db
      .updateTable("quick_tasks")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async updateStatus(id: string, status: string) {
    return this.db
      .updateTable("quick_tasks")
      .set({ status: status as any, updatedAt: new Date() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async submitDeliverable(id: string, data: any) {
    // Expert nộp sản phẩm → chuyển sang REVIEW
    return this.db
      .updateTable("quick_tasks")
      .set({
        status: "REVIEW" as any,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async approveDeliverable(id: string) {
    // Client duyệt deliverable → COMPLETED + giải ngân + cập nhật internal task & milestone
    return this.db.transaction().execute(async (trx) => {
      const quickTask = await trx
        .updateTable("quick_tasks")
        .set({ status: "COMPLETED" as any, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      // Update internal Task to DONE
      const internalTask = await trx
        .updateTable("tasks")
        .set({ status: "DONE" as any, updatedAt: new Date() })
        .where("quickTaskId", "=", id)
        .returningAll()
        .executeTakeFirst();

      // Payout to expert
      if (quickTask.expertId) {
        await trx
          .insertInto("transactions")
          .values({
            id: crypto.randomUUID(),
            userId: quickTask.expertId,
            date: new Date(),
            desc: `Payout for: ${quickTask.title}`,
            type: "PAYMENT_RECEIVED",
            amount: quickTask.budget,
            balanceAfter: "0",
            status: "Success",
            projectId: quickTask.projectId,
            createdAt: new Date(),
          })
          .execute();
      }

      // Recalculate milestone progress if internal task belongs to one
      if (internalTask?.milestoneId) {
        const siblingTasks = await trx
          .selectFrom("tasks")
          .select(["status"])
          .where("milestoneId", "=", internalTask.milestoneId)
          .execute();

        const totalTasks = siblingTasks.length;
        const doneTasks = siblingTasks.filter(
          (t) => t.status === "DONE",
        ).length;
        const progress =
          totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const milestoneStatus: any =
          progress === 100 ? "REVIEW" : "IN_PROGRESS";

        await trx
          .updateTable("milestones")
          .set({ progress, status: milestoneStatus, updatedAt: new Date() })
          .where("id", "=", internalTask.milestoneId)
          .execute();
      }

      return quickTask;
    });
  }

  async remove(id: string) {
    await this.db.deleteFrom("quick_tasks").where("id", "=", id).execute();

    return { success: true };
  }
}

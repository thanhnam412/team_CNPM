/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class TasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findByProject(projectId: string) {
    return this.db
      .selectFrom("tasks")
      .selectAll()
      .where("projectId", "=", projectId)
      .execute();
  }

  async findAllForExpert() {
    return this.db
      .selectFrom("tasks")
      .innerJoin("projects", "tasks.projectId", "projects.id")
      .leftJoin("milestones", "tasks.milestoneId", "milestones.id")
      .selectAll("tasks")
      .select([
        "projects.title as projectName",
        "milestones.title as milestoneName",
      ])
      .execute();
  }

  async create(projectId: string, data: any) {
    return this.db.transaction().execute(async (trx) => {
      const taskId = crypto.randomUUID();
      let quickTaskId: string | null = null;
      const isOutsource = data.isOutsource === true;
      const budget = data.budget?.toString() || "0";

      if (isOutsource) {
        quickTaskId = crypto.randomUUID();
        const clientId = data.clientId || "user-1";

        await trx
          .insertInto("quick_tasks")
          .values({
            id: quickTaskId,
            clientId,
            projectId,
            title: data.title,
            description: data.description || data.title,
            budget,
            status: "OPEN",
            updatedAt: new Date(),
          })
          .execute();
      }

      const task = await trx
        .insertInto("tasks")
        .values({
          id: taskId,
          projectId,
          title: data.title,
          status: data.status || "TODO",
          priority: data.priority || "MEDIUM",
          milestoneId: data.milestoneId || null,
          bucket: data.bucket || null,
          isOutsource,
          budget,
          quickTaskId,
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return task;
    });
  }

  async updateStatus(id: string, status: any) {
    return this.db.transaction().execute(async (trx) => {
      const task = await trx
        .updateTable("tasks")
        .set({ status, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      if (task.milestoneId) {
        const siblingTasks = await trx
          .selectFrom("tasks")
          .select(["status"])
          .where("milestoneId", "=", task.milestoneId)
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
          .where("id", "=", task.milestoneId)
          .execute();
      }

      if (task.isOutsource && status === "DONE" && task.assigneeId) {
        await trx
          .insertInto("transactions")
          .values({
            id: crypto.randomUUID(),
            userId: task.assigneeId,
            date: new Date(),
            desc: `Payout for completed task: ${task.title}`,
            type: "PAYMENT_RECEIVED",
            amount: task.budget,
            balanceAfter: "0",
            status: "Success",
            projectId: task.projectId,
            createdAt: new Date(),
          })
          .execute();

        if (task.quickTaskId) {
          await trx
            .updateTable("quick_tasks")
            .set({ status: "COMPLETED", updatedAt: new Date() })
            .where("id", "=", task.quickTaskId)
            .execute();
        }
      }

      return task;
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.bucket !== undefined) updateData.bucket = data.bucket;
    if (data.milestoneId !== undefined)
      updateData.milestoneId = data.milestoneId;
    if (data.priority !== undefined) updateData.priority = data.priority;

    return this.db
      .updateTable("tasks")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(id: string) {
    return this.db.transaction().execute(async (trx) => {
      const task = await trx
        .selectFrom("tasks")
        .select(["id", "milestoneId"])
        .where("id", "=", id)
        .executeTakeFirst();

      await trx.deleteFrom("tasks").where("id", "=", id).execute();

      // Recalculate milestone progress after deleting a task
      if (task?.milestoneId) {
        const siblingTasks = await trx
          .selectFrom("tasks")
          .select(["status"])
          .where("milestoneId", "=", task.milestoneId)
          .execute();

        const totalTasks = siblingTasks.length;
        const doneTasks = siblingTasks.filter(
          (t) => t.status === "DONE",
        ).length;
        const progress =
          totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
        const milestoneStatus: any =
          totalTasks === 0
            ? "PENDING"
            : progress === 100
              ? "REVIEW"
              : "IN_PROGRESS";

        await trx
          .updateTable("milestones")
          .set({ progress, status: milestoneStatus, updatedAt: new Date() })
          .where("id", "=", task.milestoneId)
          .execute();
      }

      return { success: true };
    });
  }
}

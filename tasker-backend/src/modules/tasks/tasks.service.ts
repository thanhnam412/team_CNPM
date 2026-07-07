/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
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

  async findAllForExpert(expertId: string) {
    return this.db
      .selectFrom("tasks")
      .innerJoin("projects", "tasks.projectId", "projects.id")
      .leftJoin("milestones", "tasks.milestoneId", "milestones.id")
      .selectAll("tasks")
      .select([
        "projects.title as projectName",
        "milestones.title as milestoneName",
      ])
      .where("tasks.assigneeId", "=", expertId)
      .execute();
  }

  async create(projectId: string, data: any) {
    return this.db.transaction().execute(async (trx) => {
      const taskId = crypto.randomUUID();

      const task = await trx
        .insertInto("tasks")
        .values({
          id: taskId,
          projectId,
          title: data.title,
          status: data.status || "TODO",
          priority: data.priority || "MEDIUM",
          milestoneId: data.milestoneId || null,
          assigneeId: data.assigneeId || null,
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();

      return task;
    });
  }

  async updateStatus(id: string, status: any, requestUserId?: string) {
    return this.db.transaction().execute(async (trx) => {
      // Đầu tiên lấy task ra để check quyền
      const existingTask = await trx
        .selectFrom("tasks")
        .select(["assigneeId"])
        .where("id", "=", id)
        .executeTakeFirstOrThrow();

      // Nếu có truyền requestUserId (từ Expert API), bắt buộc phải là người được assign
      if (requestUserId && existingTask.assigneeId !== requestUserId) {
        throw new UnauthorizedException("You are not assigned to this task");
      }

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

        const milestoneStatus: any = progress === 100 ? "REVIEW" : "ACTIVE";

        await trx
          .updateTable("milestones")
          .set({ status: milestoneStatus, updatedAt: new Date() })
          .where("id", "=", task.milestoneId)
          .execute();
      }

      return task;
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
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
          totalTasks === 0 ? "PENDING" : progress === 100 ? "REVIEW" : "ACTIVE";

        await trx
          .updateTable("milestones")
          .set({ status: milestoneStatus, updatedAt: new Date() })
          .where("id", "=", task.milestoneId)
          .execute();
      }

      return { success: true };
    });
  }
}

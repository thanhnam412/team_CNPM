/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

/**
 * TasksService — DOMAIN OWNER của: tasks
 * Ngoài ra có thể UPDATE milestones để tính toán progress (side-effect cần thiết).
 */
@Injectable()
export class TasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await this.db
      .selectFrom("project_members")
      .select("id")
      .where("projectId", "=", projectId)
      .where("userId", "=", userId)
      .where("role", "=", "CLIENT_ADMIN")
      .executeTakeFirst();
    return !!admin;
  }

  private async _checkAssigneeOrAdmin(userId: string, task: any) {
    if (task.assigneeId === userId) return true;
    if (task.projectId) {
      const isAdmin = await this._checkAdmin(userId, task.projectId);
      if (isAdmin) return true;
    }
    throw new ForbiddenException("Not authorized to modify this task");
  }

  // ─── READ ───────────────────────────────────────────────────────────────────

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

  // ─── WRITE ──────────────────────────────────────────────────────────────────

  async create(projectId: string, data: CreateTaskData) {
    return this.db.transaction().execute(async (trx) => {
      // Auto-inherit assigneeId từ milestone nếu không set explicitly
      let assigneeId = data.assigneeId ?? null;
      if (!assigneeId && data.milestoneId) {
        const milestone = await trx
          .selectFrom("milestones")
          .select("assigneeId")
          .where("id", "=", data.milestoneId)
          .executeTakeFirst();
        assigneeId = milestone?.assigneeId ?? null;
      }

      return trx
        .insertInto("tasks")
        .values({
          id: crypto.randomUUID(),
          projectId,
          title: data.title,
          status: (data.status ?? "TODO") as any,
          priority: (data.priority ?? "MEDIUM") as any,
          milestoneId: data.milestoneId ?? null,
          assigneeId,
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirstOrThrow();
    });
  }

  async updateStatus(actorId: string, id: string, status: string) {
    const task = await this.db
      .selectFrom("tasks")
      .select(["projectId", "milestoneId", "assigneeId"])
      .where("id", "=", id)
      .executeTakeFirst();

    if (!task) throw new NotFoundException("Task not found");
    await this._checkAssigneeOrAdmin(actorId, task);

    return this.db.transaction().execute(async (trx) => {
      const updatedTask = await trx
        .updateTable("tasks")
        .set({ status: status as any, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      if (updatedTask.milestoneId) {
        await this._recalculateMilestoneProgress(trx, updatedTask.milestoneId);
      }

      return updatedTask;
    });
  }

  async update(actorId: string, id: string, data: UpdateTaskData) {
    const task = await this.db
      .selectFrom("tasks")
      .select(["projectId", "assigneeId"])
      .where("id", "=", id)
      .executeTakeFirst();
    if (!task) throw new NotFoundException("Task not found");
    await this._checkAssigneeOrAdmin(actorId, task);

    const patch: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) patch.title = data.title;
    if (data.assigneeId !== undefined) patch.assigneeId = data.assigneeId;
    if (data.milestoneId !== undefined) patch.milestoneId = data.milestoneId;
    if (data.priority !== undefined) patch.priority = data.priority;

    return this.db
      .updateTable("tasks")
      .set(patch as any)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async remove(actorId: string, id: string) {
    return this.db.transaction().execute(async (trx) => {
      const task = await trx
        .selectFrom("tasks")
        .select(["id", "milestoneId", "projectId"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!task) throw new NotFoundException(`Task ${id} not found`);

      if (task.projectId) {
        const isAdmin = await this._checkAdmin(actorId, task.projectId);
        if (!isAdmin) throw new ForbiddenException("Must be CLIENT_ADMIN to delete a task");
      }

      await trx.deleteFrom("tasks").where("id", "=", id).execute();

      if (task.milestoneId) {
        await this._recalculateMilestoneProgress(trx, task.milestoneId);
      }

      return { success: true };
    });
  }

  // ─── PRIVATE HELPERS ────────────────────────────────────────────────────────

  /**
   * Tính lại % hoàn thành của Milestone dựa trên các task hiện tại.
   * Tách ra private method để tránh duplicate code giữa updateStatus và remove.
   */
  private async _recalculateMilestoneProgress(
    trx: Transaction<DB>,
    milestoneId: string,
  ): Promise<void> {
    const currentMilestone = await trx
      .selectFrom('milestones')
      .select(['status'])
      .where('id', '=', milestoneId)
      .executeTakeFirst();

    if (!currentMilestone) return;
    if (currentMilestone.status === 'PAID' || currentMilestone.status === 'REVIEW') return; // Không revert trạng thái nếu đã PAID hoặc REVIEW

    const siblingTasks = await trx
      .selectFrom("tasks")
      .select(["status"])
      .where("milestoneId", "=", milestoneId)
      .execute();

    const total = siblingTasks.length;
    const done = siblingTasks.filter((t) => t.status === "DONE").length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    let milestoneStatus: string;
    if (total === 0) milestoneStatus = "PENDING";
    else if (progress === 100) milestoneStatus = "REVIEW";
    else milestoneStatus = "ACTIVE";

    await trx
      .updateTable("milestones")
      .set({ status: milestoneStatus as any, updatedAt: new Date() })
      .where("id", "=", milestoneId)
      .execute();
  }
}

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────

export interface CreateTaskData {
  title: string;
  status?: string;
  priority?: string;
  milestoneId?: string;
  assigneeId?: string;
}

export interface UpdateTaskData {
  title?: string;
  assigneeId?: string;
  milestoneId?: string;
  priority?: string;
}

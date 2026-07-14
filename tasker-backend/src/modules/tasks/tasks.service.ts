import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  checkAdminQuery,
  findTasksByProjectQuery,
  findAllTasksForExpertQuery,
  getMilestoneAssigneeQuery,
  createTaskQuery,
  getTaskForUpdateQuery,
  updateTaskStatusQuery,
  updateTaskQuery,
  getTaskForDeleteQuery,
  deleteTaskQuery,
  getMilestoneStatusQuery,
  getSiblingTasksQuery,
  updateMilestoneStatusQuery,
} from "@/queries/tasks";

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

@Injectable()
export class TasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await checkAdminQuery(this.db, userId, projectId);
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
    return findTasksByProjectQuery(this.db, projectId);
  }

  async findAllForExpert(expertId: string) {
    return findAllTasksForExpertQuery(this.db, expertId);
  }

  // ─── WRITE ──────────────────────────────────────────────────────────────────

  async create(projectId: string, data: CreateTaskData) {
    return this.db.transaction().execute(async (trx) => {
      let assigneeId = data.assigneeId ?? null;
      if (!assigneeId && data.milestoneId) {
        const milestone = await getMilestoneAssigneeQuery(
          trx,
          data.milestoneId,
        );
        assigneeId = milestone?.assigneeId ?? null;
      }

      return createTaskQuery(trx, { ...data, projectId, assigneeId });
    });
  }

  async updateStatus(actorId: string, id: string, status: string) {
    const task = await getTaskForUpdateQuery(this.db, id);

    if (!task) throw new NotFoundException("Task not found");
    await this._checkAssigneeOrAdmin(actorId, task);

    return this.db.transaction().execute(async (trx) => {
      const updatedTask = await updateTaskStatusQuery(trx, id, status);

      if (updatedTask.milestoneId) {
        await this._recalculateMilestoneProgress(trx, updatedTask.milestoneId);
      }

      return updatedTask;
    });
  }

  async update(actorId: string, id: string, data: UpdateTaskData) {
    const task = await getTaskForUpdateQuery(this.db, id);

    if (!task) throw new NotFoundException("Task not found");
    await this._checkAssigneeOrAdmin(actorId, task);

    const patch: Record<string, unknown> = {};
    if (data.title !== undefined) patch.title = data.title;
    if (data.assigneeId !== undefined) patch.assigneeId = data.assigneeId;
    if (data.milestoneId !== undefined) patch.milestoneId = data.milestoneId;
    if (data.priority !== undefined) patch.priority = data.priority;

    return updateTaskQuery(this.db, id, patch);
  }

  async remove(actorId: string, id: string) {
    return this.db.transaction().execute(async (trx) => {
      const task = await getTaskForDeleteQuery(trx, id);

      if (!task) throw new NotFoundException(`Task ${id} not found`);

      if (task.projectId) {
        const isAdmin = await checkAdminQuery(trx, actorId, task.projectId);
        if (!isAdmin)
          throw new ForbiddenException("Must be CLIENT_ADMIN to delete a task");
      }

      await deleteTaskQuery(trx, id);

      if (task.milestoneId) {
        await this._recalculateMilestoneProgress(trx, task.milestoneId);
      }

      return { success: true };
    });
  }

  // ─── PRIVATE HELPERS ────────────────────────────────────────────────────────

  private async _recalculateMilestoneProgress(
    trx: Transaction<DB>,
    milestoneId: string,
  ): Promise<void> {
    const currentMilestone = await getMilestoneStatusQuery(trx, milestoneId);

    if (!currentMilestone) return;
    if (
      currentMilestone.status === "PAID" ||
      currentMilestone.status === "REVIEW"
    )
      return;

    const siblingTasks = await getSiblingTasksQuery(trx, milestoneId);

    const total = siblingTasks.length;
    const done = siblingTasks.filter((t) => t.status === "DONE").length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;

    let milestoneStatus: string;
    if (total === 0) milestoneStatus = "PENDING";
    else if (progress === 100) milestoneStatus = "REVIEW";
    else milestoneStatus = "ACTIVE";

    await updateMilestoneStatusQuery(trx, milestoneId, milestoneStatus);
  }
}

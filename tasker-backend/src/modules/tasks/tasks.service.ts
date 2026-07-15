import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import {
  validateTaskAction,
  TaskAction,
  TaskError,
  TaskSnapshot,
  calculateMilestoneStatus,
} from "@/modules/tasks/core/domain";

function mapLogicError(err: Error): never {
  if (err instanceof TaskError) {
    throw new ForbiddenException(err.message);
  }
  throw err;
}

function validateLogic(
  action: TaskAction,
  task: TaskSnapshot,
  actorId: string,
  isProjectAdmin: boolean,
): void {
  try {
    if (action === "MODIFY") {
      validateTaskAction("MODIFY", task, actorId, isProjectAdmin);
    } else {
      validateTaskAction("DELETE", task, actorId, isProjectAdmin);
    }
  } catch (err) {
    mapLogicError(err as Error);
  }
}
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
  findQuickTasksForExpertWorkspaceQuery,
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
    if (!projectId) return false;
    const admin = await checkAdminQuery(this.db, userId, projectId);
    return !!admin;
  }

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByProject(projectId: string) {
    return findTasksByProjectQuery(this.db, projectId);
  }

  async findAllForExpert(expertId: string) {
    const internalTasks = await findAllTasksForExpertQuery(this.db, expertId);
    const quickTasks = await findQuickTasksForExpertWorkspaceQuery(this.db, expertId);

    const formattedQuickTasks = quickTasks.map((qt) => ({
      id: qt.id,
      projectId: null,
      milestoneId: null,
      title: qt.title,
      // Map Quick Task status to Kanban columns
      status: qt.status === "COMPLETED" ? "DONE" : qt.status,
      priority: "HIGH",
      assigneeId: qt.expertId,
      projectName: "Quick Task",
      milestoneName: null,
      clientName: (qt as any).clientName,
      createdAt: qt.createdAt,
      updatedAt: qt.updatedAt,
      isQuickTask: true,
    }));

    return [...internalTasks, ...formattedQuickTasks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
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
    
    const isAdmin = await this._checkAdmin(actorId, task.projectId as string);
    const snapshot: TaskSnapshot = { assigneeId: task.assigneeId, projectId: task.projectId };
    validateLogic("MODIFY", snapshot, actorId, isAdmin);

    // Experts cannot move Milestone tasks to DONE directly
    if (task.milestoneId && status === "DONE" && !isAdmin) {
      throw new ForbiddenException("Experts can only move milestone tasks to REVIEW. DONE is automatically set when Client approves the milestone.");
    }

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
    
    const isAdmin = await this._checkAdmin(actorId, task.projectId as string);
    const snapshot: TaskSnapshot = { assigneeId: task.assigneeId, projectId: task.projectId };
    validateLogic("MODIFY", snapshot, actorId, isAdmin);

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

      const isAdmin = await this._checkAdmin(actorId, task.projectId as string);
      const snapshot: TaskSnapshot = { projectId: task.projectId };
      validateLogic("DELETE", snapshot, actorId, isAdmin);

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
    const doneTasks = siblingTasks.filter((t) => t.status === "DONE").length;

    const milestoneStatus = calculateMilestoneStatus(total, doneTasks);

    await updateMilestoneStatusQuery(trx, milestoneId, milestoneStatus);
  }
}

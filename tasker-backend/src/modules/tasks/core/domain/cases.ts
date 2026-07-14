import {
  NotAuthorizedTaskModifierError,
  NotAuthorizedTaskDeleterError,
} from "./errors";

export interface TaskSnapshot {
  assigneeId?: string | null;
  projectId?: string | null;
}

export function canModify(
  task: TaskSnapshot,
  actorId: string,
  isProjectAdmin: boolean,
): void {
  // Must be the assigned expert OR a project admin
  if (task.assigneeId !== actorId && !isProjectAdmin) {
    throw new NotAuthorizedTaskModifierError();
  }
}

export function canDelete(isProjectAdmin: boolean): void {
  // Only project admins can delete a task
  if (!isProjectAdmin) {
    throw new NotAuthorizedTaskDeleterError();
  }
}

/**
 * Tính toán trạng thái của Milestone cha dựa trên tiến độ của các Task con.
 */
export function calculateMilestoneStatus(
  totalTasks: number,
  doneTasks: number,
): "PENDING" | "ACTIVE" | "REVIEW" {
  if (totalTasks === 0) return "PENDING";

  const progress = Math.round((doneTasks / totalTasks) * 100);
  if (progress === 100) return "REVIEW";

  return "ACTIVE";
}

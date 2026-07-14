import { canModify, canDelete, TaskSnapshot } from "./cases";

export type TaskAction = "MODIFY" | "DELETE";

export function validateTaskAction(
  action: "MODIFY",
  task: TaskSnapshot,
  actorId: string,
  isProjectAdmin: boolean,
): void;
export function validateTaskAction(
  action: "DELETE",
  task: TaskSnapshot, // unused in rule currently but kept for interface consistency
  actorId: string,
  isProjectAdmin: boolean,
): void;
export function validateTaskAction(
  action: TaskAction,
  task: TaskSnapshot,
  actorId: string,
  isProjectAdmin: boolean,
): void {
  switch (action) {
    case "MODIFY":
      return canModify(task, actorId, isProjectAdmin);
    case "DELETE":
      return canDelete(isProjectAdmin);
    default:
      throw new Error(`Unhandled task action: ${String(action)}`);
  }
}

export {
  TaskError,
  NotAuthorizedTaskModifierError,
  NotAuthorizedTaskDeleterError,
} from "./errors";
export { TaskSnapshot, calculateMilestoneStatus } from "./cases";

import {
  canUpdate,
  canDelete,
  ProjectDeleteSnapshot,
  ProjectUpdatePatch,
  ProjectUpdateSnapshot,
} from "./cases";

export type ProjectAction = "UPDATE" | "DELETE";

export function validateProjectAction(
  action: "UPDATE",
  patch: ProjectUpdatePatch,
  snapshot: ProjectUpdateSnapshot,
): void;
export function validateProjectAction(
  action: "DELETE",
  snapshot: ProjectDeleteSnapshot,
): void;
export function validateProjectAction(
  action: ProjectAction,
  payload1: any,
  payload2?: any,
): void {
  switch (action) {
    case "UPDATE":
      return canUpdate(
        payload1 as ProjectUpdatePatch,
        payload2 as ProjectUpdateSnapshot,
      );
    case "DELETE":
      return canDelete(payload1 as ProjectDeleteSnapshot);
    default:
      throw new Error(`Unhandled project action: ${String(action)}`);
  }
}

export {
  ProjectError,
  ProjectHasFinancialHistoryError,
  ProjectHasActiveTransactionsError,
  ProjectHasActiveMilestonesError,
  ProjectBudgetDirectUpdateForbiddenError,
  ProjectStatusUpdateForbiddenError,
} from "./errors";
export {
  ProjectDeleteSnapshot,
  ProjectUpdatePatch,
  ProjectUpdateSnapshot,
} from "./cases";

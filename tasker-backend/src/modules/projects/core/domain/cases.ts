import {
  ProjectHasFinancialHistoryError,
  ProjectHasActiveTransactionsError,
  ProjectHasActiveMilestonesError,
  ProjectBudgetDirectUpdateForbiddenError,
  ProjectStatusUpdateForbiddenError,
} from "./errors";

export interface ProjectDeleteSnapshot {
  escrow: number;
  spent: number;
  activeTransactionsCount: number;
  activeMilestonesCount: number;
}

export interface ProjectUpdatePatch {
  budget?: string | number | null;
  status?: string | null;
}

export interface ProjectUpdateSnapshot {
  status: string;
  escrow: number;
}

export function canUpdate(
  patch: ProjectUpdatePatch,
  snapshot: ProjectUpdateSnapshot,
): void {
  // Budget must not be updated directly through standard update flow
  if (patch.budget !== undefined && patch.budget !== null) {
    throw new ProjectBudgetDirectUpdateForbiddenError();
  }

  // Cannot backtrack status to DRAFT if project is already IN_PROGRESS or has escrow
  if (patch.status && patch.status === "DRAFT") {
    if (snapshot.status !== "DRAFT" || snapshot.escrow > 0) {
      throw new ProjectStatusUpdateForbiddenError(
        snapshot.status,
        patch.status,
      );
    }
  }
}

export function canDelete(snapshot: ProjectDeleteSnapshot): void {
  if (snapshot.escrow > 0 || snapshot.spent > 0) {
    throw new ProjectHasFinancialHistoryError();
  }

  if (snapshot.activeTransactionsCount > 0) {
    throw new ProjectHasActiveTransactionsError();
  }

  if (snapshot.activeMilestonesCount > 0) {
    throw new ProjectHasActiveMilestonesError();
  }
}

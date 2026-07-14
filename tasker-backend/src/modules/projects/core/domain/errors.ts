export class ProjectError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProjectError";
  }
}

export class ProjectHasFinancialHistoryError extends ProjectError {
  constructor() {
    super(
      "PROJECT_HAS_FINANCIAL_HISTORY",
      "Cannot delete a project that holds escrow funds or has a financial history.",
    );
  }
}

export class ProjectHasActiveTransactionsError extends ProjectError {
  constructor() {
    super(
      "PROJECT_HAS_ACTIVE_TRANSACTIONS",
      "Cannot delete a project with financial transactions. Please archive it instead.",
    );
  }
}

export class ProjectHasActiveMilestonesError extends ProjectError {
  constructor() {
    super(
      "PROJECT_HAS_ACTIVE_MILESTONES",
      "Cannot delete a project that has active, in-review, or paid milestones.",
    );
  }
}

export class ProjectBudgetDirectUpdateForbiddenError extends ProjectError {
  constructor() {
    super(
      "PROJECT_BUDGET_UPDATE_FORBIDDEN",
      "Directly updating project budget is forbidden. Use the 'addFunds' flow instead.",
    );
  }
}

export class ProjectStatusUpdateForbiddenError extends ProjectError {
  constructor(oldStatus: string, newStatus: string) {
    super(
      "PROJECT_STATUS_UPDATE_FORBIDDEN",
      `Cannot transition project status from ${oldStatus} to ${newStatus}.`,
    );
  }
}

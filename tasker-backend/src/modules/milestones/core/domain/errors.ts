export class MilestoneError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "MilestoneError";
  }
}

export class NotAssignedExpertError extends MilestoneError {
  constructor() {
    super(
      "MILESTONE_NOT_ASSIGNED_EXPERT",
      "Only the assigned expert can perform this action.",
    );
  }
}

export class InvalidStatusForSubmitError extends MilestoneError {
  constructor(currentStatus: string) {
    super(
      "MILESTONE_INVALID_STATUS_FOR_SUBMIT",
      `Cannot submit deliverable. Status is "${currentStatus}", expected "ACTIVE" or "OVERDUE".`,
    );
  }
}

export class InvalidStatusForApproveError extends MilestoneError {
  constructor(currentStatus: string) {
    super(
      "MILESTONE_INVALID_STATUS_FOR_APPROVE",
      `Cannot approve deliverable. Status is "${currentStatus}", expected "REVIEW".`,
    );
  }
}

export class MilestoneNotCancelableError extends MilestoneError {
  constructor(currentStatus: string) {
    super(
      "MILESTONE_NOT_CANCELABLE",
      `Cannot cancel milestone. Status is "${currentStatus}". ACTIVE milestones cannot be canceled directly.`,
    );
  }
}

export class InvalidStatusForDisputeError extends MilestoneError {
  constructor(currentStatus: string) {
    super(
      "MILESTONE_INVALID_STATUS_FOR_DISPUTE",
      `Cannot dispute milestone. Status is "${currentStatus}", expected "ACTIVE", "REVIEW", or "OVERDUE".`,
    );
  }
}

export class InvalidStatusForTimeoutError extends MilestoneError {
  constructor(currentStatus: string) {
    super(
      "MILESTONE_INVALID_STATUS_FOR_TIMEOUT",
      `Cannot timeout milestone. Status is "${currentStatus}", expected "ACTIVE" or "REVIEW".`,
    );
  }
}

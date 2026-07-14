/**
 * Typed errors cho Quick Task lifecycle.
 * KHÔNG phụ thuộc NestJS — Service sẽ bắt QuickTaskError và convert sang HTTP exception.
 *
 * Convention: error.code dùng để map sang HTTP status nếu cần.
 *   QT_NOT_FOUND          → 404
 *   QT_NOT_ASSIGNED_*     → 403
 *   QT_INVALID_STATUS_*   → 400
 *   QT_HAS_CONTRACT       → 400
 *   QT_CONTRACT_NOT_HELD  → 400 (interlock với Payment lifecycle)
 */
export class QuickTaskError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "QuickTaskError";
  }
}

// ── Submit Deliverable ─────────────────────────────────────────────────────────

/** actorId không phải expertId được assign cho task */
export class NotAssignedExpertError extends QuickTaskError {
  constructor() {
    super(
      "QT_NOT_ASSIGNED_EXPERT",
      "Only the assigned expert can submit deliverables.",
    );
  }
}

/** task.status !== 'IN_PROGRESS' khi expert muốn submit */
export class InvalidStatusForSubmitError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QT_INVALID_STATUS_FOR_SUBMIT",
      `Cannot submit deliverable. Task is "${currentStatus}", expected "IN_PROGRESS".`,
    );
  }
}

// ── Approve Deliverable ────────────────────────────────────────────────────────

/** actorId không phải clientId của task */
export class NotTaskClientError extends QuickTaskError {
  constructor() {
    super("QT_NOT_CLIENT", "Only the task client can approve deliverables.");
  }
}

/** task.status !== 'REVIEW' khi client muốn approve */
export class InvalidStatusForApproveError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QT_INVALID_STATUS_FOR_APPROVE",
      `Cannot approve deliverable. Task is "${currentStatus}", expected "REVIEW".`,
    );
  }
}

// ── Delete ─────────────────────────────────────────────────────────────────────

/** task.status !== 'OPEN' khi muốn xóa */
export class TaskNotDeletableStatusError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QT_NOT_DELETABLE",
      `Cannot delete. Task is "${currentStatus}". Only "OPEN" tasks can be deleted.`,
    );
  }
}

/** Tồn tại Contract liên kết với task (đã có escrow) */
export class TaskHasActiveContractError extends QuickTaskError {
  constructor() {
    super(
      "QT_HAS_CONTRACT",
      "Cannot delete a task that has an active contract.",
    );
  }
}

// ── Lifecycle Interlock ────────────────────────────────────────────────────────

/**
 * Contract chưa ở trạng thái HELD khi task muốn vào IN_PROGRESS.
 * Đây là interlock bắt buộc: Payment lifecycle (escrow locked) phải hoàn thành
 * trước khi Quick Task lifecycle có thể tiến sang IN_PROGRESS.
 */
export class ContractNotHeldError extends QuickTaskError {
  constructor() {
    super(
      "QT_CONTRACT_NOT_HELD",
      'Cannot start task. Contract escrow must be "HELD" before task can begin.',
    );
  }
}

export class InvalidStatusForCancelError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QUICK_TASK_INVALID_STATUS_FOR_CANCEL",
      `Cannot cancel quick task from status: ${currentStatus}. Quick task must be OPEN.`,
    );
  }
}

export class InvalidStatusForDisputeError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QT_INVALID_STATUS_DISPUTE",
      `Cannot dispute. Task is "${currentStatus}", expected "IN_PROGRESS" or "REVIEW".`,
    );
  }
}

export class InvalidStatusForTimeoutError extends QuickTaskError {
  constructor(currentStatus: string) {
    super(
      "QT_INVALID_STATUS_TIMEOUT",
      `Cannot timeout. Task is "${currentStatus}", expected "IN_PROGRESS" or "REVIEW".`,
    );
  }
}

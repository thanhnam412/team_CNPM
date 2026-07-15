import {
  NotTaskClientError,
  InvalidStatusForApproveError,
  TaskNotDeletableStatusError,
  TaskHasActiveContractError,
  InvalidStatusForDisputeError,
  NotAssignedExpertError,
  InvalidStatusForSubmitError,
  InvalidStatusForTimeoutError,
  ContractNotHeldError,
  InvalidStatusForCancelError,
} from "./errors";
import type { QuickTaskSnapshot } from "./quick-task.lifecycle";

/**
 * Case: Client phê duyệt kết quả (Approve Deliverable)
 */
export function canApproveDeliverable(
  task: QuickTaskSnapshot,
  actorId: string,
): void {
  if (task.clientId !== actorId) {
    throw new NotTaskClientError();
  }
  if (task.status !== "REVIEW") {
    throw new InvalidStatusForApproveError(task.status);
  }
}

/**
 * Case: Xóa Quick Task
 */
export function canDelete(task: QuickTaskSnapshot, actorId: string): void {
  if (task.clientId !== actorId) {
    throw new NotTaskClientError();
  }
  if (task.status !== "OPEN") {
    throw new TaskNotDeletableStatusError(task.status);
  }
  if (task.contractEscrowStatus !== null) {
    throw new TaskHasActiveContractError();
  }
}

/**
 * Case: Chuyển task sang trạng thái DISPUTE
 */
export function canDispute(task: QuickTaskSnapshot): void {
  if (task.status !== "IN_PROGRESS" && task.status !== "REVIEW") {
    throw new InvalidStatusForDisputeError(task.status);
  }
}

/**
 * Case: Expert nộp sản phẩm (Submit Deliverable)
 */
export function canSubmitDeliverable(
  task: QuickTaskSnapshot,
  actorId: string,
): void {
  if (task.expertId !== actorId) {
    throw new NotAssignedExpertError();
  }
  if (task.status !== "IN_PROGRESS") {
    throw new InvalidStatusForSubmitError(task.status);
  }
}

/**
 * Case: Chuyển task sang trạng thái SYSTEM_RESOLVING
 */
export function canTimeout(task: QuickTaskSnapshot): void {
  if (task.status !== "IN_PROGRESS" && task.status !== "REVIEW") {
    throw new InvalidStatusForTimeoutError(task.status);
  }
}

/**
 * Case: Chuyển Quick Task sang IN_PROGRESS (Lifecycle Interlock)
 */
export function canTransitionToInProgress(task: QuickTaskSnapshot): void {
  if (task.contractEscrowStatus !== "HELD") {
    throw new ContractNotHeldError();
  }
}

/**
 * Case: Hủy Quick Task
 */
export function canCancel(task: QuickTaskSnapshot, actorId: string): void {
  if (task.clientId !== actorId) {
    throw new NotTaskClientError();
  }
  // Can only cancel before it becomes IN_PROGRESS (e.g. while OPEN)
  if (task.status !== "OPEN") {
    throw new InvalidStatusForCancelError(task.status);
  }
}

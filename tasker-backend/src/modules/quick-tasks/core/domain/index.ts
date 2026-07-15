// Public interface của quick-task logic layer
import {
  canApproveDeliverable,
  canDelete,
  canTransitionToInProgress,
  canDispute,
  canTimeout,
  canSubmitDeliverable,
  canCancel,
} from "./cases";
import { QuickTaskSnapshot } from "./quick-task.lifecycle";

export type QuickTaskAction =
  | "SUBMIT_DELIVERABLE"
  | "APPROVE_DELIVERABLE"
  | "DELETE"
  | "TRANSITION_TO_IN_PROGRESS"
  | "DISPUTE"
  | "TIMEOUT"
  | "CANCEL";

/**
 * Single entry point for all Quick Task logic validations.
 * Uses a switch-case to route to the correct business rule.
 */
export function validateQuickTaskAction(
  action: QuickTaskAction,
  snapshot: QuickTaskSnapshot,
  actorId?: string,
): void {
  switch (action) {
    case "SUBMIT_DELIVERABLE":
      return canSubmitDeliverable(snapshot, actorId as string);
    case "APPROVE_DELIVERABLE":
      return canApproveDeliverable(snapshot, actorId as string);
    case "DELETE":
      return canDelete(snapshot, actorId as string);
    case "TRANSITION_TO_IN_PROGRESS":
      return canTransitionToInProgress(snapshot);
    case "DISPUTE":
      return canDispute(snapshot);
    case "TIMEOUT":
      return canTimeout(snapshot);
    case "CANCEL":
      return canCancel(snapshot, actorId as string);
    default:
      throw new Error(`Unhandled logic action: ${String(action)}`);
  }
}

export {
  QuickTaskError,
  NotAssignedExpertError,
  InvalidStatusForSubmitError,
  NotTaskClientError,
  InvalidStatusForApproveError,
  TaskNotDeletableStatusError,
  TaskHasActiveContractError,
  ContractNotHeldError,
  InvalidStatusForDisputeError,
  InvalidStatusForTimeoutError,
} from "./errors";

export type {
  QuickTaskSnapshot,
  QuickTaskStatus,
  ContractEscrowStatus,
} from "./quick-task.lifecycle";

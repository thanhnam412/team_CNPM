import {
  canSubmitDeliverable,
  canApproveDeliverable,
  canCancel,
  canDispute,
  canTimeout,
  MilestoneSnapshot,
} from "./cases";

export type MilestoneAction =
  | "SUBMIT_DELIVERABLE"
  | "APPROVE_DELIVERABLE"
  | "CANCEL"
  | "DISPUTE"
  | "TIMEOUT";

export function validateMilestoneAction(
  action: MilestoneAction,
  snapshot: MilestoneSnapshot,
  actorId?: string,
): void {
  switch (action) {
    case "SUBMIT_DELIVERABLE":
      return canSubmitDeliverable(snapshot, actorId as string);
    case "APPROVE_DELIVERABLE":
      return canApproveDeliverable(snapshot);
    case "CANCEL":
      return canCancel(snapshot);
    case "DISPUTE":
      return canDispute(snapshot);
    case "TIMEOUT":
      return canTimeout(snapshot);
    default:
      throw new Error(`Unhandled milestone action: ${String(action)}`);
  }
}

export { MilestoneError } from "./errors";
export { MilestoneSnapshot } from "./cases";

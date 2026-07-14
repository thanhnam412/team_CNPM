import {
  NotAssignedExpertError,
  InvalidStatusForSubmitError,
  InvalidStatusForApproveError,
  MilestoneNotCancelableError,
  InvalidStatusForDisputeError,
  InvalidStatusForTimeoutError,
} from "./errors";

export interface MilestoneSnapshot {
  id: string;
  status: string;
  expertId?: string | null;
  clientId?: string | null;
}

export function canSubmitDeliverable(
  milestone: MilestoneSnapshot,
  actorId: string,
): void {
  if (milestone.expertId !== actorId) {
    throw new NotAssignedExpertError();
  }
  if (milestone.status !== "ACTIVE" && milestone.status !== "OVERDUE") {
    throw new InvalidStatusForSubmitError(milestone.status);
  }
}

export function canApproveDeliverable(milestone: MilestoneSnapshot): void {
  // actorId is validated at the service level (must be CLIENT_ADMIN)
  if (milestone.status !== "REVIEW") {
    throw new InvalidStatusForApproveError(milestone.status);
  }
}

export function canCancel(milestone: MilestoneSnapshot): void {
  if (milestone.status === "ACTIVE" || milestone.status === "REVIEW") {
    throw new MilestoneNotCancelableError(milestone.status);
  }
}

export function canDispute(milestone: MilestoneSnapshot): void {
  if (
    milestone.status !== "ACTIVE" &&
    milestone.status !== "REVIEW" &&
    milestone.status !== "OVERDUE"
  ) {
    throw new InvalidStatusForDisputeError(milestone.status);
  }
}

export function canTimeout(milestone: MilestoneSnapshot): void {
  if (milestone.status !== "ACTIVE" && milestone.status !== "REVIEW") {
    throw new InvalidStatusForTimeoutError(milestone.status);
  }
}

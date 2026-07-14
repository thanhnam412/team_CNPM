import { BadRequestException, ForbiddenException } from "@nestjs/common";
import {
  MilestoneError,
  MilestoneAction,
  MilestoneSnapshot,
  validateMilestoneAction,
} from "@/modules/milestones/core/domain";

export function mapLogicError(err: Error): never {
  if (err instanceof MilestoneError) {
    switch (err.code) {
      case "MILESTONE_NOT_ASSIGNED_EXPERT":
        throw new ForbiddenException(err.message);
      default:
        throw new BadRequestException(err.message);
    }
  }
  throw err;
}

export function validateLogic(
  action: MilestoneAction,
  snapshot: MilestoneSnapshot,
  actorId?: string,
): void {
  try {
    validateMilestoneAction(action, snapshot, actorId);
  } catch (err) {
    mapLogicError(err as Error);
  }
}

import { BadRequestException, ForbiddenException } from "@nestjs/common";
import {
  QuickTaskError,
  validateQuickTaskAction,
  QuickTaskAction,
} from "@/modules/quick-tasks/core/domain";

export function mapLogicError(err: Error): never {
  if (err instanceof QuickTaskError) {
    switch (err.code) {
      case "QT_NOT_ASSIGNED_EXPERT":
      case "QT_NOT_CLIENT":
        throw new ForbiddenException(err.message);
      default:
        throw new BadRequestException(err.message);
    }
  }
  throw err;
}

export function validateLogic(
  action: QuickTaskAction,
  snapshot: any,
  actorId?: string,
): void {
  try {
    validateQuickTaskAction(action, snapshot, actorId);
  } catch (err) {
    mapLogicError(err as Error);
  }
}

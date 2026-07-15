import { BadRequestException } from "@nestjs/common";
import {
  validateProposalAction,
  ProposalAction,
  ActorRole,
  DealContext,
  ProposalError,
} from "@/modules/proposals/core/domain";

export function mapLogicError(err: Error): never {
  if (err instanceof ProposalError) {
    switch (err.code) {
      case "PROPOSAL_INVALID_COUNTER_OFFER":
        throw new BadRequestException(err.message);
      case "PROPOSAL_NOT_CLIENT":
      case "PROPOSAL_NOT_EXPERT":
        throw new BadRequestException(err.message);
      case "PROPOSAL_INVALID_STATUS":
        throw new BadRequestException(err.message);
      default:
        throw new BadRequestException(err.message);
    }
  }
  throw err;
}

export function validateLogic(
  action: ProposalAction,
  payload: any,
  actorId?: string,
): void {
  try {
    validateProposalAction(action, payload, actorId);
  } catch (err) {
    mapLogicError(err as Error);
  }
}

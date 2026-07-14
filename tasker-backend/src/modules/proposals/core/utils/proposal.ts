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
      default:
        throw new BadRequestException(err.message);
    }
  }
  throw err;
}

export function validateLogic(
  action: ProposalAction,
  context: DealContext,
  role: ActorRole,
  newPrice: number,
): void {
  try {
    validateProposalAction(action, context, role, newPrice);
  } catch (err) {
    mapLogicError(err as Error);
  }
}

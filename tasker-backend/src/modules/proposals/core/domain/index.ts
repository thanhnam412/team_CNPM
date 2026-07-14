import { canCounterOffer, ActorRole, DealContext } from "./cases";

export type ProposalAction = "COUNTER_OFFER";

export function validateProposalAction(
  action: ProposalAction,
  context: DealContext,
  role: ActorRole,
  newPrice: number,
): void {
  switch (action) {
    case "COUNTER_OFFER":
      return canCounterOffer(context, role, newPrice);
    default:
      throw new Error(`Unhandled logic action: ${String(action)}`);
  }
}

export { ProposalError, InvalidCounterOfferError } from "./errors";
export { ActorRole, DealContext } from "./cases";

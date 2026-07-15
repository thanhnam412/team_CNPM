import { canCounterOffer, canAccept, canReject, canWithdraw, ActorRole, DealContext, ProposalSnapshot } from "./cases";

export type ProposalAction = "COUNTER_OFFER" | "ACCEPT" | "REJECT" | "WITHDRAW";

export function validateProposalAction(
  action: ProposalAction,
  payload: any,
  actorId?: string,
): void {
  switch (action) {
    case "COUNTER_OFFER":
      return canCounterOffer(payload.context, payload.role, payload.newPrice);
    case "ACCEPT":
      return canAccept(payload as ProposalSnapshot, actorId!);
    case "REJECT":
      return canReject(payload as ProposalSnapshot, actorId!);
    case "WITHDRAW":
      return canWithdraw(payload as ProposalSnapshot, actorId!);
    default:
      throw new Error(`Unhandled logic action: ${String(action)}`);
  }
}

export { ProposalError, InvalidCounterOfferError, NotProposalClientError, NotProposalExpertError, InvalidStatusForProposalActionError } from "./errors";
export { ActorRole, DealContext, ProposalSnapshot } from "./cases";

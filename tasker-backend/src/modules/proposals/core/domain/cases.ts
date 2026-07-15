import { InvalidCounterOfferError, NotProposalClientError, NotProposalExpertError, InvalidStatusForProposalActionError } from "./errors";

export type ActorRole = "CLIENT" | "EXPERT";

export interface DealContext {
  initialTaskBudget: number; // Client's initial posted price
  initialExpertBid: number; // Expert's initial proposed price
  lastClientOffer?: number; // The last price client offered in negotiation
  lastExpertOffer?: number; // The last price expert offered in negotiation
}

export function canCounterOffer(
  context: DealContext,
  role: ActorRole,
  newPrice: number,
) {
  if (role === "CLIENT") {
    // Client wants to lower price to save money
    // Must be <= their last offer (or initial budget if no previous offer)
    const maxAllowed = context.lastClientOffer ?? context.initialTaskBudget;
    if (newPrice > maxAllowed) {
      throw new InvalidCounterOfferError(
        `Client can only counter with a lower or equal price. Max allowed: ${maxAllowed}`,
      );
    }
  } else if (role === "EXPERT") {
    // Expert wants to raise price to earn more
    // Must be >= their last offer (or initial bid if no previous offer)
    const minAllowed = context.lastExpertOffer ?? context.initialExpertBid;
    if (newPrice < minAllowed) {
      throw new InvalidCounterOfferError(
        `Expert can only counter with a higher or equal price. Min allowed: ${minAllowed}`,
      );
    }
  }
}

export interface ProposalSnapshot {
  id: string;
  status: string;
  clientId: string;
  expertId: string;
}

export function canAccept(proposal: ProposalSnapshot, actorId: string): void {
  if (proposal.clientId !== actorId) {
    throw new NotProposalClientError();
  }
  if (proposal.status !== "PENDING") {
    throw new InvalidStatusForProposalActionError(proposal.status, "ACCEPT");
  }
}

export function canReject(proposal: ProposalSnapshot, actorId: string): void {
  if (proposal.clientId !== actorId) {
    throw new NotProposalClientError();
  }
  if (proposal.status !== "PENDING") {
    throw new InvalidStatusForProposalActionError(proposal.status, "REJECT");
  }
}

export function canWithdraw(proposal: ProposalSnapshot, actorId: string): void {
  if (proposal.expertId !== actorId) {
    throw new NotProposalExpertError();
  }
  if (proposal.status !== "PENDING") {
    throw new InvalidStatusForProposalActionError(proposal.status, "WITHDRAW");
  }
}

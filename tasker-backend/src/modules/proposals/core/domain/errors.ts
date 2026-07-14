export class ProposalError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ProposalError";
  }
}

export class InvalidCounterOfferError extends ProposalError {
  constructor(message: string) {
    super("PROPOSAL_INVALID_COUNTER_OFFER", message);
  }
}

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

export class NotProposalClientError extends ProposalError {
  constructor() {
    super("PROPOSAL_NOT_CLIENT", "You are not authorized to perform this action. Only the client can do this.");
  }
}

export class NotProposalExpertError extends ProposalError {
  constructor() {
    super("PROPOSAL_NOT_EXPERT", "You are not authorized to perform this action. Only the expert can do this.");
  }
}

export class InvalidStatusForProposalActionError extends ProposalError {
  constructor(status: string, action: string) {
    super("PROPOSAL_INVALID_STATUS", `Cannot perform ${action} when proposal is ${status}.`);
  }
}

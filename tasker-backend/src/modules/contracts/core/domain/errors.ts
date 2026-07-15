export class ContractError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "ContractError";
  }
}

export class NotContractClientError extends ContractError {
  constructor() {
    super("CONTRACT_NOT_CLIENT", "Only the client can perform this action on the contract.");
  }
}

export class NotContractExpertError extends ContractError {
  constructor() {
    super("CONTRACT_NOT_EXPERT", "Only the assigned expert can perform this action on the contract.");
  }
}

export class InvalidEscrowStatusForReleaseError extends ContractError {
  constructor(status: string) {
    super(
      "CONTRACT_INVALID_ESCROW_STATUS",
      `Cannot release funds. Contract escrow status is "${status}", expected "HELD".`,
    );
  }
}

export class InvalidEscrowStatusForCancelError extends ContractError {
  constructor(status: string) {
    super(
      "CONTRACT_INVALID_ESCROW_STATUS",
      `Cannot cancel contract. Contract escrow status is "${status}", expected "HELD".`,
    );
  }
}

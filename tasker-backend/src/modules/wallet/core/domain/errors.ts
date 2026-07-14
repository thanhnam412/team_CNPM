export class WalletError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = "WalletError";
  }
}

export class InvalidAmountError extends WalletError {
  constructor(amount: number) {
    super(
      "WALLET_INVALID_AMOUNT",
      `Amount must be strictly greater than 0. Got: ${amount}`,
    );
  }
}

export class InsufficientBalanceError extends WalletError {
  constructor(currentBalance: number, requiredAmount: number) {
    super(
      "WALLET_INSUFFICIENT_BALANCE",
      `Insufficient balance. Have: ${currentBalance}, Need: ${requiredAmount}`,
    );
  }
}

export class InsufficientEscrowError extends WalletError {
  constructor(currentEscrow: number, requiredAmount: number) {
    super(
      "WALLET_INSUFFICIENT_ESCROW",
      `Insufficient escrow balance. Have: ${currentEscrow}, Need: ${requiredAmount}`,
    );
  }
}

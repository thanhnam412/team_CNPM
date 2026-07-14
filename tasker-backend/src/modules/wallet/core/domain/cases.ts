import {
  InvalidAmountError,
  InsufficientBalanceError,
  InsufficientEscrowError,
} from "./errors";

export interface WalletSnapshot {
  balance: number;
  escrowBalance: number;
}

export interface ReleaseResult {
  feeAmount: number;
  expertAmount: number;
}

/**
 * Escrow: Đóng băng tiền từ Balance sang Escrow
 */
export function canEscrow(wallet: WalletSnapshot, amount: number): void {
  if (amount <= 0) {
    throw new InvalidAmountError(amount);
  }

  if (wallet.balance < amount) {
    throw new InsufficientBalanceError(wallet.balance, amount);
  }
}

/**
 * Release: Giải ngân tiền từ Escrow cho Expert
 * Mặc định thu 1% phí nền tảng
 */
export function canRelease(
  wallet: WalletSnapshot,
  amount: number,
): ReleaseResult {
  if (amount <= 0) {
    throw new InvalidAmountError(amount);
  }

  if (wallet.escrowBalance < amount) {
    throw new InsufficientEscrowError(wallet.escrowBalance, amount);
  }

  const feeAmount = Math.round(amount * 0.01);
  const expertAmount = amount - feeAmount;

  return { feeAmount, expertAmount };
}

/**
 * Refund: Hoàn tiền từ Escrow về lại Balance
 * Không thu phí
 */
export function canRefund(wallet: WalletSnapshot, amount: number): void {
  if (amount <= 0) {
    throw new InvalidAmountError(amount);
  }

  if (wallet.escrowBalance < amount) {
    throw new InsufficientEscrowError(wallet.escrowBalance, amount);
  }
}

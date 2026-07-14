import {
  canEscrow,
  canRelease,
  canRefund,
  WalletSnapshot,
  ReleaseResult,
} from "./cases";

export type WalletAction = "ESCROW" | "RELEASE" | "REFUND";

export function validateWalletAction(
  action: "RELEASE",
  wallet: WalletSnapshot,
  amount: number,
): ReleaseResult;
export function validateWalletAction(
  action: "ESCROW" | "REFUND",
  wallet: WalletSnapshot,
  amount: number,
): void;
export function validateWalletAction(
  action: WalletAction,
  wallet: WalletSnapshot,
  amount: number,
): ReleaseResult | void {
  switch (action) {
    case "ESCROW":
      return canEscrow(wallet, amount);
    case "RELEASE":
      return canRelease(wallet, amount);
    case "REFUND":
      return canRefund(wallet, amount);
    default:
      throw new Error(`Unhandled wallet action: ${String(action)}`);
  }
}

export {
  WalletError,
  InvalidAmountError,
  InsufficientBalanceError,
  InsufficientEscrowError,
} from "./errors";
export { WalletSnapshot, ReleaseResult } from "./cases";

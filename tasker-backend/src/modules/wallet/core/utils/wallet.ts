import { BadRequestException } from "@nestjs/common";
import {
  validateWalletAction,
  WalletAction,
  WalletError,
  WalletSnapshot,
  ReleaseResult,
} from "@/modules/wallet/core/domain";

export function mapLogicError(err: Error): never {
  if (err instanceof WalletError) {
    throw new BadRequestException(err.message);
  }
  throw err;
}

export function validateLogic(
  action: "RELEASE",
  wallet: WalletSnapshot,
  amount: number,
): ReleaseResult;
export function validateLogic(
  action: "ESCROW" | "REFUND",
  wallet: WalletSnapshot,
  amount: number,
): void;
export function validateLogic(
  action: WalletAction,
  wallet: WalletSnapshot,
  amount: number,
): ReleaseResult | void {
  try {
    if (action === "RELEASE") {
      return validateWalletAction("RELEASE", wallet, amount);
    } else {
      return validateWalletAction(action, wallet, amount);
    }
  } catch (err) {
    mapLogicError(err as Error);
  }
}

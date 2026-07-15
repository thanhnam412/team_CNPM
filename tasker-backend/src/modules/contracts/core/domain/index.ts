import { canRelease, canCancel, ContractSnapshot } from "./cases";

export type ContractAction = "RELEASE" | "CANCEL";

export function validateContractAction(
  action: ContractAction,
  contract: ContractSnapshot,
  actorId: string,
): void {
  switch (action) {
    case "RELEASE":
      return canRelease(contract, actorId);
    case "CANCEL":
      return canCancel(contract, actorId);
    default:
      throw new Error(`Unhandled logic action: ${String(action)}`);
  }
}

export * from "./errors";
export * from "./cases";

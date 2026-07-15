import {
  NotContractClientError,
  InvalidEscrowStatusForReleaseError,
  InvalidEscrowStatusForCancelError,
} from "./errors";

export type ContractStatus = "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
export type EscrowStatus = "PENDING" | "HELD" | "RELEASED" | "REFUNDED";

export interface ContractSnapshot {
  id: string;
  clientId: string;
  expertId: string;
  escrowStatus: EscrowStatus;
}

/**
 * Client releases funds to expert
 */
export function canRelease(contract: ContractSnapshot, actorId: string): void {
  if (contract.clientId !== actorId) {
    throw new NotContractClientError();
  }
  if (contract.escrowStatus !== "HELD") {
    throw new InvalidEscrowStatusForReleaseError(contract.escrowStatus);
  }
}

/**
 * Client cancels contract
 */
export function canCancel(contract: ContractSnapshot, actorId: string): void {
  if (contract.clientId !== actorId) {
    throw new NotContractClientError();
  }
  if (contract.escrowStatus !== "HELD") {
    throw new InvalidEscrowStatusForCancelError(contract.escrowStatus);
  }
}

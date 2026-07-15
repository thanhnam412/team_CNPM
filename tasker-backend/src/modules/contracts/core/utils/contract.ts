import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { ContractAction, validateContractAction, ContractError } from "../domain";

export function mapLogicError(err: Error): never {
  if (err instanceof ContractError) {
    switch (err.code) {
      case "CONTRACT_NOT_CLIENT":
      case "CONTRACT_NOT_EXPERT":
        throw new ForbiddenException(err.message);
      case "CONTRACT_INVALID_ESCROW_STATUS":
        throw new BadRequestException(err.message);
      default:
        throw new BadRequestException(err.message);
    }
  }
  throw err;
}

export function validateLogic(
  action: ContractAction,
  contract: any,
  actorId: string,
): void {
  try {
    validateContractAction(action, contract, actorId);
  } catch (err) {
    mapLogicError(err as Error);
  }
}

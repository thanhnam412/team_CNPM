import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  findContractsByUserQuery,
  findContractByIdQuery,
  findContractByMilestoneQuery,
  createContractQuery,
} from "@/queries/contracts";

export interface CreateContractData {
  milestoneId?: string;
  quickTaskId?: string;
  expertId: string;
  clientId: string;
  agreedPrice: number;
}

@Injectable()
export class ContractsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findByUser(userId: string) {
    return findContractsByUserQuery(this.db, userId);
  }

  async findById(contractId: string) {
    const contract = await findContractByIdQuery(this.db, contractId);

    if (!contract)
      throw new NotFoundException(`Contract ${contractId} not found`);
    return contract;
  }

  async findByMilestone(milestoneId: string) {
    return findContractByMilestoneQuery(this.db, milestoneId);
  }

  async create(data: CreateContractData, trx: Transaction<DB>): Promise<void> {
    await createContractQuery(trx, data);
  }
}

import { Injectable, Inject, NotFoundException } from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

/**
 * ContractsService — DOMAIN OWNER của: contracts
 *
 * CRUD thuần túy trên bảng contracts.
 * Logic release funds đã tách sang ReleasePaymentUseCase.
 */
@Injectable()
export class ContractsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByUser(userId: string) {
    return this.db
      .selectFrom("contracts")
      .selectAll()
      .where((eb) =>
        eb.or([eb("clientId", "=", userId), eb("expertId", "=", userId)]),
      )
      .orderBy("createdAt", "desc")
      .execute();
  }

  async findById(contractId: string) {
    const contract = await this.db
      .selectFrom("contracts")
      .selectAll()
      .where("id", "=", contractId)
      .executeTakeFirst();

    if (!contract)
      throw new NotFoundException(`Contract ${contractId} not found`);
    return contract;
  }

  async findByMilestone(milestoneId: string) {
    return this.db
      .selectFrom("contracts")
      .selectAll()
      .where("milestoneId", "=", milestoneId)
      .executeTakeFirst();
  }

  // ─── WRITE (gọi từ UseCase, nhận trx) ───────────────────────────────────────

  /**
   * Tạo Contract mới.
   * Được gọi từ AcceptProposalUseCase sau khi escrow và activate đã hoàn thành.
   */
  async create(data: CreateContractData, trx: Transaction<DB>): Promise<void> {
    await trx
      .insertInto("contracts")
      .values({
        id: crypto.randomUUID(),
        milestoneId: data.milestoneId ?? null,
        quickTaskId: data.quickTaskId ?? null,
        expertId: data.expertId,
        clientId: data.clientId,
        agreedPrice: data.agreedPrice.toString(),
        escrowStatus: "HELD",
        updatedAt: new Date(),
      })
      .execute();
  }
}

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────

export interface CreateContractData {
  milestoneId?: string;
  quickTaskId?: string;
  expertId: string;
  clientId: string;
  agreedPrice: number;
}

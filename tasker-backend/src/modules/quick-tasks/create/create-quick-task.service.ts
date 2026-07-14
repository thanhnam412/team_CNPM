import { Inject, Injectable, BadRequestException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { createQuickTaskQuery } from "@/queries/quick-tasks";
import { CreateQuickTaskDto } from "../core/dto/quick-tasks.dto";
import { EscrowService } from "@/modules/wallet/escrow/escrow.service";

@Injectable()
export class CreateQuickTaskService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly escrowService: EscrowService,
  ) {}

  async execute(clientId: string, data: CreateQuickTaskDto) {
    if (data.expertId && data.expertId === clientId) {
      throw new BadRequestException("You cannot assign a task to yourself.");
    }

    if (!data.budget || data.budget <= 0) {
      throw new BadRequestException(
        "A budget greater than 0 is required to post a quick task.",
      );
    }

    return this.db.transaction().execute(async (trx) => {
      // 1. Escrow money upfront
      await this.escrowService.processEscrow(
        trx,
        clientId,
        data.budget as number,
        "Escrow for posting Quick Task",
      );

      // 2. Create the task
      return createQuickTaskQuery(trx, clientId, data);
    });
  }
}

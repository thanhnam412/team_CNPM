import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getQuickTaskSnapshotQuery,
  deleteQuickTaskQuery,
} from "@/queries/quick-tasks";
import { validateLogic } from "../core/utils/quick-task";
import { RefundService } from "@/modules/wallet/refund/refund.service";

@Injectable()
export class RemoveQuickTaskService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly refundService: RefundService,
  ) {}

  async execute(id: string, actorId: string) {
    const qt = await this.db
      .selectFrom("quick_tasks")
      .select("budget")
      .where("id", "=", id)
      .executeTakeFirst();

    const snapshot = await getQuickTaskSnapshotQuery(this.db, id);
    if (!snapshot) throw new NotFoundException("Quick task not found");

    validateLogic("DELETE", snapshot, actorId);

    return this.db.transaction().execute(async (trx) => {
      const budget = Number(qt?.budget || 0);
      if (budget > 0) {
        await this.refundService.processRefund(
          trx,
          snapshot.clientId,
          budget,
          "Refund escrow from deleted task",
        );
      }
      await deleteQuickTaskQuery(trx, id);
      return { success: true };
    });
  }
}

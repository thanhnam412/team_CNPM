import { Inject, Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getQuickTaskSnapshotQuery,
  updateQuickTaskStatusQuery,
} from "@/queries/quick-tasks";
import { RefundService } from "@/modules/wallet/refund/refund.service";

@Injectable()
export class CancelQuickTaskService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly refundService: RefundService,
  ) {}

  async execute(id: string, actorId: string) {
    return this.db.transaction().execute(async (trx) => {
      const snapshot = await getQuickTaskSnapshotQuery(trx, id);
      if (!snapshot) throw new NotFoundException("Quick task not found");

      if (snapshot.clientId !== actorId) {
        throw new ForbiddenException("Only client can cancel this task.");
      }

      const qt = await trx
        .selectFrom("quick_tasks")
        .select("budget")
        .where("id", "=", id)
        .executeTakeFirst();
      const budget = Number(qt?.budget || 0);

      await updateQuickTaskStatusQuery(trx, id, "CANCELLED");

      if (budget > 0) {
        await this.refundService.processRefund(
          trx,
          snapshot.clientId,
          budget,
          "Refund escrow from cancelled task",
        );
      }
      return { success: true, status: "CANCELLED" };
    });
  }
}

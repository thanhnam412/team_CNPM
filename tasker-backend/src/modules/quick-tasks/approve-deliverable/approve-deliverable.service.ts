import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { getQuickTaskSnapshotQuery, updateQuickTaskStatusQuery } from "@/queries/quick-tasks";
import { findContractByQuickTaskIdQuery, markContractReleasedQuery } from "@/queries/contracts";
import { validateLogic } from "../core/utils/quick-task";
import { ReleaseService } from "@/modules/wallet/release/release.service";

@Injectable()
export class ApproveDeliverableService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly releaseService: ReleaseService
  ) {}

  async execute(actorId: string, id: string) {
    return this.db.transaction().execute(async (trx) => {
      const snapshot = await getQuickTaskSnapshotQuery(trx, id);
      if (!snapshot) throw new NotFoundException("Quick task not found");

      validateLogic("APPROVE_DELIVERABLE", snapshot, actorId);

      const quickTask = await updateQuickTaskStatusQuery(trx, id, "COMPLETED");

      const contract = await findContractByQuickTaskIdQuery(trx, id);
      if (contract && contract.escrowStatus === "HELD") {
        await markContractReleasedQuery(trx, contract.id);
        await this.releaseService.processRelease(
          trx,
          contract.clientId,
          contract.expertId,
          Number(contract.agreedPrice),
          `Quick Task Delivery Approved: ${quickTask?.title}`
        );
      }

      return quickTask;
    });
  }
}

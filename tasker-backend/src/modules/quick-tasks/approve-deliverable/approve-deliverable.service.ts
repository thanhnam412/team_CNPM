import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getQuickTaskSnapshotQuery,
  updateQuickTaskStatusQuery,
} from "@/queries/quick-tasks";
import { validateLogic } from "../core/utils/quick-task";

@Injectable()
export class ApproveDeliverableService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(actorId: string, id: string) {
    return this.db.transaction().execute(async (trx) => {
      const snapshot = await getQuickTaskSnapshotQuery(trx, id);
      if (!snapshot) throw new NotFoundException("Quick task not found");

      validateLogic("APPROVE_DELIVERABLE", snapshot, actorId);

      const quickTask = await updateQuickTaskStatusQuery(trx, id, "COMPLETED");
      return quickTask;
    });
  }
}

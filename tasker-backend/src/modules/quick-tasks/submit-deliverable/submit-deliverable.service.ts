import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getQuickTaskSnapshotQuery,
  updateQuickTaskStatusQuery,
} from "@/queries/quick-tasks";
import { SubmitDeliverableDto } from "../core/dto/quick-tasks.dto";
import { validateLogic } from "../core/utils/quick-task";

@Injectable()
export class SubmitDeliverableService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(actorId: string, id: string, data: SubmitDeliverableDto) {
    const snapshot = await getQuickTaskSnapshotQuery(this.db, id);
    if (!snapshot) throw new NotFoundException("Quick task not found");

    validateLogic("SUBMIT_DELIVERABLE", snapshot, actorId);

    // Save deliverable logic goes here if needed

    return updateQuickTaskStatusQuery(this.db, id, "REVIEW");
  }
}

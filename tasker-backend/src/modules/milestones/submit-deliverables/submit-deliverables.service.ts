import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getMilestoneStatusAndProjectQuery,
  updateMilestoneStatusQuery,
  getAcceptedProposalQuery,
} from "@/queries/milestones";
import { MilestoneSnapshot } from "@/modules/milestones/core/domain";
import { validateLogic } from "../core/utils/milestone";
import { SubmitDeliverablesDto } from "../core/dto/milestones.dto";

@Injectable()
export class SubmitDeliverablesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(actorId: string, id: string, data: SubmitDeliverablesDto) {
    const milestone = await getMilestoneStatusAndProjectQuery(this.db, id);
    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);

    const proposal = await getAcceptedProposalQuery(this.db, id);

    const snapshot: MilestoneSnapshot = {
      id: id,
      status: milestone.status,
      expertId: proposal?.expertId,
      clientId: null,
    };

    validateLogic("SUBMIT_DELIVERABLE", snapshot, actorId);

    return this.db.transaction().execute(async (trx) => {
      // Typically we'd save `data` (link/message) into a submission table
      return updateMilestoneStatusQuery(trx, id, "REVIEW");
    });
  }
}

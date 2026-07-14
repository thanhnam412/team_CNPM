import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getMilestoneStatusAndProjectQuery,
  updateMilestoneStatusQuery,
  getAcceptedProposalQuery,
  checkMilestoneAdminQuery,
} from "@/queries/milestones";
import { MilestoneSnapshot } from "@/modules/milestones/core/domain";
import { validateLogic } from "../core/utils/milestone";

@Injectable()
export class CancelMilestoneService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await checkMilestoneAdminQuery(this.db, userId, projectId);
    if (!admin)
      throw new ForbiddenException("Must be CLIENT_ADMIN to manage milestones");
  }

  private async mockProcessMilestoneFailed(
    milestoneId: string,
    expertId?: string | null,
  ) {
    console.log(
      `[MOCK HOOK] processMilestoneFailed called for Milestone ${milestoneId}, Expert ${expertId}`,
    );
  }

  async execute(actorId: string, id: string) {
    const milestone = await getMilestoneStatusAndProjectQuery(this.db, id);
    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);

    await this._checkAdmin(actorId, milestone.projectId);

    const proposal = await getAcceptedProposalQuery(this.db, id);

    const snapshot: MilestoneSnapshot = {
      id: id,
      status: milestone.status,
    };

    validateLogic("CANCEL", snapshot);

    return this.db.transaction().execute(async (trx) => {
      const updated = await updateMilestoneStatusQuery(trx, id, "CANCELLED");
      await this.mockProcessMilestoneFailed(id, proposal?.expertId);
      return updated;
    });
  }
}

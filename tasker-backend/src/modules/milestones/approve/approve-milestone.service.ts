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
  checkMilestoneAdminQuery,
} from "@/queries/milestones";
import { MilestoneSnapshot } from "@/modules/milestones/core/domain";
import { validateLogic } from "../core/utils/milestone";
import { findContractByMilestoneQuery, markContractReleasedQuery } from "@/queries/contracts";
import { ReleaseService } from "@/modules/wallet/release/release.service";

@Injectable()
export class ApproveMilestoneService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly releaseService: ReleaseService
  ) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await checkMilestoneAdminQuery(this.db, userId, projectId);
    if (!admin)
      throw new ForbiddenException("Must be CLIENT_ADMIN to manage milestones");
  }

  private async mockProcessPaymentSuccess(milestoneId: string) {
    console.log(
      `[MOCK HOOK] processPaymentSuccess called for Milestone ${milestoneId}`,
    );
  }

  async execute(actorId: string, id: string) {
    const milestone = await getMilestoneStatusAndProjectQuery(this.db, id);
    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);

    await this._checkAdmin(actorId, milestone.projectId);

    const snapshot: MilestoneSnapshot = {
      id: id,
      status: milestone.status,
    };

    validateLogic("APPROVE_DELIVERABLE", snapshot);

    return this.db.transaction().execute(async (trx) => {
      const updated = await updateMilestoneStatusQuery(trx, id, "PAID");
      
      const contract = await findContractByMilestoneQuery(trx, id);
      if (contract && contract.escrowStatus === "HELD") {
        await markContractReleasedQuery(trx, contract.id);
        await this.releaseService.processRelease(
          trx,
          contract.clientId,
          contract.expertId,
          Number(contract.agreedPrice),
          `Milestone Delivery Approved: ${updated?.title || id}`
        );
      }

      // Automatically move all tasks in this milestone to DONE
      await trx
        .updateTable("tasks")
        .set({ status: "DONE" as any, updatedAt: new Date().toISOString() })
        .where("milestoneId", "=", id)
        .execute();

      await this.mockProcessPaymentSuccess(id);
      return updated;
    });
  }
}

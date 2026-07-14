import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  checkMilestoneAdminQuery,
  findMilestonesByProjectQuery,
  findMilestoneProposalsQuery,
  findAvailableMilestonesQuery,
  findMilestoneByIdQuery,
  getMilestoneProposalsQuery,
  createMilestoneQuery,
  getMilestoneProjectQuery,
  updateMilestoneQuery,
  updateMilestoneStatusQuery,
  getAcceptedProposalQuery,
  getMilestoneStatusAndProjectQuery,
  deletePendingProposalsQuery,
  deleteMilestoneQuery,
  activateMilestoneQuery,
  markMilestoneAsPaidQuery,
} from "@/queries/milestones";

@Injectable()
export class MilestonesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await checkMilestoneAdminQuery(this.db, userId, projectId);
    if (!admin)
      throw new ForbiddenException("Must be CLIENT_ADMIN to manage milestones");
  }

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByProject(projectId: string) {
    const milestones = await findMilestonesByProjectQuery(this.db, projectId);

    if (milestones.length === 0) return [];

    const proposals = await findMilestoneProposalsQuery(
      this.db,
      milestones.map((m: any) => m.id),
    );

    return milestones.map((m: any) => ({
      ...m,
      proposals: proposals.filter((p: any) => p.milestoneId === m.id),
    }));
  }

  async findAvailable() {
    return findAvailableMilestonesQuery(this.db);
  }

  async findByIdOrThrow(milestoneId: string, trx?: Transaction<DB>) {
    const db = trx ?? this.db;
    const milestone = await findMilestoneByIdQuery(db, milestoneId);

    if (!milestone)
      throw new NotFoundException(`Milestone ${milestoneId} not found`);
    return milestone;
  }

  async getProposals(milestoneId: string) {
    return getMilestoneProposalsQuery(this.db, milestoneId);
  }

  // ─── WRITE (CRUD) ────────────────────────────────────────────────────────────

  async create(projectId: string, data: any) {
    return createMilestoneQuery(this.db, projectId, data);
  }

  async update(actorId: string, id: string, data: any) {
    const milestone = await getMilestoneProjectQuery(this.db, id);
    if (!milestone) throw new NotFoundException("Milestone not found");
    await this._checkAdmin(actorId, milestone.projectId);

    const patch: any = { updatedAt: new Date().toISOString() };
    if (data.title !== undefined) patch.title = data.title;
    if (data.amount !== undefined) patch.budget = data.amount.toString();
    if (data.budget !== undefined) patch.budget = data.budget.toString();

    return updateMilestoneQuery(this.db, id, patch);
  }

  async updateStatus(id: string, status: string) {
    return updateMilestoneStatusQuery(this.db, id, status);
  }

  async submitDeliverables(actorId: string, id: string, data: any) {
    const proposal = await getAcceptedProposalQuery(this.db, id);

    if (proposal?.expertId !== actorId) {
      throw new ForbiddenException(
        "Only the assigned expert can submit deliverables",
      );
    }

    return this.db.transaction().execute(async (trx) => {
      return updateMilestoneStatusQuery(trx, id, "REVIEW");
    });
  }

  async remove(actorId: string, id: string) {
    const milestone = await getMilestoneStatusAndProjectQuery(this.db, id);

    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);
    await this._checkAdmin(actorId, milestone.projectId);
    if (["ACTIVE", "REVIEW", "PAID"].includes(milestone.status)) {
      throw new BadRequestException(
        `Cannot delete a milestone with status ${milestone.status}`,
      );
    }

    await this.db.transaction().execute(async (trx) => {
      await deletePendingProposalsQuery(trx, id);
      await deleteMilestoneQuery(trx, id);
    });
    return { success: true };
  }

  // ─── DOMAIN ACTIONS (gọi từ UseCase, nhận trx) ──────────────────────────────

  async activate(
    milestoneId: string,
    expertId: string,
    price: number,
    trx: Transaction<DB>,
  ): Promise<void> {
    await activateMilestoneQuery(trx, milestoneId, expertId, price);
  }

  async markAsPaid(
    milestoneId: string,
    amount: number,
    trx: Transaction<DB>,
  ): Promise<void> {
    await markMilestoneAsPaidQuery(trx, milestoneId, amount);
  }
}

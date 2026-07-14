import {
  Inject,
  Injectable,
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
  getMilestoneStatusAndProjectQuery,
  deletePendingProposalsQuery,
  deleteMilestoneQuery,
  activateMilestoneQuery,
  markMilestoneAsPaidQuery,
} from "@/queries/milestones";
import { CreateMilestoneDto, UpdateMilestoneDto } from "./core/dto/milestones.dto";
import { MilestoneSnapshot } from "@/modules/milestones/core/domain";
import { validateLogic } from "./core/utils/milestone";
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
      milestones.map((m) => m.id),
    );

    return milestones.map((m) => ({
      ...m,
      proposals: proposals.filter((p) => p.milestoneId === m.id),
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

  async create(projectId: string, data: CreateMilestoneDto) {
    return createMilestoneQuery(this.db, projectId, data);
  }

  async update(actorId: string, id: string, data: UpdateMilestoneDto) {
    const milestone = await getMilestoneProjectQuery(this.db, id);
    if (!milestone) throw new NotFoundException("Milestone not found");
    await this._checkAdmin(actorId, milestone.projectId);

    const patch: Record<string, any> = { updatedAt: new Date().toISOString() };
    if (data.title !== undefined) patch.title = data.title;
    if (data.amount !== undefined) patch.budget = data.amount.toString();
    if (data.budget !== undefined) patch.budget = data.budget.toString();

    return updateMilestoneQuery(this.db, id, patch);
  }

  async updateStatus(id: string, status: string) {
    return updateMilestoneStatusQuery(this.db, id, status);
  }

  async remove(actorId: string, id: string) {
    const milestone = await getMilestoneStatusAndProjectQuery(this.db, id);

    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);
    await this._checkAdmin(actorId, milestone.projectId);

    const snapshot: MilestoneSnapshot = {
      id: id,
      status: milestone.status,
    };

    // Tái sử dụng CANCEL logic để check (hoặc tạo DELETE riêng. Ở đây ta coi remove/delete tương đồng với cancel nếu chưa ACTIVE)
    validateLogic("CANCEL", snapshot);

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

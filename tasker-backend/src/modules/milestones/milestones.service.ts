import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Kysely, Transaction, sql } from 'kysely';
import { KYSELY_DB } from '../../database/database.module';
import { DB } from '../../database/types';

/**
 * MilestonesService — DOMAIN OWNER của: milestones
 *
 * Các method dạng "domain action" (activate, markAsPaid, ...) nhận trx từ UseCase
 * để đảm bảo toàn bộ flow nằm trong 1 transaction duy nhất.
 */
@Injectable()
export class MilestonesService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await this.db
      .selectFrom("project_members")
      .select("id")
      .where("projectId", "=", projectId)
      .where("userId", "=", userId)
      .where("role", "=", "CLIENT_ADMIN")
      .executeTakeFirst();
    if (!admin) throw new ForbiddenException("Must be CLIENT_ADMIN to manage milestones");
  }

  // ─── READ ───────────────────────────────────────────────────────────────────

  async findByProject(projectId: string) {
    const milestones = await this.db
      .selectFrom('milestones')
      .selectAll()
      .where('projectId', '=', projectId)
      .execute();

    if (milestones.length === 0) return [];

    const proposals = await this.db
      .selectFrom('proposals as p')
      .innerJoin('users as u', 'u.id', 'p.expertId')
      .select([
        'p.id',
        'p.milestoneId',
        'p.proposedPrice as amount',
        'p.coverLetter',
        'p.status',
        'u.name as expertName',
        'u.avatar',
      ])
      .where('p.milestoneId', 'in', milestones.map((m) => m.id))
      .execute();

    return milestones.map((m) => ({
      ...m,
      proposals: proposals.filter((p) => p.milestoneId === m.id),
    }));
  }

  async findAvailable() {
    return this.db
      .selectFrom('milestones as m')
      .innerJoin('projects as p', 'p.id', 'm.projectId')
      .select([
        'm.id',
        'm.title',
        'm.budget',
        'm.status',
        'm.projectId',
        'p.title as projectTitle',
      ])
      .where('m.status', '=', 'PENDING')
      .execute();
  }

  async findByIdOrThrow(milestoneId: string, trx?: Transaction<DB>) {
    const db = trx ?? this.db;
    const milestone = await db
      .selectFrom('milestones')
      .selectAll()
      .where('id', '=', milestoneId)
      .executeTakeFirst();

    if (!milestone) throw new NotFoundException(`Milestone ${milestoneId} not found`);
    return milestone;
  }

  async getProposals(milestoneId: string) {
    return this.db
      .selectFrom('proposals as p')
      .innerJoin('users as u', 'u.id', 'p.expertId')
      .select([
        'p.id',
        'p.proposedPrice as amount',
        'p.coverLetter as message',
        'p.status',
        'u.name as expertName',
        'u.avatar',
        'p.expertId',
      ])
      .where('p.milestoneId', '=', milestoneId)
      .execute();
  }

  // ─── WRITE (CRUD) ────────────────────────────────────────────────────────────

  async create(projectId: string, data: CreateMilestoneData) {
    return this.db
      .insertInto('milestones')
      .values({
        id: crypto.randomUUID(),
        projectId,
        title: data.title,
        budget: (data.amount ?? data.budget ?? 0).toString(),
        status: 'PENDING',
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async update(actorId: string, id: string, data: any) {
    const milestone = await this.db.selectFrom("milestones").select("projectId").where("id", "=", id).executeTakeFirst();
    if (!milestone) throw new NotFoundException("Milestone not found");
    await this._checkAdmin(actorId, milestone.projectId);

    const patch: any = { updatedAt: new Date() };
    if (data.title !== undefined) patch.title = data.title;
    if (data.amount !== undefined) patch.budget = data.amount.toString();
    if (data.budget !== undefined) patch.budget = data.budget.toString();

    return this.db
      .updateTable('milestones')
      .set(patch as any)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async updateStatus(id: string, status: string) {
    return this.db
      .updateTable('milestones')
      .set({ status: status as any, updatedAt: new Date() })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async submitDeliverables(actorId: string, id: string, data: any) {
    const proposal = await this.db
      .selectFrom("proposals")
      .select("expertId")
      .where("milestoneId", "=", id)
      .where("status", "=", "ACCEPTED")
      .executeTakeFirst();
      
    if (proposal?.expertId !== actorId) {
      throw new ForbiddenException("Only the assigned expert can submit deliverables");
    }

    return this.db.transaction().execute(async (trx) => {
      return trx
        .updateTable('milestones')
        .set({ status: 'REVIEW' as any, updatedAt: new Date() })
        .where('id', '=', id)
        .returningAll()
        .executeTakeFirst();
    });
  }

  async remove(actorId: string, id: string) {
    const milestone = await this.db
      .selectFrom('milestones')
      .select(['status', 'projectId'])
      .where('id', '=', id)
      .executeTakeFirst();

    if (!milestone) throw new NotFoundException(`Milestone ${id} not found`);
    await this._checkAdmin(actorId, milestone.projectId);
    if (['ACTIVE', 'REVIEW', 'PAID'].includes(milestone.status as string)) {
      throw new BadRequestException(`Cannot delete a milestone with status ${milestone.status}`);
    }

    await this.db.transaction().execute(async (trx) => {
      await trx.deleteFrom('proposals').where('milestoneId', '=', id).where('status', '=', 'PENDING').execute();
      await trx.deleteFrom('milestones').where('id', '=', id).execute();
    });
    return { success: true };
  }

  // ─── DOMAIN ACTIONS (gọi từ UseCase, nhận trx) ──────────────────────────────

  /**
   * Kích hoạt Milestone khi Proposal được Accept.
   * Cập nhật: milestones.status = ACTIVE, assigneeId
   * Cập nhật: projects.escrow += price
   * Thêm Expert vào project_members nếu chưa có.
   */
  async activate(
    milestoneId: string,
    expertId: string,
    price: number,
    trx: Transaction<DB>,
  ): Promise<void> {
    const milestone = await trx
      .selectFrom('milestones')
      .selectAll()
      .where('id', '=', milestoneId)
      .executeTakeFirstOrThrow();

    await trx
      .updateTable('milestones')
      .set({ assigneeId: expertId, status: 'ACTIVE' as any, updatedAt: new Date() })
      .where('id', '=', milestoneId)
      .execute();

    const project = await trx
      .selectFrom('projects')
      .select('escrow')
      .where('id', '=', milestone.projectId)
      .executeTakeFirstOrThrow();

    const newEscrow = (Number(project.escrow) + price).toString();

    await trx
      .updateTable('projects')
      .set({
        escrow: newEscrow,
        updatedAt: new Date(),
      })
      .where('id', '=', milestone.projectId)
      .execute();

    // Thêm expert vào project_members nếu chưa có
    const existing = await trx
      .selectFrom('project_members')
      .select(['id'])
      .where('projectId', '=', milestone.projectId)
      .where('userId', '=', expertId)
      .executeTakeFirst();

    if (!existing) {
      await trx
        .insertInto('project_members')
        .values({
          id: crypto.randomUUID(),
          projectId: milestone.projectId,
          userId: expertId,
          role: 'EXPERT',
          status: 'ACTIVE',
          updatedAt: new Date(),
        })
        .execute();
    }
  }

  /**
   * Đánh dấu Milestone là PAID và điều chỉnh lại escrow/spent của Project.
   * Gọi từ ReleasePaymentUseCase.
   */
  async markAsPaid(
    milestoneId: string,
    amount: number,
    trx: Transaction<DB>,
  ): Promise<void> {
    const milestone = await trx
      .selectFrom('milestones')
      .selectAll()
      .where('id', '=', milestoneId)
      .executeTakeFirstOrThrow();

    await trx
      .updateTable('milestones')
      .set({ status: 'PAID' as any, updatedAt: new Date() })
      .where('id', '=', milestoneId)
      .execute();

    const project = await trx
      .selectFrom('projects')
      .select(['id', 'escrow', 'spent'])
      .where('id', '=', milestone.projectId)
      .executeTakeFirst();

    if (project) {
      const newEscrow = Math.max(0, Number(project.escrow) - amount);
      const newSpent = Number(project.spent) + amount;

      await trx
        .updateTable('projects')
        .set({
          escrow: newEscrow.toString(),
          spent: newSpent.toString(),
          updatedAt: new Date(),
        })
        .where('id', '=', project.id)
        .execute();
    }
  }
}

// ─── LOCAL TYPES ─────────────────────────────────────────────────────────────

export interface CreateMilestoneData {
  title: string;
  amount?: number;
  budget?: number;
}

export interface UpdateMilestoneData {
  title?: string;
  amount?: number;
  budget?: number;
}

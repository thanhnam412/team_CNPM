/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class QuickTasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll() {
    return this.db.selectFrom("quick_tasks").selectAll().execute();
  }

  async findOne(id: string) {
    return this.db
      .selectFrom("quick_tasks")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();
  }

  async create(clientId: string, data: any) {
    if (data.expertId && data.expertId === clientId) {
      throw new Error("You cannot assign a task to yourself.");
    }

    return this.db
      .insertInto("quick_tasks")
      .values({
        id: crypto.randomUUID(),
        clientId,
        expertId: data.expertId || null,
        title: data.title,
        description: data.description,
        status: data.status || "OPEN",
        budget: data.budget?.toString() || "0",
        deadline: data.deadline ? new Date(data.deadline) : null,
        proposalsCount: 0,
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async findByClient(clientId: string) {
    return this.db
      .selectFrom("quick_tasks")
      .selectAll()
      .where("clientId", "=", clientId)
      .orderBy("createdAt", "desc")
      .execute();
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.budget !== undefined) updateData.budget = data.budget.toString();
    if (data.deadline !== undefined)
      updateData.deadline = new Date(data.deadline);

    return this.db
      .updateTable("quick_tasks")
      .set(updateData)
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async updateStatus(id: string, status: string) {
    return this.db
      .updateTable("quick_tasks")
      .set({ status: status as any, updatedAt: new Date() })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async submitDeliverable(actorId: string, id: string, data: any) {
    const qt = await this.db.selectFrom("quick_tasks").select(["status", "expertId"]).where("id", "=", id).executeTakeFirst();
    if (!qt) throw new NotFoundException("Quick task not found");
    if (qt.expertId !== actorId) {
      throw new ForbiddenException("Only the assigned expert can submit deliverables");
    }
    if (qt.status !== "IN_PROGRESS") {
      throw new BadRequestException(`Cannot submit deliverable for task in status ${qt.status}. Must be IN_PROGRESS.`);
    }

    // Expert nộp sản phẩm → chuyển sang REVIEW
    return this.db
      .updateTable("quick_tasks")
      .set({
        status: "REVIEW" as any,
        updatedAt: new Date(),
      })
      .where("id", "=", id)
      .returningAll()
      .executeTakeFirst();
  }

  async approveDeliverable(actorId: string, id: string) {
    // Client duyệt deliverable → COMPLETED
    return this.db.transaction().execute(async (trx) => {
      const current = await trx.selectFrom("quick_tasks").select(["status", "clientId"]).where("id", "=", id).executeTakeFirst();
      if (!current) throw new NotFoundException("Quick task not found");
      if (current.clientId !== actorId) {
        throw new ForbiddenException("Only the client can approve deliverables");
      }
      if (current.status !== "REVIEW") {
        throw new BadRequestException(`Cannot approve task in status ${current.status}. Must be REVIEW.`);
      }

      const quickTask = await trx
        .updateTable("quick_tasks")
        .set({ status: "COMPLETED" as any, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      // Note: Payment release logic will be handled in Phase 5 via contracts
      
      return quickTask;
    });
  }

  async remove(id: string) {
    const task = await this.db
      .selectFrom("quick_tasks")
      .select(["status"])
      .where("id", "=", id)
      .executeTakeFirst();

    if (!task) throw new NotFoundException("Quick task not found");

    if (task.status !== "OPEN") {
      throw new BadRequestException(`Cannot delete a quick task that is ${task.status}. Only OPEN tasks can be deleted.`);
    }

    const contract = await this.db
      .selectFrom("contracts")
      .select(["id"])
      .where("quickTaskId", "=", id)
      .limit(1)
      .execute();

    if (contract.length > 0) {
      throw new BadRequestException("Cannot delete a quick task that has an associated contract.");
    }

    await this.db.deleteFrom("quick_tasks").where("id", "=", id).execute();

    return { success: true };
  }

  // ─── DOMAIN ACTIONS (gọi từ UseCase, nhận trx) ──────────────────────────────

  /**
   * Gán Expert cho QuickTask khi Proposal được Accept.
   * Đổi status = IN_PROGRESS và set expertId.
   */
  async assignExpert(
    quickTaskId: string,
    expertId: string,
    trx: Transaction<DB>,
  ): Promise<void> {
    await trx
      .updateTable("quick_tasks")
      .set({
        expertId,
        status: "IN_PROGRESS" as any,
        updatedAt: new Date(),
      })
      .where("id", "=", quickTaskId)
      .execute();
  }
}

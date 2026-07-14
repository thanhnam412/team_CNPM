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
  findAllQuickTasksQuery,
  findQuickTaskByIdQuery,
  createQuickTaskQuery,
  findQuickTasksByClientQuery,
  updateQuickTaskQuery,
  updateQuickTaskStatusQuery,
  getQuickTaskStatusAndExpertQuery,
  getQuickTaskStatusAndClientQuery,
  getQuickTaskStatusQuery,
  checkQuickTaskContractQuery,
  deleteQuickTaskQuery,
  assignExpertToQuickTaskQuery,
} from "@/queries/quick-tasks";

@Injectable()
export class QuickTasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll() {
    return findAllQuickTasksQuery(this.db);
  }

  async findOne(id: string) {
    return findQuickTaskByIdQuery(this.db, id);
  }

  async create(clientId: string, data: any) {
    if (data.expertId && data.expertId === clientId) {
      throw new Error("You cannot assign a task to yourself.");
    }
    return createQuickTaskQuery(this.db, clientId, data);
  }

  async findByClient(clientId: string) {
    return findQuickTasksByClientQuery(this.db, clientId);
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.budget !== undefined) updateData.budget = data.budget.toString();
    if (data.deadline !== undefined)
      updateData.deadline = new Date(data.deadline).toISOString();

    return updateQuickTaskQuery(this.db, id, updateData);
  }

  async updateStatus(id: string, status: string) {
    return updateQuickTaskStatusQuery(this.db, id, status);
  }

  async submitDeliverable(actorId: string, id: string, data: any) {
    const qt = await getQuickTaskStatusAndExpertQuery(this.db, id);
    if (!qt) throw new NotFoundException("Quick task not found");
    if (qt.expertId !== actorId) {
      throw new ForbiddenException(
        "Only the assigned expert can submit deliverables",
      );
    }
    if (qt.status !== "IN_PROGRESS") {
      throw new BadRequestException(
        `Cannot submit deliverable for task in status ${qt.status}. Must be IN_PROGRESS.`,
      );
    }

    return updateQuickTaskStatusQuery(this.db, id, "REVIEW");
  }

  async approveDeliverable(actorId: string, id: string) {
    return this.db.transaction().execute(async (trx) => {
      const current = await getQuickTaskStatusAndClientQuery(trx, id);
      if (!current) throw new NotFoundException("Quick task not found");
      if (current.clientId !== actorId) {
        throw new ForbiddenException(
          "Only the client can approve deliverables",
        );
      }
      if (current.status !== "REVIEW") {
        throw new BadRequestException(
          `Cannot approve task in status ${current.status}. Must be REVIEW.`,
        );
      }

      const quickTask = await updateQuickTaskStatusQuery(trx, id, "COMPLETED");

      // Note: Payment release logic will be handled in Phase 5 via contracts

      return quickTask;
    });
  }

  async remove(id: string) {
    const task = await getQuickTaskStatusQuery(this.db, id);

    if (!task) throw new NotFoundException("Quick task not found");

    if (task.status !== "OPEN") {
      throw new BadRequestException(
        `Cannot delete a quick task that is ${task.status}. Only OPEN tasks can be deleted.`,
      );
    }

    const contract = await checkQuickTaskContractQuery(this.db, id);

    if (contract.length > 0) {
      throw new BadRequestException(
        "Cannot delete a quick task that has an associated contract.",
      );
    }

    await deleteQuickTaskQuery(this.db, id);

    return { success: true };
  }

  async assignExpert(
    quickTaskId: string,
    expertId: string,
    trx: Transaction<DB>,
  ): Promise<void> {
    await assignExpertToQuickTaskQuery(trx, quickTaskId, expertId);
  }
}

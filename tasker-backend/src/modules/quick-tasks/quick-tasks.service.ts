import { Inject, Injectable } from "@nestjs/common";
import { Kysely, Transaction } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  findAllQuickTasksQuery,
  findQuickTaskByIdQuery,
  findQuickTasksByClientQuery,
  updateQuickTaskQuery,
  updateQuickTaskStatusQuery,
  assignExpertToQuickTaskQuery,
} from "@/queries/quick-tasks";
import { UpdateQuickTaskDto } from "./core/dto/quick-tasks.dto";

@Injectable()
export class QuickTasksService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll() {
    return findAllQuickTasksQuery(this.db);
  }

  async findOne(id: string) {
    return findQuickTaskByIdQuery(this.db, id);
  }

  async findByClient(clientId: string) {
    return findQuickTasksByClientQuery(this.db, clientId);
  }

  async update(id: string, data: UpdateQuickTaskDto) {
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
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

  async assignExpert(
    quickTaskId: string,
    expertId: string,
    trx: Transaction<DB>,
  ): Promise<void> {
    await assignExpertToQuickTaskQuery(trx, quickTaskId, expertId);
  }
}

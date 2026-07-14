import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { insertQuickTaskCopilotQuery } from "@/queries/copilot";

@Injectable()
export class CreateQuickTaskCopilotService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(userId: string, data: any, message: string) {
    const taskId = crypto.randomUUID();

    await insertQuickTaskCopilotQuery(this.db, {
      id: taskId,
      clientId: userId,
      title: data.title || "Untitled Task",
      description: data.description || "",
      budget: data.budget?.toString() || "0",
      status: "OPEN",
      proposalsCount: 0,
      updatedAt: new Date(),
    });

    return {
      intent: "CREATE_QUICK_TASK",
      task: {
        id: taskId,
        title: data.title,
        budget: data.budget,
      },
      message: message,
    };
  }
}

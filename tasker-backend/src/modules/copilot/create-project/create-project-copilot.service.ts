import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  insertProjectCopilotQuery,
  insertProjectMemberCopilotQuery,
  insertMilestoneCopilotQuery,
  insertTaskCopilotQuery,
  getProjectCopilotQuery,
} from "@/queries/copilot";

@Injectable()
export class CreateProjectCopilotService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(userId: string, data: any, message: string) {
    // 1. Create project
    const projectId = crypto.randomUUID();
    await insertProjectCopilotQuery(this.db, {
      id: projectId,
      title: data.title || "Untitled Project",
      description: data.description || "",
      budget: data.budget?.toString() || "0",
      status: "OPEN",
      spent: "0",
      escrow: "0",
      updatedAt: new Date(),
    });

    // 2. Create project member (Client Admin)
    await insertProjectMemberCopilotQuery(this.db, {
      id: crypto.randomUUID(),
      projectId,
      userId,
      role: "CLIENT_ADMIN",
      status: "ACTIVE",
      updatedAt: new Date(),
    });

    // 3. Create milestones & tasks
    const milestones = data.milestones || [];
    for (const milestoneData of milestones) {
      const milestoneId = crypto.randomUUID();
      await insertMilestoneCopilotQuery(this.db, {
        id: milestoneId,
        projectId,
        title: milestoneData.title || "Milestone",
        budget: milestoneData.budget?.toString() || "0",
        status: "PENDING",
        updatedAt: new Date(),
      });

      const tasks = milestoneData.tasks || [];
      for (const taskTitle of tasks) {
        await insertTaskCopilotQuery(this.db, {
          id: crypto.randomUUID(),
          projectId,
          milestoneId,
          title: taskTitle,
          status: "TODO",
          priority: "MEDIUM",
          updatedAt: new Date(),
        });
      }
    }

    // Fetch the fully created project to return
    const project = await getProjectCopilotQuery(this.db, projectId);

    return {
      intent: "CREATE_PROJECT",
      project,
      message,
    };
  }
}

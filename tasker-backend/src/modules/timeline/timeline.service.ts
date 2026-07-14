/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";

import { getExpertTasksQuery, getExpertQuickTasksQuery } from "@/queries/timeline";

@Injectable()
export class TimelineService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getTimeline(expertId: string, startDate?: string, endDate?: string) {
    // Get all tasks assigned to this expert
    const tasks = await getExpertTasksQuery(this.db, expertId);

    // Get all quick tasks assigned to this expert (standalone, not linked to internal task)
    const quickTasks = await getExpertQuickTasksQuery(this.db, expertId);

    // Group tasks by project for Gantt-style rows
    const projectMap = new Map<string, any>();

    for (const task of tasks) {
      if (!task.projectId) continue;

      if (!projectMap.has(task.projectId)) {
        projectMap.set(task.projectId, {
          id: task.projectId,
          title: task.projectTitle,
          type: "project",
          events: [],
        });
      }

      const statusMap: Record<string, string> = {
        TODO: "pending",
        IN_PROGRESS: "in_progress",
        REVIEW: "in_progress",
        DONE: "completed",
      };

      projectMap.get(task.projectId).events.push({
        id: task.id,
        title: task.title,
        status: statusMap[task.status as string] || task.status,
        priority: task.priority,
        milestoneName: task.milestoneName,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        dueDate: null,
      });
    }

    // Add standalone quick tasks as individual rows
    const quickTaskRows = quickTasks.map((qt) => {
      const statusMap: Record<string, string> = {
        OPEN: "pending",
        IN_PROGRESS: "in_progress",
        REVIEW: "in_progress",
        COMPLETED: "completed",
        CANCELLED: "cancelled",
      };

      return {
        id: qt.id,
        title: qt.title,
        client: qt.clientName,
        type: "task",
        events: [
          {
            id: qt.id,
            title: qt.title,
            status: statusMap[qt.status] || qt.status,
            budget: qt.budget,
            deadline: qt.deadline,
            createdAt: qt.createdAt,
            updatedAt: qt.updatedAt,
          },
        ],
      };
    });

    // Calculate workload stats
    const activeTasks = tasks.filter(
      (t) => t.status === "IN_PROGRESS" || t.status === "REVIEW",
    ).length;
    const activeQuickTasks = quickTasks.filter(
      (qt) => qt.status === "IN_PROGRESS" || qt.status === "REVIEW",
    ).length;

    return {
      rows: [...Array.from(projectMap.values()), ...quickTaskRows],
      stats: {
        totalActiveTasks: activeTasks + activeQuickTasks,
        totalProjects: projectMap.size,
        totalQuickTasks: quickTasks.length,
        completedTasks: tasks.filter((t) => t.status === "DONE").length,
      },
    };
  }
}

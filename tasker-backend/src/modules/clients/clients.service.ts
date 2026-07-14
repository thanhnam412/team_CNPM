import { Injectable, Inject } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getClientWalletQuery,
  getClientSpentMtdQuery,
  getClientActiveProjectsQuery,
  getProjectTasksQuery,
  getClientPendingQuickTasksQuery,
  getUserNameQuery,
  getClientPendingMilestonesQuery,
  getClientUnreadMessagesQuery,
} from "@/queries/clients";

@Injectable()
export class ClientsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getOverview(userId: string) {
    // 1. FINANCE
    const wallet = await getClientWalletQuery(this.db, userId);

    // SPENT MTD
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const spentResult = await getClientSpentMtdQuery(
      this.db,
      userId,
      firstDayOfMonth,
    );

    const finance = {
      availableBalance: wallet?.balance || "0",
      inEscrow: wallet?.escrowBalance || "0",
      spentMTD: spentResult?.totalSpent || "0",
    };

    // 2. ACTIVE PROJECTS
    const activeProjectsRaw = await getClientActiveProjectsQuery(
      this.db,
      userId,
    );

    const activeProjects = await Promise.all(
      activeProjectsRaw.map(async (p) => {
        const tasks = await getProjectTasksQuery(this.db, p.id);

        const completedTasks = tasks.filter((t) => t.status === "DONE").length;
        const totalTasks = tasks.length;
        const progress =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);

        return {
          id: p.id,
          name: p.name,
          deadlineInfo: p.endDate
            ? `Due ${new Date(p.endDate).toLocaleDateString()}`
            : "No deadline",
          status: p.status,
          progress,
          escrow: p.escrow || "0",
        };
      }),
    );

    // 3. PENDING ACTIONS
    const quickTasks = await getClientPendingQuickTasksQuery(this.db, userId);

    const qtActions = await Promise.all(
      quickTasks.map(async (qt) => {
        let expertName = "Unknown";
        if (qt.expertId) {
          const user = await getUserNameQuery(this.db, qt.expertId);
          expertName = user?.name || "Unknown";
        }
        return {
          id: qt.id,
          task: qt.task,
          expert: expertName,
          type: "Quick Task",
        };
      }),
    );

    const milestones = await getClientPendingMilestonesQuery(this.db, userId);

    const msActions = await Promise.all(
      milestones.map(async (ms) => {
        let expertName = "Unknown";
        if (ms.assigneeId) {
          const user = await getUserNameQuery(this.db, ms.assigneeId);
          expertName = user?.name || "Unknown";
        }
        return {
          id: ms.id,
          projectId: ms.projectId,
          task: `${ms.task} (${ms.projectName})`,
          expert: expertName,
          type: "Milestone",
        };
      }),
    );

    const pendingActions = [...qtActions, ...msActions];

    // 4. UNREAD MESSAGES (Mocking recent messages for now)
    const messagesRaw = await getClientUnreadMessagesQuery(this.db, userId);

    const unreadMessages = messagesRaw.map((m) => ({
      id: m.id,
      name: m.name,
      time: new Date(m.time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      msg: m.msg,
      unread: 1,
      context: "Direct Message",
    }));

    return {
      finance,
      activeProjects,
      pendingActions,
      unreadMessages,
    };
  }
}

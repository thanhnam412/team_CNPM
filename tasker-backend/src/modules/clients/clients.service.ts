import { Injectable, Inject } from "@nestjs/common";
import { Kysely, sql } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class ClientsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getOverview(userId: string) {
    // 1. FINANCE
    const wallet = await this.db
      .selectFrom("wallets")
      .where("userId", "=", userId)
      .select(["balance", "escrowBalance"])
      .executeTakeFirst();

    // SPENT MTD
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const spentResult = await this.db
      .selectFrom("transactions")
      .where("userId", "=", userId)
      .where("type", "=", "SPENT")
      .where("date", ">=", firstDayOfMonth)
      .select(({ fn }) => [
        fn.sum<string>("amount").as("totalSpent")
      ])
      .executeTakeFirst();

    const finance = {
      availableBalance: wallet?.balance || "0",
      inEscrow: wallet?.escrowBalance || "0",
      spentMTD: spentResult?.totalSpent || "0",
    };

    // 2. ACTIVE PROJECTS
    const activeProjectsRaw = await this.db
      .selectFrom("projects")
      .innerJoin("project_members", "projects.id", "project_members.projectId")
      .where("project_members.userId", "=", userId)
      .where("project_members.role", "=", "CLIENT_ADMIN")
      .where("projects.status", "not in", ["COMPLETED", "CANCELLED"])
      .select([
        "projects.id",
        "projects.title as name",
        "projects.endDate",
        "projects.status",
        "projects.escrow",
      ])
      .orderBy("projects.createdAt", "desc")
      .limit(5)
      .execute();

    const activeProjects = await Promise.all(
      activeProjectsRaw.map(async p => {
        const tasks = await this.db
          .selectFrom("tasks")
          .select(["status"])
          .where("projectId", "=", p.id)
          .execute();

        const completedTasks = tasks.filter(t => t.status === "DONE").length;
        const totalTasks = tasks.length;
        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        return {
          id: p.id,
          name: p.name,
          deadlineInfo: p.endDate ? `Due ${p.endDate.toLocaleDateString()}` : "No deadline",
          status: p.status,
          progress,
          escrow: p.escrow || "0",
        };
      })
    );

    // 3. PENDING ACTIONS
    const quickTasks = await this.db
      .selectFrom("quick_tasks")
      .where("clientId", "=", userId)
      .where("status", "in", ["REVIEW", "IN_PROGRESS"])
      .select(["id", "title as task", "expertId"])
      .execute();

    const qtActions = await Promise.all(
      quickTasks.map(async qt => {
        let expertName = "Unknown";
        if (qt.expertId) {
          const user = await this.db
            .selectFrom("users")
            .where("id", "=", qt.expertId)
            .select("name")
            .executeTakeFirst();
          expertName = user?.name || "Unknown";
        }
        return {
          id: qt.id,
          task: qt.task,
          expert: expertName,
          type: "Quick Task",
        };
      })
    );

    const milestones = await this.db
      .selectFrom("milestones")
      .innerJoin("projects", "milestones.projectId", "projects.id")
      .innerJoin("project_members", "projects.id", "project_members.projectId")
      .where("project_members.userId", "=", userId)
      .where("project_members.role", "=", "CLIENT_ADMIN")
      .where("milestones.status", "=", "REVIEW")
      .select([
        "milestones.id",
        "milestones.title as task",
        "projects.title as projectName",
        "milestones.assigneeId",
        "projects.id as projectId"
      ])
      .execute();

    const msActions = await Promise.all(
      milestones.map(async ms => {
        let expertName = "Unknown";
        if (ms.assigneeId) {
          const user = await this.db
            .selectFrom("users")
            .where("id", "=", ms.assigneeId)
            .select("name")
            .executeTakeFirst();
          expertName = user?.name || "Unknown";
        }
        return {
          id: ms.id,
          projectId: ms.projectId,
          task: `${ms.task} (${ms.projectName})`,
          expert: expertName,
          type: "Milestone",
        };
      })
    );

    const pendingActions = [...qtActions, ...msActions];

    // 4. UNREAD MESSAGES (Mocking recent messages for now)
    const messagesRaw = await this.db
      .selectFrom("messages")
      .innerJoin("conversation_participants", "messages.conversationId", "conversation_participants.conversationId")
      .innerJoin("users", "messages.senderId", "users.id")
      .where("conversation_participants.userId", "=", userId)
      .where("messages.senderId", "!=", userId)
      .select([
        "messages.id",
        "messages.content as msg",
        "messages.createdAt as time",
        "users.name",
        "messages.conversationId"
      ])
      .orderBy("messages.createdAt", "desc")
      .limit(3)
      .execute();

    const unreadMessages = messagesRaw.map(m => ({
      id: m.id,
      name: m.name,
      time: m.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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

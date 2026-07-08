/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely, sql } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

interface ExpertSearchFilters {
  search?: string;
  skill?: string;
  minRating?: number;
  badge?: string;
  online?: boolean;
  excludeUserId?: string;
}

@Injectable()
export class ExpertsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll(filters: ExpertSearchFilters) {
    let query = this.db
      .selectFrom("expert_profiles")
      .innerJoin("users", "users.id", "expert_profiles.userId")
      .select([
        "users.id",
        "users.name",
        "users.avatar",
        "users.online",
        "expert_profiles.title",
        "expert_profiles.bio",
        "expert_profiles.skills",
        "expert_profiles.hourlyRate as rate",
        "expert_profiles.rating as profileRating",
      ]);

    // Filter by name/title search
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.where((eb) =>
        eb.or([
          eb("users.name", "ilike", term),
          eb("expert_profiles.title", "ilike", term),
        ]),
      );
    }

    // Filter by online status
    if (filters.online !== undefined) {
      query = query.where("users.online", "=", filters.online);
    }

    // Exclude current user from search results
    if (filters.excludeUserId) {
      query = query.where("users.id", "!=", filters.excludeUserId);
    }

    const experts = await query.execute();

    const expertIds = experts.map((e) => e.id);

    // Get completed tasks count
    let taskCounts: any[] = [];
    if (expertIds.length > 0) {
      taskCounts = await this.db
        .selectFrom("tasks")
        .select(["assigneeId", sql<number>`count(*)`.as("completedTasks")])
        .where("assigneeId", "in", expertIds)
        .where("status", "=", "DONE")
        .groupBy("assigneeId")
        .execute();
    }

    // Merge data
    const result = experts.map((expert) => {
      const tasks = taskCounts.find((t: any) => t.assigneeId === expert.id);

      const profileRating = parseFloat(expert.profileRating) || 0;

      return {
        ...expert,
        rating: profileRating,
        reviews: 0,
        completedTasks: tasks ? Number(tasks.completedTasks) : 0,
      };
    });

    // Filter by minRating (post-query since it's aggregated)
    if (filters.minRating) {
      return result.filter((e) => e.rating >= filters.minRating!);
    }

    // Filter by skill (post-query since skills is JSON)
    if (filters.skill) {
      const skillLower = filters.skill.toLowerCase();
      return result.filter((e) => {
        if (!e.skills) return false;
        const skills =
          typeof e.skills === "string" ? JSON.parse(e.skills) : e.skills;
        if (Array.isArray(skills)) {
          return skills.some((s: string) =>
            s.toLowerCase().includes(skillLower),
          );
        }
        // Handle { core: [...], secondary: [...] } format
        const allSkills = [...(skills.core || []), ...(skills.secondary || [])];
        return allSkills.some((s: string) =>
          s.toLowerCase().includes(skillLower),
        );
      });
    }

    return result;
  }

  async findOne(id: string) {
    const expert = await this.db
      .selectFrom("expert_profiles")
      .innerJoin("users", "users.id", "expert_profiles.userId")
      .select([
        "expert_profiles.id as cvId",
        "users.id",
        "users.name",
        "users.avatar",
        "users.online",
        "users.location",
        "expert_profiles.title",
        "expert_profiles.bio",
        "expert_profiles.skills",
        "expert_profiles.hourlyRate as rate",
        "expert_profiles.portfolioUrl as showcase",
        "expert_profiles.experienceYears",
        "expert_profiles.rating",
      ])
      .where("expert_profiles.userId", "=", id)
      .executeTakeFirst();

    if (!expert) return null;

    const completedTasks = await this.db
      .selectFrom("tasks")
      .select(sql<number>`count(*)`.as("count"))
      .where("assigneeId", "=", id)
      .where("status", "=", "DONE")
      .executeTakeFirst();

    // Work history (completed quick tasks)
    const quickTasksHistory = await this.db
      .selectFrom("quick_tasks")
      .select(["id", "title", "budget", "status", "createdAt"])
      .where("expertId", "=", id)
      .where("status", "=", "COMPLETED")
      .execute();

    // Work history (completed project tasks)
    const projectTasksHistoryRaw = await this.db
      .selectFrom("tasks")
      .select(["id", "title", "status", "createdAt"])
      .where("assigneeId", "=", id)
      .where("status", "=", "DONE")
      .execute();

    const projectTasksHistory = projectTasksHistoryRaw.map((t) => ({
      ...t,
      status: "COMPLETED" as any,
    }));

    const workHistory = [...quickTasksHistory, ...projectTasksHistory]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 10);

    return {
      ...expert,
      rating: parseFloat(expert.rating as any) || 0,
      reviewCount: 0,
      completedTasks: completedTasks ? Number(completedTasks.count) : 0,
      reviews: [],
      workHistory,
    };
  }

  async getOverview(expertId: string) {
    const expert = await this.db
      .selectFrom("users")
      .leftJoin("wallets", "wallets.userId", "users.id")
      .select(["wallets.balance"])
      .where("users.id", "=", expertId)
      .executeTakeFirst();

    if (!expert) throw new Error("Expert not found");

    // 1. Finance Stats
    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    const mtdTransactions = await this.db
      .selectFrom("transactions")
      .select(["amount"])
      .where("userId", "=", expertId)
      .where("type", "=", "PAYMENT_RECEIVED")
      .where("createdAt", ">=", firstDayOfMonth)
      .execute();

    const earnedMTD = mtdTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0,
    );

    const activeQuickTasks = await this.db
      .selectFrom("quick_tasks")
      .innerJoin("users as client", "client.id", "quick_tasks.clientId")
      .select([
        "quick_tasks.id",
        "quick_tasks.title",
        "quick_tasks.budget",
        "quick_tasks.deadline",
        "quick_tasks.status",
        "client.name as clientName",
      ])
      .where("quick_tasks.expertId", "=", expertId)
      .where("quick_tasks.status", "in", ["IN_PROGRESS", "REVIEW"])
      .execute();

    const inEscrow = activeQuickTasks.reduce(
      (sum, qt) => sum + parseFloat(qt.budget),
      0,
    );

    // 2. Action Required (Deadlines < 24h) & 3. Active Work
    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const actionRequired = activeQuickTasks
      .filter((qt) => qt.deadline)
      .map((qt) => ({
        id: qt.id,
        type: "Task",
        taskName: qt.title,
        clientName: qt.clientName,
        dueDate: qt.deadline,
        isUrgent: new Date(qt.deadline!) < tomorrow,
      }))
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime(),
      );

    const activeWork = activeQuickTasks.map((qt) => ({
      id: qt.id,
      title: qt.title,
      clientName: qt.clientName,
      status: qt.status,
      progressPercentage: qt.status === "REVIEW" ? 90 : 50,
      escrowAmount: parseFloat(qt.budget),
      dueDate: qt.deadline,
    }));

    // 4. Messages (Mock unread for now, fetch real recent chats)
    const convos = await this.db
      .selectFrom("conversation_participants as cp")
      .innerJoin("conversations as c", "c.id", "cp.conversationId")
      .leftJoin("messages as m", "m.conversationId", "c.id")
      .select([
        "c.id as conversationId",
        "c.name as chatName",
        "m.content as lastMessage",
        "m.createdAt as time",
      ])
      .where("cp.userId", "=", expertId)
      .orderBy("m.createdAt", "desc")
      .execute();

    // Deduplicate to get the latest message per conversation
    const recentChatsMap = new Map();
    for (const c of convos) {
      if (c.lastMessage && !recentChatsMap.has(c.conversationId)) {
        recentChatsMap.set(c.conversationId, {
          conversationId: c.conversationId,
          senderName: c.chatName || "Client",
          lastMessage: c.lastMessage,
          time: c.time,
          unreadCount: 0,
        });
      }
    }
    const recentChats = Array.from(recentChatsMap.values()).slice(0, 3);

    // 5. Recommended Tasks
    const recommendedTasks = await this.db
      .selectFrom("quick_tasks")
      .select(["id", "title", "budget", "createdAt"])
      .where("status", "=", "OPEN")
      .where("expertId", "is", null)
      .orderBy("createdAt", "desc")
      .limit(5)
      .execute();

    return {
      finance: {
        availableToWithdraw: parseFloat((expert.balance as any) || "0"),
        inEscrow,
        earnedMTD,
      },
      actionRequired,
      activeWork,
      messages: {
        totalUnread: 0,
        recentChats,
      },
      recommendedTasks: recommendedTasks.map((t) => ({
        id: t.id,
        title: t.title,
        budget: parseFloat(t.budget),
        tags: ["AI", "Tech"], // Mock tags since DB doesn't have a tags array yet
        createdAt: t.createdAt,
      })),
    };
  }

  async createReview(expertId: string, data: any) {
    return null;
  }

  async getReviews(expertId: string) {
    return [];
  }

  async getMyProfile(userId: string) {
    const profile = await this.db
      .selectFrom("expert_profiles")
      .selectAll()
      .where("userId", "=", userId)
      .executeTakeFirst();
    return profile || null;
  }

  async upsertProfile(userId: string, data: any) {
    const existing = await this.getMyProfile(userId);

    const updateData: any = { updatedAt: new Date() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.skills !== undefined)
      updateData.skills =
        typeof data.skills === "string"
          ? data.skills
          : JSON.stringify(data.skills);
    if (data.hourlyRate !== undefined) updateData.hourlyRate = data.hourlyRate;
    if (data.experienceYears !== undefined)
      updateData.experienceYears = data.experienceYears;
    if (data.portfolioUrl !== undefined)
      updateData.portfolioUrl = data.portfolioUrl;
    if (data.rating !== undefined) updateData.rating = data.rating;

    if (existing) {
      return this.db
        .updateTable("expert_profiles")
        .set(updateData)
        .where("id", "=", existing.id)
        .returningAll()
        .executeTakeFirst();
    } else {
      return this.db
        .insertInto("expert_profiles")
        .values({
          id: crypto.randomUUID(),
          userId,
          title: data.title || null,
          bio: data.bio || null,
          skills: data.skills
            ? typeof data.skills === "string"
              ? data.skills
              : JSON.stringify(data.skills)
            : null,
          hourlyRate: data.hourlyRate || "0",
          experienceYears: data.experienceYears || 0,
          portfolioUrl: data.portfolioUrl || null,
          rating: data.rating || "0",
          updatedAt: new Date(),
        })
        .returningAll()
        .executeTakeFirst();
    }
  }
}

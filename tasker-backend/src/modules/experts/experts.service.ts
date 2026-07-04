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
}

@Injectable()
export class ExpertsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async findAll(filters: ExpertSearchFilters) {
    // Get all experts (users with role EXPERT or currentRole EXPERT)
    let query = this.db
      .selectFrom("users")
      .select([
        "id",
        "name",
        "avatar",
        "title",
        "bio",
        "skills",
        "rate",
        "location",
        "badge",
        "online",
      ])
      .where((eb) =>
        eb.or([
          eb("role", "=", "EXPERT"),
          eb("currentRole", "=", "EXPERT"),
        ]),
      );

    // Filter by name/title search
    if (filters.search) {
      const term = `%${filters.search}%`;
      query = query.where((eb) =>
        eb.or([
          eb("name", "ilike", term),
          eb("title", "ilike", term),
        ]),
      );
    }

    // Filter by badge
    if (filters.badge) {
      query = query.where("badge", "=", filters.badge);
    }

    // Filter by online status
    if (filters.online !== undefined) {
      query = query.where("online", "=", filters.online);
    }

    const experts = await query.execute();

    // Get review stats for all experts
    const expertIds = experts.map((e) => e.id);
    let reviewStats: any[] = [];
    if (expertIds.length > 0) {
      reviewStats = await this.db
        .selectFrom("reviews")
        .select([
          "expertId",
          sql<number>`count(*)`.as("reviewCount"),
          sql<number>`avg(rating)`.as("avgRating"),
        ])
        .where("expertId", "in", expertIds)
        .groupBy("expertId")
        .execute();
    }

    // Get completed tasks count
    let taskCounts: any[] = [];
    if (expertIds.length > 0) {
      taskCounts = await this.db
        .selectFrom("tasks")
        .select([
          "assigneeId",
          sql<number>`count(*)`.as("completedTasks"),
        ])
        .where("assigneeId", "in", expertIds)
        .where("status", "=", "DONE")
        .groupBy("assigneeId")
        .execute();
    }

    // Merge data
    const result = experts.map((expert) => {
      const stats = reviewStats.find((r: any) => r.expertId === expert.id);
      const tasks = taskCounts.find((t: any) => t.assigneeId === expert.id);

      return {
        ...expert,
        rating: stats ? parseFloat(Number(stats.avgRating).toFixed(1)) : 0,
        reviews: stats ? Number(stats.reviewCount) : 0,
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
        const skills = typeof e.skills === "string" ? JSON.parse(e.skills) : e.skills;
        if (Array.isArray(skills)) {
          return skills.some((s: string) => s.toLowerCase().includes(skillLower));
        }
        // Handle { core: [...], secondary: [...] } format
        const allSkills = [...(skills.core || []), ...(skills.secondary || [])];
        return allSkills.some((s: string) => s.toLowerCase().includes(skillLower));
      });
    }

    return result;
  }

  async findOne(id: string) {
    const expert = await this.db
      .selectFrom("users")
      .selectAll()
      .where("id", "=", id)
      .executeTakeFirst();

    if (!expert) return null;

    // Get reviews
    const reviews = await this.db
      .selectFrom("reviews")
      .innerJoin("users", "users.id", "reviews.reviewerId")
      .select([
        "reviews.id",
        "reviews.rating",
        "reviews.feedback",
        "reviews.taskTitle",
        "reviews.createdAt",
        "users.name as reviewerName",
        "users.avatar as reviewerAvatar",
      ])
      .where("reviews.expertId", "=", id)
      .orderBy("reviews.createdAt", "desc")
      .execute();

    // Stats
    const avgRating =
      reviews.length > 0
        ? parseFloat(
            (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1),
          )
        : 0;

    const completedTasks = await this.db
      .selectFrom("tasks")
      .select(sql<number>`count(*)`.as("count"))
      .where("assigneeId", "=", id)
      .where("status", "=", "DONE")
      .executeTakeFirst();

    // Work history (completed quick tasks)
    const workHistory = await this.db
      .selectFrom("quick_tasks")
      .select(["id", "title", "budget", "status", "createdAt"])
      .where("expertId", "=", id)
      .where("status", "=", "COMPLETED")
      .orderBy("createdAt", "desc")
      .limit(10)
      .execute();

    return {
      ...expert,
      rating: avgRating,
      reviewCount: reviews.length,
      completedTasks: completedTasks ? Number(completedTasks.count) : 0,
      reviews,
      workHistory,
    };
  }

  async getOverview(expertId: string) {
    const expert = await this.db
      .selectFrom("users")
      .select(["balance", "skills"])
      .where("id", "=", expertId)
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
      
    const earnedMTD = mtdTransactions.reduce((sum, t) => sum + parseFloat(t.amount as string), 0);

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

    const inEscrow = activeQuickTasks.reduce((sum, qt) => sum + parseFloat(qt.budget as string), 0);

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
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

    const activeWork = activeQuickTasks.map((qt) => ({
      id: qt.id,
      title: qt.title,
      clientName: qt.clientName,
      status: qt.status,
      progressPercentage: qt.status === "REVIEW" ? 90 : 50,
      escrowAmount: parseFloat(qt.budget as string),
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
        availableToWithdraw: parseFloat(expert.balance as string),
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
        budget: parseFloat(t.budget as string),
        tags: ["AI", "Tech"], // Mock tags since DB doesn't have a tags array yet
        createdAt: t.createdAt,
      })),
    };
  }

  async createReview(expertId: string, data: any) {
    return this.db
      .insertInto("reviews")
      .values({
        id: crypto.randomUUID(),
        reviewerId: data.reviewerId,
        expertId,
        rating: data.rating,
        feedback: data.feedback || null,
        taskTitle: data.taskTitle || null,
      })
      .returningAll()
      .executeTakeFirst();
  }

  async getReviews(expertId: string) {
    return this.db
      .selectFrom("reviews")
      .innerJoin("users", "users.id", "reviews.reviewerId")
      .select([
        "reviews.id",
        "reviews.rating",
        "reviews.feedback",
        "reviews.taskTitle",
        "reviews.createdAt",
        "users.name as reviewerName",
        "users.avatar as reviewerAvatar",
      ])
      .where("reviews.expertId", "=", expertId)
      .orderBy("reviews.createdAt", "desc")
      .execute();
  }
}

import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import {
  findAllExpertsQuery,
  getCompletedTasksCountsQuery,
  findExpertByIdQuery,
  getCompletedTasksCountQuery,
  getQuickTasksHistoryQuery,
  getProjectTasksHistoryQuery,
  getExpertOverviewQuery,
  getMtdTransactionsQuery,
  getActiveQuickTasksQuery,
  getConversationsQuery,
  getRecommendedTasksQuery,
  getMyProfileQuery,
  updateExpertProfileQuery,
  createExpertProfileQuery,
} from "@/queries/experts";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";

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
    const experts = await findAllExpertsQuery(this.db, filters);

    const expertIds = experts.map((e) => e.id);

    let taskCounts: any[] = [];
    if (expertIds.length > 0) {
      taskCounts = await getCompletedTasksCountsQuery(this.db, expertIds);
    }

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

    if (filters.minRating) {
      return result.filter((e) => e.rating >= filters.minRating!);
    }

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
        const allSkills = [...(skills.core || []), ...(skills.secondary || [])];
        return allSkills.some((s: string) =>
          s.toLowerCase().includes(skillLower),
        );
      });
    }

    return result;
  }

  async findOne(id: string) {
    const expert = await findExpertByIdQuery(this.db, id);

    if (!expert) return null;

    const completedTasks = await getCompletedTasksCountQuery(this.db, id);
    const quickTasksHistory = await getQuickTasksHistoryQuery(this.db, id);
    const projectTasksHistoryRaw = await getProjectTasksHistoryQuery(
      this.db,
      id,
    );

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
      rating: parseFloat(expert.rating) || 0,
      reviewCount: 0,
      completedTasks: completedTasks ? Number(completedTasks.count) : 0,
      reviews: [],
      workHistory,
    };
  }

  async getOverview(expertId: string) {
    const expert = await getExpertOverviewQuery(this.db, expertId);

    if (!expert) throw new Error("Expert not found");

    const date = new Date();
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    const mtdTransactions = await getMtdTransactionsQuery(
      this.db,
      expertId,
      firstDayOfMonth,
    );

    const earnedMTD = mtdTransactions.reduce(
      (sum, t) => sum + parseFloat(t.amount),
      0,
    );

    const activeQuickTasks = await getActiveQuickTasksQuery(this.db, expertId);

    const inEscrow = activeQuickTasks.reduce(
      (sum, qt) => sum + parseFloat(qt.budget),
      0,
    );

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
        isUrgent: qt.deadline ? new Date(qt.deadline) < tomorrow : false,
      }))
      .sort((a, b) => {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return timeA - timeB;
      });

    const activeWork = activeQuickTasks.map((qt) => ({
      id: qt.id,
      title: qt.title,
      clientName: qt.clientName,
      status: qt.status,
      progressPercentage: qt.status === "REVIEW" ? 90 : 50,
      escrowAmount: parseFloat(qt.budget),
      dueDate: qt.deadline,
    }));

    const convos = await getConversationsQuery(this.db, expertId);

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

    const recommendedTasks = await getRecommendedTasksQuery(this.db);

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
        tags: ["AI", "Tech"],
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
    const profile = await getMyProfileQuery(this.db, userId);
    return profile || null;
  }

  async upsertProfile(userId: string, data: any) {
    const existing = await this.getMyProfile(userId);

    const updateData: any = { updatedAt: new Date().toISOString() };
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
      return updateExpertProfileQuery(this.db, existing.id, updateData);
    } else {
      return createExpertProfileQuery(this.db, userId, data);
    }
  }
}

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
  getActiveContractsQuery,
  getConversationsQuery,
  getRecommendedTasksQuery,
  getMyProfileQuery,
  updateExpertProfileQuery,
  createExpertProfileQuery,
} from "@/queries/experts";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { UpsertExpertProfileDto, CreateReviewDto } from "./core/dto/experts.dto";

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

    let taskCounts: { assigneeId: string; completedTasks: string | number }[] =
      [];
    if (expertIds.length > 0) {
      taskCounts = (await getCompletedTasksCountsQuery(
        this.db,
        expertIds,
      )) as any;
    }

    const result = experts.map((expert) => {
      const tasks = taskCounts.find((t) => t.assigneeId === expert.id);
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

    const activeContracts = await getActiveContractsQuery(this.db, expertId);

    const inEscrow = activeContracts.reduce(
      (sum, c) => sum + parseFloat(c.escrowAmount),
      0,
    );

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const actionRequired = activeContracts
      .filter((c) => c.deadline)
      .map((c) => {
        const title = c.quickTaskTitle || c.milestoneTitle || "Untitled Contract";
        const isMilestone = !!c.milestoneId;
        return {
          id: c.quickTaskId || c.milestoneId,
          type: isMilestone ? "Milestone" : "Task",
          taskName: title,
          clientName: c.clientName,
          dueDate: c.deadline,
          isUrgent: c.deadline ? new Date(c.deadline) < tomorrow : false,
        };
      })
      .sort((a, b) => {
        const timeA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const timeB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        return timeA - timeB;
      });

    const activeWork = activeContracts.map((c) => {
      const title = c.quickTaskTitle || c.milestoneTitle || "Untitled Contract";
      const status = c.quickTaskStatus || c.milestoneStatus || "IN_PROGRESS";
      return {
        id: c.quickTaskId || c.milestoneId,
        title,
        clientName: c.clientName,
        status,
        progressPercentage: status === "REVIEW" ? 90 : 50,
        escrowAmount: parseFloat(c.escrowAmount as any),
        dueDate: c.deadline,
      };
    });

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

  async createReview(expertId: string, data: CreateReviewDto) {
    return null;
  }

  async getReviews(expertId: string) {
    return [];
  }

  async getMyProfile(userId: string) {
    const profile = await getMyProfileQuery(this.db, userId);
    return profile || null;
  }

  async upsertProfile(userId: string, data: UpsertExpertProfileDto) {
    const existing = await this.getMyProfile(userId);

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
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

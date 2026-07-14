import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { WalletService } from "@/modules/wallet/wallet.service";
import {
  findAllProjectsQuery,
  findProjectByIdQuery,
  getProjectTasksStatsQuery,
  getProjectMembersStatsQuery,
  getUpcomingMilestonesQuery,
  createProjectQuery,
  getProjectFinanceQuery,
  getProjectTransactionsQuery,
  getProjectMilestonesQuery,
  getMilestoneProposalsQuery,
  updateProjectFinanceQuery,
  updateProjectQuery,
  checkProjectActiveTransactionsQuery,
  checkProjectActiveMilestonesQuery,
  deleteProjectQuery,
} from "@/queries/projects";

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly walletService: WalletService,
  ) {}

  async findAll() {
    return findAllProjectsQuery(this.db);
  }

  async findOne(id: string) {
    const project = await findProjectByIdQuery(this.db, id);

    if (!project) return null;

    const tasks = await getProjectTasksStatsQuery(this.db, id);

    const completedTasks = tasks.filter((t: any) => t.status === "DONE").length;
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((t: any) => t.status !== "DONE").length;

    const members = await getProjectMembersStatsQuery(this.db, id);

    const totalMembers = members.length;
    const expertMembers = members.filter(
      (m: any) => m.role === "EXPERT",
    ).length;

    const milestones = await getUpcomingMilestonesQuery(this.db, id);

    return {
      ...project,
      stats: {
        completion:
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100),
        activeTasks,
        totalMembers,
        expertMembers,
      },
      upcomingMilestones: milestones,
    };
  }

  async create(userId: string, data: any) {
    return this.db.transaction().execute(async (trx) => {
      return createProjectQuery(trx, userId, data);
    });
  }

  async getFinance(projectId: string) {
    const project = await getProjectFinanceQuery(this.db, projectId);
    const transactions = await getProjectTransactionsQuery(this.db, projectId);

    return {
      budget: project?.budget || "0",
      spent: project?.spent || "0",
      escrow: project?.escrow || "0",
      transactions,
    };
  }

  async getMarketplace(projectId: string) {
    const milestones = await getProjectMilestonesQuery(this.db, projectId);

    if (milestones.length === 0) return [];

    const milestoneIds = milestones.map((m: any) => m.id);
    const proposals = await getMilestoneProposalsQuery(this.db, milestoneIds);

    return milestones.map((m: any) => ({
      ...m,
      proposals: proposals.filter((p: any) => p.milestoneId === m.id),
    }));
  }

  async addFunds(projectId: string, amount: number, userId: string) {
    return this.db.transaction().execute(async (trx) => {
      const project = await getProjectFinanceQuery(trx, projectId);

      if (!project) throw new NotFoundException("Project not found");

      await this.walletService.processEscrow(
        trx,
        userId,
        amount,
        `Added funds to project escrow`,
        projectId,
      );

      const newBudget = (Number(project.budget) + amount).toString();
      const newEscrow = (Number(project.escrow) + amount).toString();

      await updateProjectFinanceQuery(trx, projectId, newBudget, newEscrow);

      return { success: true, newBudget, newEscrow };
    });
  }

  async update(id: string, data: any) {
    const updateData: any = { updatedAt: new Date().toISOString() };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.budget !== undefined) updateData.budget = data.budget.toString();

    return updateProjectQuery(this.db, id, updateData);
  }

  async remove(id: string) {
    const project = await getProjectFinanceQuery(this.db, id);

    if (!project) throw new NotFoundException("Project not found");

    if (Number(project.escrow) > 0 || Number(project.spent) > 0) {
      throw new BadRequestException(
        "Cannot delete a project that holds escrow funds or has a financial history.",
      );
    }

    const transactions = await checkProjectActiveTransactionsQuery(this.db, id);

    if (transactions.length > 0) {
      throw new BadRequestException(
        "Cannot delete a project with financial transactions. Please archive it instead.",
      );
    }

    const activeMilestones = await checkProjectActiveMilestonesQuery(
      this.db,
      id,
    );

    if (activeMilestones.length > 0) {
      throw new BadRequestException(
        "Cannot delete a project that has active, in-review, or paid milestones.",
      );
    }

    await deleteProjectQuery(this.db, id);

    return { success: true };
  }
}

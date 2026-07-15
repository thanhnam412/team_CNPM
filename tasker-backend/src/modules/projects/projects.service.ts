import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import {
  validateProjectAction,
  ProjectAction,
  ProjectError,
  ProjectDeleteSnapshot,
  ProjectUpdatePatch,
  ProjectUpdateSnapshot,
} from "@/modules/projects/core/domain";

function mapLogicError(err: Error): never {
  if (err instanceof ProjectError) {
    throw new BadRequestException(err.message);
  }
  throw err;
}

function validateLogic(
  action: "UPDATE",
  patch: ProjectUpdatePatch,
  snapshot: ProjectUpdateSnapshot,
): void;
function validateLogic(
  action: "DELETE",
  snapshot: ProjectDeleteSnapshot,
): void;
function validateLogic(
  action: ProjectAction,
  payload1: any,
  payload2?: any,
): void {
  try {
    if (action === "UPDATE") {
      validateProjectAction("UPDATE", payload1 as ProjectUpdatePatch, payload2 as ProjectUpdateSnapshot);
    } else {
      validateProjectAction("DELETE", payload1 as ProjectDeleteSnapshot);
    }
  } catch (err) {
    mapLogicError(err as Error);
  }
}
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import { EscrowService } from "../wallet/escrow/escrow.service";
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
import { getProjectContractsQuery } from "@/queries/contracts";
import { CreateProjectDto, UpdateProjectDto } from "./core/dto/project.dto";

@Injectable()
export class ProjectsService {
  constructor(
    @Inject(KYSELY_DB) private db: Kysely<DB>,
    private readonly escrowService: EscrowService,
  ) {}

  async findAll() {
    return findAllProjectsQuery(this.db);
  }

  async findOne(id: string) {
    const project = await findProjectByIdQuery(this.db, id);

    if (!project) return null;

    const tasks = await getProjectTasksStatsQuery(this.db, id);

    const completedTasks = tasks.filter((t) => t.status === "DONE").length;
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((t) => t.status !== "DONE").length;

    const members = await getProjectMembersStatsQuery(this.db, id);

    const totalMembers = members.length;
    const expertMembers = members.filter((m) => m.role === "EXPERT").length;

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

  async create(userId: string, data: CreateProjectDto) {
    return this.db.transaction().execute(async (trx) => {
      return createProjectQuery(trx, userId, data);
    });
  }

  async getFinance(projectId: string) {
    const project = await getProjectFinanceQuery(this.db, projectId);
    const transactions = await getProjectTransactionsQuery(this.db, projectId);
    const contracts = await getProjectContractsQuery(this.db, projectId);

    const trueEscrow = contracts
      .filter((c) => c.escrowStatus === "HELD")
      .reduce((sum, c) => sum + Number(c.agreedPrice || 0), 0);

    const trueSpent = contracts
      .filter((c) => c.escrowStatus === "RELEASED")
      .reduce((sum, c) => sum + Number(c.agreedPrice || 0), 0);

    const activeContracts = contracts
      .filter((c) => c.escrowStatus === "HELD")
      .map((c) => ({
        id: c.id,
        milestoneName: (c as any).milestoneName,
        expertName: (c as any).expertName,
        agreedPrice: c.agreedPrice,
        createdAt: c.createdAt,
      }));

    return {
      budget: project?.budget || "0",
      spent: trueSpent.toString(),
      escrow: trueEscrow.toString(),
      transactions,
      activeContracts,
    };
  }

  async getMarketplace(projectId: string) {
    const milestones = await getProjectMilestonesQuery(this.db, projectId);

    if (milestones.length === 0) return [];

    const milestoneIds = milestones.map((m) => m.id);
    const proposals = await getMilestoneProposalsQuery(this.db, milestoneIds);

    return milestones.map((m) => ({
      ...m,
      proposals: proposals.filter((p) => p.milestoneId === m.id),
    }));
  }

  async addFunds(projectId: string, amount: number, userId: string) {
    return this.db.transaction().execute(async (trx) => {
      const project = await getProjectFinanceQuery(trx, projectId);

      if (!project) throw new NotFoundException("Project not found");

      await this.escrowService.processEscrow(
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

  async update(id: string, data: UpdateProjectDto) {
    const project = await getProjectFinanceQuery(this.db, id);
    if (!project) throw new NotFoundException("Project not found");

    const patch: ProjectUpdatePatch = { budget: data.budget, status: data.status };
    const snapshot: ProjectUpdateSnapshot = { status: project.status || "DRAFT", escrow: Number(project.escrow || 0) };

    validateLogic("UPDATE", patch, snapshot);

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.status !== undefined) updateData.status = data.status;

    return updateProjectQuery(this.db, id, updateData);
  }

  async remove(id: string) {
    const project = await getProjectFinanceQuery(this.db, id);

    if (!project) throw new NotFoundException("Project not found");

    const transactions = await checkProjectActiveTransactionsQuery(this.db, id);
    const activeMilestones = await checkProjectActiveMilestonesQuery(this.db, id);

    const snapshot: ProjectDeleteSnapshot = {
      escrow: Number(project.escrow || 0),
      spent: Number(project.spent || 0),
      activeTransactionsCount: transactions.length,
      activeMilestonesCount: activeMilestones.length,
    };

    validateLogic("DELETE", snapshot);

    await deleteProjectQuery(this.db, id);

    return { success: true };
  }
}

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  getInvitationQuery,
  insertInvitationQuery,
  findInvitationsByExpertQuery,
  findInvitationsByClientQuery,
  getInvitationStatusQuery,
  updateInvitationStatusQuery,
  checkProjectMemberQuery,
  insertProjectMemberQuery,
  updateQuickTaskExpertQuery,
  insertContractQuery,
  updateMilestoneStatusQuery,
} from "@/queries/invitations";

@Injectable()
export class InvitationsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async create(data: any) {
    if (data.clientId === data.expertId) {
      throw new BadRequestException(
        "You cannot invite yourself to a task or project.",
      );
    }

    const projectId = data.projectId || null;
    const quickTaskId = data.taskId || data.quickTaskId || null;
    const milestoneId = data.milestoneId || null;

    if (!projectId && !quickTaskId && !milestoneId) {
      throw new BadRequestException(
        "Invitation must target a project, milestone, or quick task.",
      );
    }

    // Check for duplicates
    const existing = await getInvitationQuery(this.db, {
      clientId: data.clientId,
      expertId: data.expertId,
      quickTaskId,
      milestoneId,
      projectId,
    });

    if (existing) {
      throw new BadRequestException(
        "You have already sent an invitation to this expert for this task/project.",
      );
    }

    return insertInvitationQuery(this.db, {
      id: crypto.randomUUID(),
      clientId: data.clientId,
      expertId: data.expertId,
      projectId: data.projectId || null,
      quickTaskId: data.taskId || data.quickTaskId || null,
      milestoneId: data.milestoneId || null,
      message: data.message || null,
      budget: data.budget?.toString() || null,
      status: "PENDING",
      updatedAt: new Date(),
    });
  }

  async findByExpert(expertId: string) {
    return findInvitationsByExpertQuery(this.db, expertId);
  }

  async findByClient(clientId: string) {
    return findInvitationsByClientQuery(this.db, clientId);
  }

  async updateStatus(
    id: string,
    status: "ACCEPTED" | "REJECTED" | "CANCELLED",
  ) {
    return this.db.transaction().execute(async (trx) => {
      // Check current status
      const existing = await getInvitationStatusQuery(trx, id);

      if (!existing) {
        throw new NotFoundException("Invitation not found.");
      }

      if (existing.status !== "PENDING") {
        throw new BadRequestException(
          "Cannot update an invitation that is already resolved.",
        );
      }
      
      const invitation = await updateInvitationStatusQuery(trx, id, status);

      if (status === "ACCEPTED") {
        // If invitation was for a specific project, add the expert to the project team
        if (invitation.projectId) {
          const existingMember = await checkProjectMemberQuery(
            trx,
            invitation.projectId,
            invitation.expertId,
          );

          if (!existingMember) {
            await insertProjectMemberQuery(trx, {
              id: crypto.randomUUID(),
              projectId: invitation.projectId,
              userId: invitation.expertId,
              role: "EXPERT",
              status: "ACTIVE",
              updatedAt: new Date(),
            });
          }
        }

        // If invitation was for a specific quick task, assign it
        if (invitation.quickTaskId) {
          await updateQuickTaskExpertQuery(
            trx,
            invitation.quickTaskId,
            invitation.expertId,
          );

          await insertContractQuery(trx, {
            id: crypto.randomUUID(),
            quickTaskId: invitation.quickTaskId,
            expertId: invitation.expertId,
            clientId: invitation.clientId,
            agreedPrice: invitation.budget || "0",
            escrowStatus: "HELD",
            updatedAt: new Date(),
          });
        }

        // If invitation was for a milestone, activate it
        if (invitation.milestoneId) {
          await updateMilestoneStatusQuery(trx, invitation.milestoneId);

          await insertContractQuery(trx, {
            id: crypto.randomUUID(),
            milestoneId: invitation.milestoneId,
            expertId: invitation.expertId,
            clientId: invitation.clientId,
            agreedPrice: invitation.budget || "0",
            escrowStatus: "HELD",
            updatedAt: new Date(),
          });
        }
      }

      return invitation;
    });
  }
}

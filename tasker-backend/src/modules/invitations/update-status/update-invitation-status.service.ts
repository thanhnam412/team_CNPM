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
  getInvitationStatusQuery,
  updateInvitationStatusQuery,
  checkProjectMemberQuery,
  insertProjectMemberQuery,
  updateQuickTaskExpertQuery,
  insertContractQuery,
  updateMilestoneStatusQuery,
} from "@/queries/invitations";

@Injectable()
export class UpdateInvitationStatusService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async execute(
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

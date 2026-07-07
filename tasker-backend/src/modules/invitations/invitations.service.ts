/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class InvitationsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async create(data: any) {
    if (data.clientId === data.expertId) {
      throw new BadRequestException("You cannot invite yourself to a task or project.");
    }

    const projectId = data.projectId || null;
    const quickTaskId = data.taskId || data.quickTaskId || null;
    const milestoneId = data.milestoneId || null;

    if (!projectId && !quickTaskId && !milestoneId) {
      throw new BadRequestException("Invitation must target a project, milestone, or quick task.");
    }

    // Check for duplicates
    let query = this.db
      .selectFrom("invitations")
      .select(["id"])
      .where("clientId", "=", data.clientId)
      .where("expertId", "=", data.expertId);

    if (quickTaskId) query = query.where("quickTaskId", "=", quickTaskId);
    else if (milestoneId) query = query.where("milestoneId", "=", milestoneId);
    else if (projectId) query = query.where("projectId", "=", projectId);

    const existing = await query.executeTakeFirst();
    if (existing) {
      throw new BadRequestException("You have already sent an invitation to this expert for this task/project.");
    }

    return this.db
      .insertInto("invitations")
      .values({
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
      })
      .returningAll()
      .executeTakeFirst();
  }

  async findByExpert(expertId: string) {
    return this.db
      .selectFrom("invitations")
      .innerJoin("users as client", "client.id", "invitations.clientId")
      .leftJoin("projects", "projects.id", "invitations.projectId")
      .leftJoin("milestones", "milestones.id", "invitations.milestoneId")
      .select([
        "invitations.id",
        "invitations.message",
        "invitations.budget",
        "invitations.status",
        "invitations.createdAt",
        "client.id as clientId",
        "client.name as clientName",
        "client.avatar as clientAvatar",
        "projects.id as projectId",
        "projects.title as projectTitle",
        "milestones.id as milestoneId",
        "milestones.title as milestoneTitle",
      ])
      .where("expertId", "=", expertId)
      .orderBy("invitations.createdAt", "desc")
      .execute();
  }

  async findByClient(clientId: string) {
    return this.db
      .selectFrom("invitations")
      .innerJoin("users as expert", "expert.id", "invitations.expertId")
      .leftJoin("expert_profiles as ep", "ep.userId", "expert.id")
      .leftJoin("projects", "projects.id", "invitations.projectId")
      .leftJoin("milestones", "milestones.id", "invitations.milestoneId")
      .select([
        "invitations.id",
        "invitations.message",
        "invitations.budget",
        "invitations.status",
        "invitations.createdAt",
        "expert.id as expertId",
        "expert.name as expertName",
        "expert.avatar as expertAvatar",
        "ep.title as expertTitle",
        "projects.id as projectId",
        "projects.title as projectTitle",
        "milestones.id as milestoneId",
        "milestones.title as milestoneTitle",
      ])
      .where("clientId", "=", clientId)
      .orderBy("invitations.createdAt", "desc")
      .execute();
  }

  async updateStatus(
    id: string,
    status: "ACCEPTED" | "REJECTED" | "CANCELLED",
  ) {
    return this.db.transaction().execute(async (trx) => {
      // Check current status
      const existing = await trx
        .selectFrom("invitations")
        .select(["status"])
        .where("id", "=", id)
        .executeTakeFirst();

      if (!existing) {
        throw new NotFoundException("Invitation not found.");
      }

      if (existing.status !== "PENDING") {
        throw new BadRequestException("Cannot update an invitation that is already resolved.");
      }
      const invitation = await trx
        .updateTable("invitations")
        .set({ status: status as any, updatedAt: new Date() })
        .where("id", "=", id)
        .returningAll()
        .executeTakeFirstOrThrow();

      if (status === "ACCEPTED") {
        // If invitation was for a specific project, add the expert to the project team
        if (invitation.projectId) {
          const existingMember = await trx
            .selectFrom("project_members")
            .select(["id"])
            .where("projectId", "=", invitation.projectId)
            .where("userId", "=", invitation.expertId)
            .executeTakeFirst();

          if (!existingMember) {
            await trx
              .insertInto("project_members")
              .values({
                id: crypto.randomUUID(),
                projectId: invitation.projectId,
                userId: invitation.expertId,
                role: "EXPERT",
                status: "ACTIVE",
                updatedAt: new Date(),
              })
              .execute();
          }
        }

        // If invitation was for a specific quick task, assign it
        if (invitation.quickTaskId) {
          await trx
            .updateTable("quick_tasks")
            .set({
              expertId: invitation.expertId,
              status: "IN_PROGRESS" as any,
              updatedAt: new Date(),
            })
            .where("id", "=", invitation.quickTaskId)
            .execute();
            
          await trx
            .insertInto("contracts")
            .values({
              id: crypto.randomUUID(),
              quickTaskId: invitation.quickTaskId,
              expertId: invitation.expertId,
              clientId: invitation.clientId,
              agreedPrice: invitation.budget || "0",
              escrowStatus: "HELD",
              updatedAt: new Date(),
            })
            .execute();
        }

        // If invitation was for a milestone, activate it
        if (invitation.milestoneId) {
          await trx
            .updateTable("milestones")
            .set({ status: "ACTIVE" as any, updatedAt: new Date() })
            .where("id", "=", invitation.milestoneId)
            .execute();
            
          await trx
            .insertInto("contracts")
            .values({
              id: crypto.randomUUID(),
              milestoneId: invitation.milestoneId,
              expertId: invitation.expertId,
              clientId: invitation.clientId,
              agreedPrice: invitation.budget || "0",
              escrowStatus: "HELD",
              updatedAt: new Date(),
            })
            .execute();
        }
      }

      return invitation;
    });
  }
}

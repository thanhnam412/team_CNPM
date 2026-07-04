/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class InvitationsService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async create(data: any) {
    if (data.clientId === data.expertId) {
      throw new Error("You cannot invite yourself to a task or project.");
    }

    return this.db
      .insertInto("invitations")
      .values({
        id: crypto.randomUUID(),
        clientId: data.clientId,
        expertId: data.expertId,
        projectId: data.projectId || null,
        taskId: data.taskId || null,
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
        "expert.title as expertTitle",
        "projects.id as projectId",
        "projects.title as projectTitle",
        "milestones.id as milestoneId",
        "milestones.title as milestoneTitle",
      ])
      .where("clientId", "=", clientId)
      .orderBy("invitations.createdAt", "desc")
      .execute();
  }

  async updateStatus(id: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED") {
    return this.db.transaction().execute(async (trx) => {
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

        // If invitation was for a specific internal task, assign it
        if (invitation.taskId) {
          await trx
            .updateTable("tasks")
            .set({
              assigneeId: invitation.expertId,
              status: "IN_PROGRESS" as any,
              updatedAt: new Date(),
            })
            .where("id", "=", invitation.taskId)
            .execute();
        }

        // If invitation was for a milestone, activate it
        if (invitation.milestoneId) {
          await trx
            .updateTable("milestones")
            .set({ status: "ACTIVE" as any, updatedAt: new Date() })
            .where("id", "=", invitation.milestoneId)
            .execute();
        }
      }

      return invitation;
    });
  }
}

import { Inject, Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class TeamService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const admin = await this.db
      .selectFrom("project_members")
      .select("id")
      .where("projectId", "=", projectId)
      .where("userId", "=", userId)
      .where("role", "=", "CLIENT_ADMIN")
      .executeTakeFirst();
    if (!admin) throw new ForbiddenException("Must be CLIENT_ADMIN to manage team");
  }

  async getTeamMembers(projectId: string) {
    return this.db
      .selectFrom("project_members")
      .innerJoin("users", "users.id", "project_members.userId")
      .select([
        "project_members.id",
        "project_members.userId",
        "project_members.role",
        "project_members.status",
        "project_members.rating",
        "users.name",
        "users.email",
        "users.avatar",
      ])
      .where("project_members.projectId", "=", projectId)
      .execute();
  }

  async addMember(actorId: string, projectId: string, data: any) {
    await this._checkAdmin(actorId, projectId);
    return this.db
      .insertInto("project_members")
      .values({
        id: crypto.randomUUID(),
        projectId,
        userId: data.userId,
        role: data.role || "CLIENT_ADMIN",
        status: data.status || "ACTIVE",
        updatedAt: new Date(),
      })
      .returningAll()
      .executeTakeFirst();
  }

  async updateRole(actorId: string, memberId: string, role: string) {
    const member = await this.db.selectFrom("project_members").select("projectId").where("id", "=", memberId).executeTakeFirst();
    if (!member) throw new NotFoundException("Member not found");
    await this._checkAdmin(actorId, member.projectId);

    return this.db
      .updateTable("project_members")
      .set({ role: role as any, updatedAt: new Date() })
      .where("id", "=", memberId)
      .returningAll()
      .executeTakeFirst();
  }

  async removeMember(actorId: string, memberId: string) {
    const member = await this.db.selectFrom("project_members").select("projectId").where("id", "=", memberId).executeTakeFirst();
    if (!member) throw new NotFoundException("Member not found");
    await this._checkAdmin(actorId, member.projectId);

    await this.db
      .deleteFrom("project_members")
      .where("id", "=", memberId)
      .execute();

    return { success: true };
  }
}

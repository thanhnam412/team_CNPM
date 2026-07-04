import { Inject, Injectable } from "@nestjs/common";
import { Kysely } from "kysely";
import { KYSELY_DB } from "../../database/database.module";
import { DB } from "../../database/types";

@Injectable()
export class TeamService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  async getTeamMembers(projectId: string) {
    return this.db
      .selectFrom("project_members")
      .innerJoin("users", "users.id", "project_members.userId")
      .select([
        "project_members.id",
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

  async addMember(projectId: string, data: any) {
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

  async updateRole(memberId: string, role: string) {
    return this.db
      .updateTable("project_members")
      .set({ role: role as any, updatedAt: new Date() })
      .where("id", "=", memberId)
      .returningAll()
      .executeTakeFirst();
  }

  async removeMember(memberId: string) {
    await this.db
      .deleteFrom("project_members")
      .where("id", "=", memberId)
      .execute();

    return { success: true };
  }
}

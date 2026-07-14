import { KYSELY_DB } from "@/database/database.module";
import { DB } from "@/database/types";
import {
  addTeamMemberQuery,
  checkAdminQuery,
  deleteTeamMemberQuery,
  getTeamMemberProjectQuery,
  getTeamMembersQuery,
  updateTeamMemberRoleQuery,
} from "@/queries/team";
import {
  Inject,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Kysely } from "kysely";

@Injectable()
export class TeamService {
  constructor(@Inject(KYSELY_DB) private db: Kysely<DB>) {}

  private async _checkAdmin(userId: string, projectId: string) {
    const adminQuery = await checkAdminQuery(this.db, userId, projectId);
    if (!adminQuery)
      throw new ForbiddenException("Must be CLIENT_ADMIN to manage team");
  }

  async getTeamMembers(projectId: string) {
    return getTeamMembersQuery(this.db, projectId);
  }

  async addMember(actorId: string, projectId: string, data: any) {
    await this._checkAdmin(actorId, projectId);
    return addTeamMemberQuery(this.db, projectId, data);
  }

  async updateRole(actorId: string, memberId: string, role: string) {
    const projMember = await getTeamMemberProjectQuery(this.db, memberId);
    if (!projMember) throw new NotFoundException("Member not found");
    await this._checkAdmin(actorId, projMember.projectId);

    return updateTeamMemberRoleQuery(this.db, memberId, role);
  }

  async removeMember(actorId: string, memberId: string) {
    const projMember = await getTeamMemberProjectQuery(this.db, memberId);
    if (!projMember) throw new NotFoundException("Member not found");
    await this._checkAdmin(actorId, projMember.projectId);

    await deleteTeamMemberQuery(this.db, memberId);
    return { success: true };
  }
}

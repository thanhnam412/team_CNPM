import { Controller, Get, Post, Patch, Delete, Body, Param } from "@nestjs/common";
import { TeamService } from "./team.service";

@Controller("api/projects/:projectId/team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  getTeamMembers(@Param("projectId") projectId: string) {
    return this.teamService.getTeamMembers(projectId);
  }

  @Post()
  addMember(@Param("projectId") projectId: string, @Body() data: any) {
    return this.teamService.addMember(projectId, data);
  }

  @Patch(":memberId")
  updateRole(@Param("memberId") memberId: string, @Body("role") role: string) {
    return this.teamService.updateRole(memberId, role);
  }

  @Delete(":memberId")
  removeMember(@Param("memberId") memberId: string) {
    return this.teamService.removeMember(memberId);
  }
}

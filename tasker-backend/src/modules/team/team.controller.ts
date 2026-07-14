import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
} from "@nestjs/common";
import { TeamService } from "./team.service";

@Controller("api/projects/:projectId/team")
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  getTeamMembers(@Param("projectId") projectId: string) {
    return this.teamService.getTeamMembers(projectId);
  }

  @Post()
  addMember(
    @Request() req,
    @Param("projectId") projectId: string,
    @Body() data: any,
  ) {
    return this.teamService.addMember(req.user.userId, projectId, data);
  }

  @Patch(":memberId")
  updateRole(
    @Request() req,
    @Param("memberId") memberId: string,
    @Body("role") role: string,
  ) {
    return this.teamService.updateRole(req.user.userId, memberId, role);
  }

  @Delete(":memberId")
  removeMember(@Request() req, @Param("memberId") memberId: string) {
    return this.teamService.removeMember(req.user.userId, memberId);
  }
}

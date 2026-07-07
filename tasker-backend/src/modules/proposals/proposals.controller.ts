import { Controller, Get, Post, Body, Param, Patch, Request } from "@nestjs/common";
import { ProposalsService } from "./proposals.service";

@Controller("api")
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post("quick-tasks/:taskId/proposals")
  createProposal(@Request() req, @Param("taskId") taskId: string, @Body() data: any) {
    const expertId = req.user?.userId || data.expertId; // Fallback to data.expertId if no auth (unlikely)
    return this.proposalsService.createProposal({ quickTaskId: taskId }, expertId, data);
  }

  @Post("milestones/:milestoneId/proposals")
  createMilestoneProposal(@Request() req, @Param("milestoneId") milestoneId: string, @Body() data: any) {
    const expertId = req.user?.userId || data.expertId;
    return this.proposalsService.createProposal({ milestoneId }, expertId, data);
  }

  @Get("quick-tasks/:taskId/proposals")
  getProposalsForTask(@Param("taskId") taskId: string) {
    return this.proposalsService.getProposalsForTask(taskId);
  }

  @Get("milestones/:milestoneId/proposals")
  getProposalsForMilestone(@Param("milestoneId") milestoneId: string) {
    return this.proposalsService.getProposalsForMilestone(milestoneId);
  }

  @Get("users/:userId/proposals")
  getProposalsForExpert(@Param("userId") userId: string) {
    return this.proposalsService.getProposalsForExpert(userId);
  }

  @Patch("proposals/:proposalId/status")
  updateProposalStatus(@Request() req, @Param("proposalId") proposalId: string, @Body() data: any) {
    const userId = req.user?.userId;
    return this.proposalsService.updateProposalStatus(proposalId, data.status, userId);
  }
}

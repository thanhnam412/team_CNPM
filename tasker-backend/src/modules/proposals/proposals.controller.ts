import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ProposalsService } from './proposals.service';

@Controller('api')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post('quick-tasks/:taskId/proposals')
  createProposal(@Param('taskId') taskId: string, @Body() data: any) {
    return this.proposalsService.createProposal(taskId, data.expertId, data);
  }

  @Get('quick-tasks/:taskId/proposals')
  getProposalsForTask(@Param('taskId') taskId: string) {
    return this.proposalsService.getProposalsForTask(taskId);
  }

  @Get('users/:userId/proposals')
  getProposalsForExpert(@Param('userId') userId: string) {
    return this.proposalsService.getProposalsForExpert(userId);
  }

  @Patch('proposals/:proposalId/status')
  updateProposalStatus(@Param('proposalId') proposalId: string, @Body('status') status: 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN') {
    return this.proposalsService.updateProposalStatus(proposalId, status);
  }
}

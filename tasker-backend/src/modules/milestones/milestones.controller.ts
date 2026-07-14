import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { MilestonesService } from './milestones.service';
import { CreateMilestoneDto, UpdateMilestoneDto, SubmitDeliverablesDto } from './dto/milestones.dto';

/**
 * MilestonesController — chỉ xử lý CRUD của milestones.
 *
 * Accept Proposal → dùng PATCH /api/proposals/:id/accept (ProposalsController)
 * Không inject AcceptProposalUseCase ở đây để tránh circular dependency.
 */
@Controller('api/projects/:projectId/milestones')
export class MilestonesController {
  constructor(private readonly milestonesService: MilestonesService) {}

  @Get()
  findByProject(@Param('projectId') projectId: string) {
    return this.milestonesService.findByProject(projectId);
  }

  @Post()
  create(@Param('projectId') projectId: string, @Body() data: CreateMilestoneDto) {
    return this.milestonesService.create(projectId, data);
  }

  @Patch(':id')
  update(@Request() req, @Param('id') id: string, @Body() data: UpdateMilestoneDto) {
    return this.milestonesService.update(req.user.userId, id, data);
  }


  @Post(':id/submit')
  submitDeliverables(@Request() req, @Param('id') id: string, @Body() data: SubmitDeliverablesDto) {
    return this.milestonesService.submitDeliverables(req.user.userId, id, data);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.milestonesService.remove(req.user.userId, id);
  }

  @Get(':id/proposals')
  getProposals(@Param('id') id: string) {
    return this.milestonesService.getProposals(id);
  }
}

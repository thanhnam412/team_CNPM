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
import { MilestonesService } from "./milestones.service";
import { ApproveMilestoneService } from "./approve/approve-milestone.service";
import { CancelMilestoneService } from "./cancel/cancel-milestone.service";
import { SubmitDeliverablesService } from "./submit-deliverables/submit-deliverables.service";
import {
  CreateMilestoneDto,
  UpdateMilestoneDto,
  SubmitDeliverablesDto,
} from "./core/dto/milestones.dto";

@Controller("api/projects/:projectId/milestones")
export class MilestonesController {
  constructor(
    private readonly milestonesService: MilestonesService,
    private readonly approveMilestoneService: ApproveMilestoneService,
    private readonly cancelMilestoneService: CancelMilestoneService,
    private readonly submitDeliverablesService: SubmitDeliverablesService,
  ) {}

  @Get()
  findByProject(@Param("projectId") projectId: string) {
    return this.milestonesService.findByProject(projectId);
  }

  @Post()
  create(
    @Param("projectId") projectId: string,
    @Body() data: CreateMilestoneDto,
  ) {
    return this.milestonesService.create(projectId, data);
  }

  @Patch(":id")
  update(
    @Request() req,
    @Param("id") id: string,
    @Body() data: UpdateMilestoneDto,
  ) {
    return this.milestonesService.update(req.user.userId, id, data);
  }

  @Post(":id/deliverables")
  submitDeliverables(
    @Request() req,
    @Param("id") id: string,
    @Body() data: SubmitDeliverablesDto,
  ) {
    return this.submitDeliverablesService.execute(req.user.userId, id, data);
  }

  @Post(":id/approve")
  approveDeliverables(@Request() req, @Param("id") id: string) {
    return this.approveMilestoneService.execute(req.user.userId, id);
  }

  @Post(":id/cancel")
  cancelMilestone(@Request() req, @Param("id") id: string) {
    return this.cancelMilestoneService.execute(req.user.userId, id);
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    return this.milestonesService.remove(req.user.userId, id);
  }

  @Get(":id/proposals")
  getProposals(@Param("id") id: string) {
    return this.milestonesService.getProposals(id);
  }
}

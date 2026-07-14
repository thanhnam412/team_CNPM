import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { QuickTasksService } from "./quick-tasks.service";
import { CreateQuickTaskService } from "./create/create-quick-task.service";
import { SubmitDeliverableService } from "./submit-deliverable/submit-deliverable.service";
import { ApproveDeliverableService } from "./approve-deliverable/approve-deliverable.service";
import { RemoveQuickTaskService } from "./remove/remove-quick-task.service";
import { CancelQuickTaskService } from "./cancel/cancel-quick-task.service";
import { Public } from "../../decorators/public.decorator";
import {
  CreateQuickTaskDto,
  UpdateQuickTaskDto,
  SubmitDeliverableDto,
} from "./core/dto/quick-tasks.dto";

@Controller("api/quick-tasks")
export class QuickTasksController {
  constructor(
    private readonly quickTasksService: QuickTasksService,
    private readonly createQuickTaskService: CreateQuickTaskService,
    private readonly submitDeliverableService: SubmitDeliverableService,
    private readonly approveDeliverableService: ApproveDeliverableService,
    private readonly removeQuickTaskService: RemoveQuickTaskService,
    private readonly cancelQuickTaskService: CancelQuickTaskService,
  ) {}

  @Public()
  @Get()
  findAll() {
    return this.quickTasksService.findAll();
  }

  @Public()
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.quickTasksService.findOne(id);
  }

  @Post()
  create(@Request() req, @Body() data: CreateQuickTaskDto) {
    const userId = req.user.userId;
    return this.createQuickTaskService.execute(userId, data);
  }

  @Get("client/:userId")
  findByClient(@Param("userId") userId: string) {
    return this.quickTasksService.findByClient(userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: UpdateQuickTaskDto) {
    return this.quickTasksService.update(id, data);
  }

  @Post(":id/submit")
  submitDeliverable(
    @Request() req,
    @Param("id") id: string,
    @Body() data: SubmitDeliverableDto,
  ) {
    return this.submitDeliverableService.execute(req.user.userId, id, data);
  }

  @Post(":id/approve")
  approveDeliverable(@Request() req, @Param("id") id: string) {
    return this.approveDeliverableService.execute(req.user.userId, id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.removeQuickTaskService.execute(id);
  }

  @Post(":id/cancel")
  cancelTask(@Request() req, @Param("id") id: string) {
    return this.cancelQuickTaskService.execute(id, req.user.userId);
  }
}

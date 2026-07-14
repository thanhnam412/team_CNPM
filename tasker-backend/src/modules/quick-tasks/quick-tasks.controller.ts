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
import { QuickTasksService } from './quick-tasks.service';
import { Public } from "../../decorators/public.decorator";
import {
  CreateQuickTaskDto,
  UpdateQuickTaskDto,
  SubmitDeliverableDto,
} from './dto/quick-tasks.dto';

@Controller("api/quick-tasks")
export class QuickTasksController {
  constructor(private readonly quickTasksService: QuickTasksService) {}

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
    const userId = req.user?.userId;
    if (!userId)
      throw new UnauthorizedException(
        "Cannot create a quick task without being logged in",
      );
    return this.quickTasksService.create(userId, data);
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
    return this.quickTasksService.submitDeliverable(req.user.userId, id, data);
  }

  @Post(":id/approve")
  approveDeliverable(@Request() req, @Param("id") id: string) {
    return this.quickTasksService.approveDeliverable(req.user.userId, id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.quickTasksService.remove(id);
  }
}

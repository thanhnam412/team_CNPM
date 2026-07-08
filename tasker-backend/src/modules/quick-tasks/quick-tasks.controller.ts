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
import { QuickTasksService } from "./quick-tasks.service";
import { Public } from "../auth/decorators/public.decorator";

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
  create(@Body() data: any) {
    return this.quickTasksService.create(data.clientId, data);
  }

  @Get("client/:userId")
  findByClient(@Param("userId") userId: string) {
    return this.quickTasksService.findByClient(userId);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.quickTasksService.update(id, data);
  }


  @Post(":id/submit")
  submitDeliverable(@Request() req, @Param("id") id: string, @Body() data: any) {
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

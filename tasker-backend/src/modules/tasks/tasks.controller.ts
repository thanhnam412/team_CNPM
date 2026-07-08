import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Request,
} from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("api/projects/:projectId/tasks")
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findByProject(@Param("projectId") projectId: string) {
    return this.tasksService.findByProject(projectId);
  }

  @Post()
  create(@Param("projectId") projectId: string, @Body() data: any) {
    return this.tasksService.create(projectId, data);
  }

  @Patch(":id/status")
  updateStatus(
    @Request() req,
    @Param("id") id: string,
    @Body("status") status: string,
  ) {
    return this.tasksService.updateStatus(req.user.userId, id, status);
  }

  @Patch(":id")
  update(@Request() req, @Param("id") id: string, @Body() data: any) {
    return this.tasksService.update(req.user.userId, id, data);
  }

  @Delete(":id")
  remove(@Request() req, @Param("id") id: string) {
    return this.tasksService.remove(req.user.userId, id);
  }
}

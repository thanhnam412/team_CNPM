import { Controller, Get, Post, Body, Param, Patch, Delete } from "@nestjs/common";
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
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.tasksService.updateStatus(id, status as any);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() data: any) {
    return this.tasksService.update(id, data);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.tasksService.remove(id);
  }
}

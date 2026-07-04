import { Controller, Get, Patch, Param, Body } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("api/expert/tasks")
export class ExpertTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllForExpert() {
    return this.tasksService.findAllForExpert();
  }

  // Allow expert to drag-and-drop tasks to update status
  @Patch(":id/status")
  updateStatus(@Param("id") id: string, @Body("status") status: string) {
    return this.tasksService.updateStatus(id, status as any);
  }
}

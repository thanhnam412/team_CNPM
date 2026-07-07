import { Controller, Get, Patch, Param, Body, Req } from "@nestjs/common";
import { TasksService } from "./tasks.service";
import { Request } from "express";

@Controller("api/expert/tasks")
export class ExpertTasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAllForExpert(@Req() req: Request) {
    const user: any = req.user;
    return this.tasksService.findAllForExpert(user.userId);
  }

  // Allow expert to drag-and-drop tasks to update status
  @Patch(":id/status")
  updateStatus(
    @Param("id") id: string,
    @Body("status") status: string,
    @Req() req: Request,
  ) {
    const user: any = req.user;
    return this.tasksService.updateStatus(id, status as any, user.userId);
  }
}

import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { ExpertTasksController } from "./expert-tasks.controller";
import { TasksService } from "./tasks.service";

@Module({
  controllers: [TasksController, ExpertTasksController],
  providers: [TasksService],
})
export class TasksModule {}

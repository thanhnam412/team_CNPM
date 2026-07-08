import { Module } from "@nestjs/common";
import { QuickTasksController } from "./quick-tasks.controller";
import { QuickTasksService } from "./quick-tasks.service";

@Module({
  controllers: [QuickTasksController],
  providers: [QuickTasksService],
  exports: [QuickTasksService], // Export để ProposalsModule inject
})
export class QuickTasksModule {}

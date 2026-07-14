import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database/database.module";
import { QuickTasksController } from "./quick-tasks.controller";
import { QuickTasksService } from "./quick-tasks.service";
import { WalletModule } from "../wallet/wallet.module";
import { CreateQuickTaskService } from "./create/create-quick-task.service";
import { SubmitDeliverableService } from "./submit-deliverable/submit-deliverable.service";
import { ApproveDeliverableService } from "./approve-deliverable/approve-deliverable.service";
import { RemoveQuickTaskService } from "./remove/remove-quick-task.service";
import { CancelQuickTaskService } from "./cancel/cancel-quick-task.service";

@Module({
  imports: [DatabaseModule, WalletModule],
  controllers: [QuickTasksController],
  providers: [
    QuickTasksService,
    CreateQuickTaskService,
    SubmitDeliverableService,
    ApproveDeliverableService,
    RemoveQuickTaskService,
    CancelQuickTaskService,
  ],
  exports: [
    QuickTasksService,
    CreateQuickTaskService,
    SubmitDeliverableService,
    ApproveDeliverableService,
    RemoveQuickTaskService,
    CancelQuickTaskService,
  ],
})
export class QuickTasksModule {}

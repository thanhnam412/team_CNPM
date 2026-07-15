import { Module } from "@nestjs/common";
import { WalletModule } from "../wallet/wallet.module";
import { MilestonesController } from "./milestones.controller";
import { AvailableMilestonesController } from "./available/available-milestones.controller";
import { MilestonesService } from "./milestones.service";
import { ApproveMilestoneService } from "./approve/approve-milestone.service";
import { CancelMilestoneService } from "./cancel/cancel-milestone.service";
import { SubmitDeliverablesService } from "./submit-deliverables/submit-deliverables.service";

@Module({
  imports: [WalletModule],
  controllers: [MilestonesController, AvailableMilestonesController],
  providers: [
    MilestonesService,
    ApproveMilestoneService,
    CancelMilestoneService,
    SubmitDeliverablesService,
  ],
  exports: [MilestonesService],
})
export class MilestonesModule {}

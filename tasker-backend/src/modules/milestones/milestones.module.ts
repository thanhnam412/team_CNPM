import { Module } from "@nestjs/common";
import { MilestonesController } from "./milestones.controller";
import { AvailableMilestonesController } from "./available-milestones.controller";
import { MilestonesService } from "./milestones.service";

@Module({
  controllers: [MilestonesController, AvailableMilestonesController],
  providers: [MilestonesService],
})
export class MilestonesModule {}

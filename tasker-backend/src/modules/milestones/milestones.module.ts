import { Module } from '@nestjs/common';
import { MilestonesController } from './milestones.controller';
import { AvailableMilestonesController } from './available-milestones.controller';
import { MilestonesService } from './milestones.service';
// KHÔNG import ProposalsModule ở đây — tránh circular dependency
// Accept endpoint nằm ở ProposalsController (PATCH /api/proposals/:id/accept)

@Module({
  controllers: [MilestonesController, AvailableMilestonesController],
  providers: [MilestonesService],
  exports: [MilestonesService], // Export để ProposalsModule và ContractsModule dùng
})
export class MilestonesModule {}

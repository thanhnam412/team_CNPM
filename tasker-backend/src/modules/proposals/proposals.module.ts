import { Module } from "@nestjs/common";
import { ProposalsController } from "./proposals.controller";
import { ProposalsService } from './proposals.service';
import { AcceptProposalUseCase } from "./use-cases/accept-proposal-use-cases.service";
import { WalletModule } from "../wallet/wallet.module";
import { MilestonesModule } from "../milestones/milestones.module";
import { QuickTasksModule } from "../quick-tasks/quick-tasks.module";
import { ContractsModule } from "../contracts/contracts.module";
import { DatabaseModule } from "@/database/database.module";

@Module({
  imports: [
    DatabaseModule,
    WalletModule,
    MilestonesModule,
    QuickTasksModule,
    ContractsModule,
  ],
  controllers: [ProposalsController],
  providers: [ProposalsService, AcceptProposalUseCase],
  exports: [ProposalsService],
})
export class ProposalsModule {}

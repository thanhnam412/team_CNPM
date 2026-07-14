import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/database/database.module";
import { ProposalsController } from "./proposals.controller";
import { ProposalsService } from "./proposals.service";
import { AcceptProposalService } from "./accept/accept-proposal.service";
import { CreateProposalService } from "./create/create-proposal.service";
import { UpdateProposalStatusService } from "./update-status/update-proposal-status.service";
import { NegotiateProposalService } from "./negotiate/negotiate-proposal.service";
import { WalletModule } from "@/modules/wallet/wallet.module";
import { MilestonesModule } from "@/modules/milestones/milestones.module";
import { QuickTasksModule } from "@/modules/quick-tasks/quick-tasks.module";
import { ContractsModule } from "@/modules/contracts/contracts.module";

@Module({
  imports: [
    DatabaseModule,
    WalletModule,
    MilestonesModule,
    QuickTasksModule,
    ContractsModule,
  ],
  controllers: [ProposalsController],
  providers: [
    ProposalsService,
    AcceptProposalService,
    CreateProposalService,
    UpdateProposalStatusService,
    NegotiateProposalService,
  ],
  exports: [
    ProposalsService,
    AcceptProposalService,
    CreateProposalService,
    UpdateProposalStatusService,
    NegotiateProposalService,
  ],
})
export class ProposalsModule {}

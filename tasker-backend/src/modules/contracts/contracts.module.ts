import { Module } from "@nestjs/common";
import { ContractsController } from "./contracts.controller";
import { ContractsService } from "./contracts.service";
import { ReleasePaymentUseCase } from "./use-cases/release-payment.use-case";
import { WalletModule } from "../wallet/wallet.module";
import { MilestonesModule } from "../milestones/milestones.module";
import { DatabaseModule } from "../../database/database.module";

@Module({
  imports: [
    DatabaseModule, // Cần cho ReleasePaymentUseCase inject KYSELY_DB
    WalletModule, // Cần WalletService.releaseEscrowToExpert()
    MilestonesModule, // Cần MilestonesService.markAsPaid()
  ],
  controllers: [ContractsController],
  providers: [ContractsService, ReleasePaymentUseCase],
  exports: [ContractsService], // Export để ProposalsModule dùng
})
export class ContractsModule {}

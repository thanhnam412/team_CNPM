import { Module } from "@nestjs/common";
import { ContractsController } from "./contracts.controller";
import { ContractsService } from "./contracts.service";
import { ReleasePaymentService } from "./release/release-payment.service";
import { WalletModule } from "../wallet/wallet.module";
import { MilestonesModule } from "../milestones/milestones.module";
import { DatabaseModule } from "@/database/database.module";

@Module({
  imports: [
    DatabaseModule,
    WalletModule,
    MilestonesModule,
  ],
  controllers: [ContractsController],
  providers: [ContractsService, ReleasePaymentService],
  exports: [ContractsService, ReleasePaymentService],
})
export class ContractsModule {}

import { Module } from "@nestjs/common";
import { FinanceController } from "./finance.controller";
import { FinanceService } from "./finance.service";
import { WalletModule } from "../wallet/wallet.module";

@Module({
  imports: [WalletModule], // Inject WalletService
  controllers: [FinanceController],
  providers: [FinanceService],
})
export class FinanceModule {}

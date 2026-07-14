import { Module } from "@nestjs/common";

import { WalletService } from "./wallet.service";
import { TopupService } from "./topup/topup.service";
import { EscrowService } from "./escrow/escrow.service";
import { ReleaseService } from "./release/release.service";
import { RefundService } from "./refund/refund.service";

@Module({
  providers: [
    WalletService,
    TopupService,
    EscrowService,
    ReleaseService,
    RefundService,
  ],
  exports: [
    WalletService,
    TopupService,
    EscrowService,
    ReleaseService,
    RefundService,
  ],
})
export class WalletModule {}

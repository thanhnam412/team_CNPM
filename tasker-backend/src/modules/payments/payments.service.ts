import { Injectable } from "@nestjs/common";
import { WalletService } from "@/modules/wallet/wallet.service";
import { TopupService } from "../wallet/topup/topup.service";

/**
 * PaymentsService — Facade trên WalletService cho Payments API endpoints.
 *
 * Không còn duplicate logic với FinanceService.
 * Tất cả đều delegate sang WalletService (single source of truth).
 */
@Injectable()
export class PaymentsService {
  constructor(
    private readonly walletService: WalletService,
    private readonly topupService: TopupService,
  ) {}

  getBalance(userId: string) {
    return this.walletService.getWalletByUserId(userId);
  }

  getTransactions(userId: string) {
    return this.walletService.getTransactions(userId);
  }

  mockTopup(userId: string, amount: number) {
    return this.topupService.mockTopup(userId, amount);
  }
}

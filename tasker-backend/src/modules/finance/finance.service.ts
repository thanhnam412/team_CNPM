import { Injectable } from "@nestjs/common";
import { WalletService } from "@/modules/wallet/wallet.service";
import { TopupService } from "../wallet/topup/topup.service";

/**
 * FinanceService — Facade trên WalletService cho Finance API endpoints.
 *
 * KHÔNG tự query wallets hay transactions.
 * Tất cả đều delegate sang WalletService.
 */
@Injectable()
export class FinanceService {
  constructor(
    private readonly walletService: WalletService,
    private readonly topupService: TopupService,
  ) {}

  getWallet(userId: string) {
    return this.walletService.getWalletByUserId(userId);
  }

  getTransactions(userId: string) {
    return this.walletService.getTransactions(userId);
  }

  mockTopup(userId: string, amount: number) {
    return this.topupService.mockTopup(userId, amount);
  }

  mockWithdraw(userId: string, amount: number) {
    return this.topupService.mockWithdraw(userId, amount);
  }
}

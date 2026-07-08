import { Injectable } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

/**
 * PaymentsService — Facade trên WalletService cho Payments API endpoints.
 *
 * Không còn duplicate logic với FinanceService.
 * Tất cả đều delegate sang WalletService (single source of truth).
 */
@Injectable()
export class PaymentsService {
  constructor(private readonly walletService: WalletService) {}

  getBalance(userId: string) {
    return this.walletService.getWalletByUserId(userId);
  }

  getTransactions(userId: string) {
    return this.walletService.getTransactions(userId);
  }

  mockTopup(userId: string, amount: number) {
    return this.walletService.mockTopup(userId, amount);
  }
}

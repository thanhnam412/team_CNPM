import { Injectable } from '@nestjs/common';
import { WalletService } from '../wallet/wallet.service';

/**
 * FinanceService — Facade trên WalletService cho Finance API endpoints.
 *
 * KHÔNG tự query wallets hay transactions.
 * Tất cả đều delegate sang WalletService.
 */
@Injectable()
export class FinanceService {
  constructor(private readonly walletService: WalletService) {}

  getWallet(userId: string) {
    return this.walletService.getOrCreateWallet(userId);
  }

  getTransactions(userId: string) {
    return this.walletService.getTransactions(userId);
  }

  mockTopup(userId: string, amount: number) {
    return this.walletService.mockTopup(userId, amount);
  }
}

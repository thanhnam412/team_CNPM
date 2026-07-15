import api from "./api";
import { TransactionDto, WalletDto } from "@/types/finance.dto";

export const financeService = {
  getWallet: async (userId: string): Promise<WalletDto> => {
    const { data } = await api.get(`/users/${userId}/finance/wallet`);
    return data;
  },
  getTransactions: async (userId: string): Promise<TransactionDto[]> => {
    const { data } = await api.get(`/users/${userId}/finance/transactions`);
    return data;
  },
  mockTopup: async (userId: string, amount: number): Promise<{ success: boolean; newBalance: string | number }> => {
    const { data } = await api.post(`/users/${userId}/finance/mock-topup`, { amount });
    return data;
  },
  mockWithdraw: async (userId: string, amount: number): Promise<{ success: boolean; newBalance: string | number }> => {
    const { data } = await api.post(`/users/${userId}/finance/mock-withdraw`, { amount });
    return data;
  }
};

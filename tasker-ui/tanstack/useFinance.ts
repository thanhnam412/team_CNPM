import { useQuery } from "@tanstack/react-query";
import { financeService } from "@/services/financeService";

export const useTransactions = (userId: string) => {
  return useQuery({
    queryKey: ["finance", "transactions", userId],
    queryFn: () => financeService.getTransactions(userId),
    enabled: !!userId,
  });
};

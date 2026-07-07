import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { financeService } from "@/services/financeService";

export const useWallet = (userId: string) => {
  return useQuery({
    queryKey: ["wallet", userId],
    queryFn: () => financeService.getWallet(userId),
    enabled: !!userId,
  });
};

export const useTransactions = (userId: string) => {
  return useQuery({
    queryKey: ["transactions", userId],
    queryFn: () => financeService.getTransactions(userId),
    enabled: !!userId,
  });
};

export const useMockTopupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, amount }: { userId: string; amount: number }) =>
      financeService.mockTopup(userId, amount),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transactions", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

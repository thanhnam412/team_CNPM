import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contractService } from "@/services/contractService";

export const useContracts = () => {
  return useQuery({
    queryKey: ["contracts"],
    queryFn: () => contractService.getContracts(),
  });
};

export const useContract = (id: string) => {
  return useQuery({
    queryKey: ["contracts", id],
    queryFn: () => contractService.getContract(id),
    enabled: !!id,
  });
};

export const useGenerateContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { proposalId: string }) =>
      contractService.generateContract(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      // Invalidate auth/me to refresh wallet balance and escrow
      queryClient.invalidateQueries({ queryKey: ["me"] });
      // Invalidate quick tasks and proposals
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
    },
  });
};

export const useSignContractMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contractService.signContract(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts", id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["expert-tasks"] });
    },
  });
};

export const useReleaseFundsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => contractService.releaseFunds(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["contracts"] });
      queryClient.invalidateQueries({ queryKey: ["contracts", id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      // Refresh wallet balance
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

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

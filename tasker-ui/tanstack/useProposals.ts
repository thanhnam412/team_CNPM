import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalService } from "@/services/proposalService";
import { ProposalDto } from "@/types/marketplace.dto";

export const useQuickTaskProposals = (quickTaskId: string) => {
  return useQuery({
    queryKey: ["proposals", "quick-task", quickTaskId],
    queryFn: () => proposalService.getProposalsForQuickTask(quickTaskId),
    enabled: !!quickTaskId,
  });
};

export const useUserProposals = (userId: string) => {
  return useQuery({
    queryKey: ["proposals", "user", userId],
    queryFn: () => proposalService.getProposalsForUser(userId),
    enabled: !!userId,
  });
};

export const useSubmitQuickTaskProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ quickTaskId, payload }: { quickTaskId: string; payload: { proposedPrice: string | number; coverLetter?: string } }) =>
      proposalService.submitProposalForQuickTask(quickTaskId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proposals", "quick-task", data.quickTaskId] });
      queryClient.invalidateQueries({ queryKey: ["proposals", "user"] });
    },
  });
};

export const useSubmitMilestoneProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ milestoneId, payload }: { milestoneId: string; payload: { proposedPrice: string | number; coverLetter?: string } }) =>
      proposalService.submitProposalForMilestone(milestoneId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proposals", "milestone", data.milestoneId] });
      queryClient.invalidateQueries({ queryKey: ["proposals", "user"] });
    },
  });
};

export const useUpdateProposalStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ proposalId, status }: { proposalId: string; status: ProposalDto["status"] }) =>
      proposalService.updateProposalStatus(proposalId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      if (data.quickTaskId) {
        queryClient.invalidateQueries({ queryKey: ["quick-tasks", data.quickTaskId] });
      }
    },
  });
};

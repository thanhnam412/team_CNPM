import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { proposalService } from "@/services/proposalService";

export const useTaskProposals = (taskId: string) => {
  return useQuery({
    queryKey: ["proposals", taskId],
    queryFn: () => proposalService.getProposalsForTask(taskId),
    enabled: !!taskId,
  });
};

export const useProjectProposals = (projectId: string) => {
  return useQuery({
    queryKey: ["proposals", "project", projectId],
    queryFn: () => proposalService.getProposalsForProject(projectId),
    enabled: !!projectId,
  });
};

export const useSubmitProposalMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => proposalService.createProposal(data.taskId, data),
    onSuccess: (data) => {
      if (data.taskId) {
        queryClient.invalidateQueries({ queryKey: ["proposals", data.taskId] });
      }
      if (data.projectId) {
        queryClient.invalidateQueries({ queryKey: ["proposals", "project", data.projectId] });
      }
    },
  });
};

export const useUpdateProposalStatusMutation = (proposalId: string, taskId?: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => proposalService.updateProposalStatus(proposalId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposal", proposalId] });
      if (taskId) {
        queryClient.invalidateQueries({ queryKey: ["proposals", taskId] });
        queryClient.invalidateQueries({ queryKey: ["quick-task", taskId] });
      }
    },
  });
};

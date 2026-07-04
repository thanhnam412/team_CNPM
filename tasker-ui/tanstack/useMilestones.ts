import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneService } from "@/services/milestoneService";

export const useMilestones = (projectId: string) => {
  return useQuery({
    queryKey: ["milestones", projectId],
    queryFn: () => milestoneService.getMilestones(projectId),
    enabled: !!projectId,
  });
};

export const useAvailableMilestones = () => {
  return useQuery({
    queryKey: ["available-milestones"],
    queryFn: () => milestoneService.getAvailableMilestones(),
  });
};

export const useRequestRevisionMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) => 
      milestoneService.requestRevision(projectId, id, feedback),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
};

export const useApproveMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => milestoneService.approveMilestone(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
};

export const useDeleteMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => milestoneService.deleteMilestone(projectId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
};

export const useCreateMilestoneMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => milestoneService.createMilestone(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
    },
  });
};

export const useSubmitDeliverablesMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { projectId: string; milestoneId: string; payload: any }) =>
      milestoneService.submitDeliverables(data.projectId, data.milestoneId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expert-tasks"] });
      // Invalidate specific project milestones if we have them
      // queryClient.invalidateQueries({ queryKey: ["milestones"] });
    },
  });
};

export const useBidOnMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { milestoneId: string; payload: any }) =>
      milestoneService.submitBid(data.milestoneId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["available-milestones"] });
    },
  });
};

export const useAcceptBidMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => milestoneService.acceptBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["milestones", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project-finance", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

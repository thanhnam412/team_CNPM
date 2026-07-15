import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { milestoneService } from "@/services/milestoneService";
import { MilestoneDto } from "@/types/project.dto";

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

export const useCreateMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: Partial<MilestoneDto> }) =>
      milestoneService.createMilestone(projectId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

export const useUpdateMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
      data,
    }: {
      projectId: string;
      milestoneId: string;
      data: Partial<MilestoneDto>;
    }) => milestoneService.updateMilestone(projectId, milestoneId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

export const useDeleteMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      milestoneService.deleteMilestone(projectId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

export const useSubmitMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      projectId,
      milestoneId,
      payload,
    }: {
      projectId: string;
      milestoneId: string;
      payload: unknown;
    }) => milestoneService.submitMilestone(projectId, milestoneId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

export const usePayMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      milestoneService.payMilestone(projectId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "finance"] });
    },
  });
};

export const useApproveMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      milestoneService.approveMilestone(projectId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

export const useCancelMilestoneMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, milestoneId }: { projectId: string; milestoneId: string }) =>
      milestoneService.cancelMilestone(projectId, milestoneId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["milestones", variables.projectId] });
    },
  });
};

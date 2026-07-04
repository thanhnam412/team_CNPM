import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quickTaskService } from "@/services/quickTaskService";

export const useQuickTasks = () => {
  return useQuery({
    queryKey: ["quick-tasks"],
    queryFn: () => quickTaskService.getQuickTasks(),
  });
};

export const useClientQuickTasks = (userId: string) => {
  return useQuery({
    queryKey: ["quick-tasks", "client", userId],
    queryFn: () => quickTaskService.getClientQuickTasks(userId),
    enabled: !!userId,
  });
};

export const useQuickTask = (taskId: string) => {
  return useQuery({
    queryKey: ["quick-task", taskId],
    queryFn: () => quickTaskService.getQuickTask(taskId),
    enabled: !!taskId,
  });
};

export const useCreateQuickTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => quickTaskService.createQuickTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useUpdateQuickTaskMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => quickTaskService.updateQuickTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useUpdateQuickTaskStatusMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: string) => quickTaskService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useSubmitDeliverableMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => quickTaskService.submitDeliverable(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-task", taskId] });
    },
  });
};

export const useApproveDeliverableMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => quickTaskService.approveDeliverable(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-task", taskId] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useDeleteQuickTaskMutation = (taskId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => quickTaskService.deleteQuickTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { quickTaskService } from "@/services/quickTaskService";
import { QuickTaskDto } from "@/types/marketplace.dto";

export const useQuickTasks = () => {
  return useQuery({
    queryKey: ["quick-tasks"],
    queryFn: () => quickTaskService.getQuickTasks(),
  });
};

export const useQuickTask = (id: string) => {
  return useQuery({
    queryKey: ["quick-tasks", id],
    queryFn: () => quickTaskService.getQuickTask(id),
    enabled: !!id,
  });
};

export const useClientQuickTasks = (userId: string) => {
  return useQuery({
    queryKey: ["client-quick-tasks", userId],
    queryFn: () => quickTaskService.getClientQuickTasks(userId),
    enabled: !!userId,
  });
};

export const useCreateQuickTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<QuickTaskDto>) => quickTaskService.createQuickTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["client-quick-tasks"] });
    },
  });
};

export const useUpdateQuickTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<QuickTaskDto> }) =>
      quickTaskService.updateQuickTask(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks", data.id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useUpdateQuickTaskStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: QuickTaskDto["status"] }) =>
      quickTaskService.updateQuickTaskStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks", data.id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["client-quick-tasks"] });
    },
  });
};

export const useSubmitQuickTaskDeliverableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { note?: string } }) =>
      quickTaskService.submitDeliverable(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
    },
  });
};

export const useApproveQuickTaskDeliverableMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quickTaskService.approveDeliverable(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useDeleteQuickTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quickTaskService.deleteQuickTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["client-quick-tasks"] });
    },
  });
};

export const useCancelQuickTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => quickTaskService.cancelQuickTask(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["quick-tasks", id] });
      queryClient.invalidateQueries({ queryKey: ["quick-tasks"] });
      queryClient.invalidateQueries({ queryKey: ["client-quick-tasks"] });
    },
  });
};

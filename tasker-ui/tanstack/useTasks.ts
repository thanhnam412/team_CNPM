import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";

export const useTasks = (projectId: string) => {
  return useQuery({
    queryKey: ["tasks", projectId],
    queryFn: () => taskService.getTasks(projectId),
    enabled: !!projectId,
  });
};

export const useExpertTasks = () => {
  return useQuery({
    queryKey: ["expert-tasks"],
    queryFn: () => taskService.getExpertTasks(),
  });
};

export const useExpertUpdateTaskStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, taskId, status }: { projectId: string; taskId: string; status: string }) =>
      taskService.updateTaskStatus(projectId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expert-tasks"] });
    },
  });
};

export const useCreateTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; priority: string; milestoneId?: string }) =>
      taskService.createTask(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useUpdateTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      taskService.updateTask(projectId, taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useUpdateTaskStatusMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: string }) =>
      taskService.updateTaskStatus(projectId, taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

export const useDeleteTaskMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => taskService.deleteTask(projectId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
    },
  });
};

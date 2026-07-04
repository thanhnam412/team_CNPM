import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });
};

export const useProject = (projectId: string) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => projectService.getProject(projectId),
    enabled: !!projectId,
  });
};

export const useProjectFinance = (projectId: string) => {
  return useQuery({
    queryKey: ["project-finance", projectId],
    queryFn: () => projectService.getProjectFinance(projectId),
    enabled: !!projectId,
  });
};

export const useProjectMarketplace = (projectId: string) => {
  return useQuery({
    queryKey: ["project-marketplace", projectId],
    queryFn: () => projectService.getProjectMarketplace(projectId),
    enabled: !!projectId,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProjectMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => projectService.updateProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProjectMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => projectService.deleteProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddProjectFundsMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (amount: number) => projectService.addFunds(projectId, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-finance", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

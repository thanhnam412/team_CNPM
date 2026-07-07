import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { ProjectDto } from "@/types/project.dto";

export const useProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: () => projectService.getProjects(),
  });
};

export const useProject = (id: string) => {
  return useQuery({
    queryKey: ["projects", id],
    queryFn: () => projectService.getProject(id),
    enabled: !!id,
  });
};

export const useProjectFinance = (id: string) => {
  return useQuery({
    queryKey: ["projects", id, "finance"],
    queryFn: () => projectService.getProjectFinance(id),
    enabled: !!id,
  });
};

export const useProjectMarketplace = (id: string) => {
  return useQuery({
    queryKey: ["projects", id, "marketplace"],
    queryFn: () => projectService.getProjectMarketplace(id),
    enabled: !!id,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ProjectDto>) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProjectDto> }) =>
      projectService.updateProject(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", data.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useAddFundsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, amount }: { projectId: string; amount: number }) =>
      projectService.addFunds(projectId, amount),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId] });
      queryClient.invalidateQueries({ queryKey: ["projects", variables.projectId, "finance"] });
    },
  });
};

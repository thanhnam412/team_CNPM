import api from "./api";
import { ProjectDto, ProjectFinanceDto, ProjectMarketplaceDto } from "@/types/project.dto";

export const projectService = {
  getProjects: async (): Promise<ProjectDto[]> => {
    const { data } = await api.get("/projects");
    return data;
  },
  getProject: async (id: string): Promise<ProjectDto> => {
    const { data } = await api.get(`/projects/${id}`);
    return data;
  },
  getProjectFinance: async (id: string): Promise<ProjectFinanceDto> => {
    const { data } = await api.get(`/projects/${id}/finance`);
    return data;
  },
  getProjectMarketplace: async (id: string): Promise<ProjectMarketplaceDto> => {
    const { data } = await api.get(`/projects/${id}/marketplace`);
    return data;
  },
  createProject: async (payload: Partial<ProjectDto>): Promise<ProjectDto> => {
    const { data } = await api.post("/projects", payload);
    return data;
  },
  updateProject: async (id: string, payload: Partial<ProjectDto>): Promise<ProjectDto> => {
    const { data } = await api.patch(`/projects/${id}`, payload);
    return data;
  },
  deleteProject: async (id: string): Promise<unknown> => {
    const { data } = await api.delete(`/projects/${id}`);
    return data;
  },
  addFunds: async (projectId: string, amount: number): Promise<unknown> => {
    const { data } = await api.post(`/projects/${projectId}/finance/add-funds`, { amount });
    return data;
  },
};

import api from "./api";
import { MilestoneDto } from "@/types/project.dto";

export const milestoneService = {
  getMilestones: async (projectId: string): Promise<MilestoneDto[]> => {
    const { data } = await api.get(`/projects/${projectId}/milestones`);
    return data;
  },
  getAvailableMilestones: async (): Promise<MilestoneDto[]> => {
    const { data } = await api.get("/milestones/available");
    return data;
  },
  createMilestone: async (projectId: string, payload: Partial<MilestoneDto>): Promise<MilestoneDto> => {
    const { data } = await api.post(`/projects/${projectId}/milestones`, payload);
    return data;
  },
  updateMilestone: async (
    projectId: string,
    milestoneId: string,
    payload: Partial<MilestoneDto>
  ): Promise<MilestoneDto> => {
    const { data } = await api.patch(`/projects/${projectId}/milestones/${milestoneId}`, payload);
    return data;
  },
  deleteMilestone: async (projectId: string, milestoneId: string): Promise<unknown> => {
    const { data } = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
    return data;
  },
  submitMilestone: async (projectId: string, milestoneId: string, payload: unknown): Promise<unknown> => {
    const { data } = await api.post(`/projects/${projectId}/milestones/${milestoneId}/submit`, payload);
    return data;
  },
  payMilestone: async (projectId: string, milestoneId: string): Promise<MilestoneDto> => {
    const { data } = await api.patch(`/projects/${projectId}/milestones/${milestoneId}/status`, { status: "PAID" });
    return data;
  },
};

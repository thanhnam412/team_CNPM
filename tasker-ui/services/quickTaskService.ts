import api from "./api";
import { QuickTaskDto } from "@/types/marketplace.dto";

export const quickTaskService = {
  getQuickTasks: async (): Promise<QuickTaskDto[]> => {
    const { data } = await api.get("/quick-tasks");
    return data;
  },
  getQuickTask: async (id: string): Promise<QuickTaskDto> => {
    const { data } = await api.get(`/quick-tasks/${id}`);
    return data;
  },
  getClientQuickTasks: async (userId: string): Promise<QuickTaskDto[]> => {
    const { data } = await api.get(`/quick-tasks/client/${userId}`);
    return data;
  },
  createQuickTask: async (payload: Partial<QuickTaskDto>): Promise<QuickTaskDto> => {
    const { data } = await api.post("/quick-tasks", payload);
    return data;
  },
  updateQuickTask: async (id: string, payload: Partial<QuickTaskDto>): Promise<QuickTaskDto> => {
    const { data } = await api.patch(`/quick-tasks/${id}`, payload);
    return data;
  },
  updateQuickTaskStatus: async (
    id: string,
    status: QuickTaskDto["status"]
  ): Promise<QuickTaskDto> => {
    const { data } = await api.patch(`/quick-tasks/${id}/status`, { status });
    return data;
  },
  submitDeliverable: async (id: string, payload: { note?: string }): Promise<unknown> => {
    const { data } = await api.post(`/quick-tasks/${id}/submit`, payload);
    return data;
  },
  approveDeliverable: async (id: string): Promise<unknown> => {
    const { data } = await api.post(`/quick-tasks/${id}/approve`);
    return data;
  },
  deleteQuickTask: async (id: string): Promise<unknown> => {
    const { data } = await api.delete(`/quick-tasks/${id}`);
    return data;
  },
};

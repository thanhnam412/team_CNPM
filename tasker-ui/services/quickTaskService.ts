import api from "./api";

export const quickTaskService = {
  getQuickTasks: async () => {
    const { data } = await api.get("/quick-tasks");
    return data;
  },

  getQuickTask: async (id: string) => {
    const { data } = await api.get(`/quick-tasks/${id}`);
    return data;
  },

  createQuickTask: async (payload: any) => {
    const { data } = await api.post("/quick-tasks", payload);
    return data;
  },

  getClientQuickTasks: async (userId: string) => {
    const { data } = await api.get(`/quick-tasks/client/${userId}`);
    return data;
  },

  updateQuickTask: async (id: string, payload: any) => {
    const { data } = await api.patch(`/quick-tasks/${id}`, payload);
    return data;
  },

  updateTaskStatus: async (id: string, status: string) => {
    const { data } = await api.patch(`/quick-tasks/${id}/status`, { status });
    return data;
  },

  submitDeliverable: async (id: string, payload: any) => {
    const { data } = await api.post(`/quick-tasks/${id}/submit`, payload);
    return data;
  },

  approveDeliverable: async (id: string) => {
    const { data } = await api.post(`/quick-tasks/${id}/approve`);
    return data;
  },

  deleteQuickTask: async (id: string) => {
    const { data } = await api.delete(`/quick-tasks/${id}`);
    return data;
  },
};

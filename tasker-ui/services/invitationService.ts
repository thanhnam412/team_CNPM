import api from "./api";

export const invitationService = {
  create: async (data: any) => {
    const response = await api.post("/invitations", data);
    return response.data;
  },

  findByExpert: async (expertId: string) => {
    const response = await api.get(`/invitations/expert/${expertId}`);
    return response.data;
  },

  findByClient: async (clientId: string) => {
    const response = await api.get(`/invitations/client/${clientId}`);
    return response.data;
  },

  updateStatus: async (id: string, status: "ACCEPTED" | "REJECTED" | "CANCELLED") => {
    const response = await api.patch(`/invitations/${id}/status`, { status });
    return response.data;
  }
};

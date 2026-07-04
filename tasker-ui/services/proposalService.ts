import api from "./api";

export const proposalService = {
  createProposal: async (taskId: string, payload: any) => {
    const { data } = await api.post(`/quick-tasks/${taskId}/proposals`, payload);
    return data;
  },

  getProposalsForTask: async (taskId: string) => {
    const { data } = await api.get(`/quick-tasks/${taskId}/proposals`);
    return data;
  },

  getProposalsForExpert: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}/proposals`);
    return data;
  },

  updateProposalStatus: async (proposalId: string, status: string) => {
    const { data } = await api.patch(`/proposals/${proposalId}/status`, { status });
    return data;
  }
};

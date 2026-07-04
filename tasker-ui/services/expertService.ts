import api from "./api";

export const expertService = {
  getOverview: async (id: string) => {
    const { data } = await api.get(`/experts/${id}/overview`);
    return data;
  },
  getExperts: async (params?: any) => {
    const { data } = await api.get("/experts", { params });
    return data;
  }
};

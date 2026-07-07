import api from "./api";
import { ExpertProfileDto, ExpertOverviewDto, ExpertSearchFilterDto } from "@/types/expert.dto";

export const expertService = {
  getOverview: async (id: string): Promise<ExpertOverviewDto> => {
    const { data } = await api.get(`/experts/${id}/overview`);
    return data;
  },
  getExperts: async (params?: ExpertSearchFilterDto): Promise<ExpertOverviewDto[]> => {
    const { data } = await api.get("/experts", { params });
    return data;
  },
  getExpert: async (id: string): Promise<ExpertOverviewDto> => {
    const { data } = await api.get(`/experts/${id}`);
    return data;
  },
  getMyProfile: async (): Promise<ExpertProfileDto> => {
    const { data } = await api.get("/experts/me");
    return data;
  },
  upsertMyProfile: async (payload: Partial<ExpertProfileDto>): Promise<ExpertProfileDto> => {
    const { data } = await api.post("/experts/me", payload);
    return data;
  }
};

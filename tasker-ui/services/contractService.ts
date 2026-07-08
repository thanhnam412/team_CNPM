import api from "./api";
import { ContractDto } from "@/types/marketplace.dto";

export const contractService = {
  getContracts: async (): Promise<ContractDto[]> => {
    const { data } = await api.get("/contracts");
    return data;
  },

  getContract: async (id: string): Promise<ContractDto> => {
    const { data } = await api.get(`/contracts/${id}`);
    return data;
  },



  releaseFunds: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.post(`/contracts/${id}/release-funds`);
    return data;
  },
};

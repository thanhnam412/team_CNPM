import api from "./api";
import { InvitationDto } from "@/types/marketplace.dto";

export const invitationService = {
  createInvitation: async (data: Partial<InvitationDto>): Promise<InvitationDto> => {
    const response = await api.post("/invitations", data);
    return response.data;
  },
  getExpertInvitations: async (expertId: string): Promise<InvitationDto[]> => {
    const response = await api.get(`/invitations/expert/${expertId}`);
    return response.data;
  },
  getClientInvitations: async (clientId: string): Promise<InvitationDto[]> => {
    const response = await api.get(`/invitations/client/${clientId}`);
    return response.data;
  },
  updateInvitationStatus: async (
    id: string,
    status: InvitationDto["status"]
  ): Promise<InvitationDto> => {
    const response = await api.patch(`/invitations/${id}/status`, { status });
    return response.data;
  }
};

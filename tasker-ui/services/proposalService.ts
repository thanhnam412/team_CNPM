import api from "./api";
import { ProposalDto } from "@/types/marketplace.dto";

export const proposalService = {
  getProposalsForQuickTask: async (quickTaskId: string): Promise<ProposalDto[]> => {
    const { data } = await api.get(`/quick-tasks/${quickTaskId}/proposals`);
    return data;
  },
  getProposalsForUser: async (userId: string): Promise<ProposalDto[]> => {
    const { data } = await api.get(`/users/${userId}/proposals`);
    return data;
  },
  submitProposalForQuickTask: async (
    quickTaskId: string,
    payload: { proposedPrice: string | number; coverLetter?: string }
  ): Promise<ProposalDto> => {
    const { data } = await api.post(`/quick-tasks/${quickTaskId}/proposals`, payload);
    return data;
  },
  submitProposalForMilestone: async (
    milestoneId: string,
    payload: { proposedPrice: string | number; coverLetter?: string }
  ): Promise<ProposalDto> => {
    const { data } = await api.post(`/milestones/${milestoneId}/proposals`, payload);
    return data;
  },
  updateProposalStatus: async (
    proposalId: string,
    status: "REJECTED" | "WITHDRAWN"
  ): Promise<ProposalDto> => {
    const { data } = await api.patch(`/proposals/${proposalId}/status`, { status });
    return data;
  },
  acceptProposal: async (proposalId: string): Promise<ProposalDto> => {
    const { data } = await api.patch(`/proposals/${proposalId}/accept`);
    return data;
  },
};

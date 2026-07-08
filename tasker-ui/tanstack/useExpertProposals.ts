import api from "@/services/api";
import { useQuery } from "@tanstack/react-query";

export interface ExpertProposal {
  id: string;
  quickTaskId: string | null;
  milestoneId: string | null;
  coverLetter: string;
  proposedPrice: string;
  estimatedDays: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
  quickTaskTitle: string | null;
  milestoneTitle: string | null;
  projectTitle: string | null;
  projectId: string | null;
}

export const useExpertProposals = (expertId?: string) => {
  return useQuery({
    queryKey: ["expertProposals", expertId],
    queryFn: async (): Promise<ExpertProposal[]> => {
      if (!expertId) return [];
      const response = await api.get(`/users/${expertId}/proposals`);
      return response.data;
    },
    enabled: !!expertId,
  });
};

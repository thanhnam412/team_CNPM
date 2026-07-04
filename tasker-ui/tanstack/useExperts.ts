import { useQuery } from "@tanstack/react-query";
import { expertService } from "@/services/expertService";

export const useExpertOverview = (expertId: string | undefined) => {
  return useQuery({
    queryKey: ["expert-overview", expertId],
    queryFn: () => expertService.getOverview(expertId!),
    enabled: !!expertId,
  });
};

export const useExpertsList = (params?: any) => {
  return useQuery({
    queryKey: ["experts", params],
    queryFn: () => expertService.getExperts(params),
  });
};

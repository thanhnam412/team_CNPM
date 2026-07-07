import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { expertService } from "@/services/expertService";
import { ExpertSearchFilterDto, ExpertProfileDto } from "@/types/expert.dto";

export const useExperts = (params?: ExpertSearchFilterDto) => {
  return useQuery({
    queryKey: ["experts", params],
    queryFn: () => expertService.getExperts(params),
  });
};

export const useExpert = (id: string) => {
  return useQuery({
    queryKey: ["experts", id],
    queryFn: () => expertService.getExpert(id),
    enabled: !!id,
  });
};

export const useExpertOverview = (id: string) => {
  return useQuery({
    queryKey: ["expert-overview", id],
    queryFn: () => expertService.getOverview(id),
    enabled: !!id,
  });
};

export const useMyExpertProfile = () => {
  return useQuery({
    queryKey: ["my-expert-profile"],
    queryFn: () => expertService.getMyProfile(),
  });
};

export const useUpsertMyExpertProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<ExpertProfileDto>) => expertService.upsertMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-expert-profile"] });
    },
  });
};

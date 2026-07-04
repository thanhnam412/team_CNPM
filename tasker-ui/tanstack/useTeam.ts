import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { teamService } from "@/services/teamService";

export const useTeam = (projectId: string) => {
  return useQuery({
    queryKey: ["team", projectId],
    queryFn: () => teamService.getTeam(projectId),
    enabled: !!projectId,
  });
};

export const useUpdateRoleMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: string }) => 
      teamService.updateRole(projectId, memberId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", projectId] });
    },
  });
};

export const useRemoveMemberMutation = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (memberId: string) => teamService.removeMember(projectId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["team", projectId] });
    },
  });
};

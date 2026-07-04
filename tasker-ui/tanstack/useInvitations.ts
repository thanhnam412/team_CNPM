import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitationService";

export const useExpertInvitations = (expertId: string | undefined) => {
  return useQuery({
    queryKey: ["invitations", "expert", expertId],
    queryFn: () => invitationService.findByExpert(expertId!),
    enabled: !!expertId,
  });
};

export const useClientInvitations = (clientId: string | undefined) => {
  return useQuery({
    queryKey: ["invitations", "client", clientId],
    queryFn: () => invitationService.findByClient(clientId!),
    enabled: !!clientId,
  });
};

export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => invitationService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

export const useUpdateInvitationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "ACCEPTED" | "REJECTED" | "CANCELLED" }) =>
      invitationService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["milestones"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
  });
};

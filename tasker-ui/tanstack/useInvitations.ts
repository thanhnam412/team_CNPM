import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { invitationService } from "@/services/invitationService";
import { InvitationDto } from "@/types/marketplace.dto";

export const useExpertInvitations = (expertId: string) => {
  return useQuery({
    queryKey: ["invitations", "expert", expertId],
    queryFn: () => invitationService.getExpertInvitations(expertId),
    enabled: !!expertId,
  });
};

export const useClientInvitations = (clientId: string) => {
  return useQuery({
    queryKey: ["invitations", "client", clientId],
    queryFn: () => invitationService.getClientInvitations(clientId),
    enabled: !!clientId,
  });
};

export const useCreateInvitationMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<InvitationDto>) => invitationService.createInvitation(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", "client", data.clientId] });
      queryClient.invalidateQueries({ queryKey: ["invitations", "expert", data.expertId] });
    },
  });
};

export const useUpdateInvitationStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: InvitationDto["status"] }) =>
      invitationService.updateInvitationStatus(id, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitations", "client", data.clientId] });
      queryClient.invalidateQueries({ queryKey: ["invitations", "expert", data.expertId] });
    },
  });
};

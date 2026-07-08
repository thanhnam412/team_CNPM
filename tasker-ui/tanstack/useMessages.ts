import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";

export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => messageService.getConversations(userId),
    enabled: !!userId,
  });
};

export const useMessages = (userId: string, conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messageService.getMessages(userId, conversationId),
    enabled: !!conversationId && !!userId,
  });
};

export const useSendMessageMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      conversationId,
      payload,
    }: {
      userId: string;
      conversationId: string;
      payload: { content: string; type?: string; senderId: string };
    }) => messageService.sendMessage(userId, conversationId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["messages", variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

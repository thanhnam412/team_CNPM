import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "@/services/messageService";

export const useConversations = (userId: string) => {
  return useQuery({
    queryKey: ["conversations", userId],
    queryFn: () => messageService.getConversations(userId),
    enabled: !!userId,
  });
};

export const useMessagesWithUser = (userId: string, conversationId: string | null) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messageService.getMessagesWithUser(userId, conversationId!),
    enabled: !!conversationId && !!userId,
  });
};

export const useSendMessageMutation = (userId: string, conversationId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      messageService.sendMessage(userId, conversationId!, {
        content,
        type: "TEXT",
      }),
    onMutate: async (newContent) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: ["messages", conversationId] });
      const previousMessages = queryClient.getQueryData(["messages", conversationId]);
      
      const optimisticMsg = {
        id: `temp-${Date.now()}`,
        content: newContent,
        type: "TEXT",
        senderId: userId,
        createdAt: new Date().toISOString(),
        sender: { name: "You" },
      };

      queryClient.setQueryData(["messages", conversationId], (old: any) => [...(old || []), optimisticMsg]);
      return { previousMessages };
    },
    onError: (err, newContent, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData(["messages", conversationId], context.previousMessages);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", conversationId] });
    },
  });
};

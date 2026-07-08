import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

export const useCopilotChatMutation = () => {
  return useMutation({
    mutationFn: async (message: string) => {
      const { data } = await api.post("/copilot/chat", { message });
      return data;
    },
  });
};

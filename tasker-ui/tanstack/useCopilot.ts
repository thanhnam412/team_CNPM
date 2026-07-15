import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";

export const useCopilotChatMutation = () => {
  return useMutation({
    mutationFn: async (payload: { message: string, history: any[] }) => {
      const { data } = await api.post("/copilot/chat", payload);
      return data;
    },
  });
};

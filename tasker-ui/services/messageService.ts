import api from "./api";

// We don't have a strict message.dto.ts yet, so using inline types for now or any
export interface ConversationDto {
  id: string;
  name: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt?: string;
  isGroup?: boolean;
  online?: boolean;
  contextType?: string;
  contextName?: string;
  contextRef?: string;
  details?: {
    budget?: string;
    deadline?: string;
    status?: string;
  };
  messages?: unknown[];
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string;
  createdAt: string;
}

export const messageService = {
  getConversations: async (userId: string): Promise<ConversationDto[]> => {
    const { data } = await api.get(`/users/${userId}/conversations`);
    return data;
  },
  getMessages: async (userId: string, conversationId: string): Promise<MessageDto[]> => {
    const { data } = await api.get(`/users/${userId}/conversations/${conversationId}/messages`);
    return data;
  },
  sendMessage: async (
    userId: string,
    conversationId: string,
    payload: { content: string; type?: string; senderId: string }
  ): Promise<MessageDto> => {
    const { data } = await api.post(`/users/${userId}/conversations/${conversationId}/messages`, payload);
    return data;
  }
};

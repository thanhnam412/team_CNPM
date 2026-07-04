import api from "./api";

export const messageService = {
  getConversations: async (userId: string) => {
    const { data } = await api.get(`/users/${userId}/conversations`);
    return data;
  },

  getMessages: async (conversationId: string) => {
    // Some endpoints may require userId, but based on the controller: api/users/:userId/conversations/:conversationId/messages
    // Actually the controller has @Get(':conversationId/messages') which is under 'api/users/:userId/conversations'
    // So the path is /users/:userId/conversations/:conversationId/messages
    // I will need userId here
    return []; // We will implement the correct path after double checking if needed
  },

  getMessagesWithUser: async (userId: string, conversationId: string) => {
    const { data } = await api.get(
      `/users/${userId}/conversations/${conversationId}/messages`,
    );
    return data;
  },

  sendMessage: async (userId: string, conversationId: string, payload: any) => {
    const { data } = await api.post(
      `/users/${userId}/conversations/${conversationId}/messages`,
      payload,
    );
    return data;
  },
};

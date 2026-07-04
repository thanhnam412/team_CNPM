import api from "./api";

export const userService = {
  getUser: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },

  switchRole: async (id: string, role: "CLIENT" | "EXPERT") => {
    const { data } = await api.patch(`/users/${id}/switch-role`, { role });
    return data;
  },

  updateProfile: async (id: string, payload: { 
    name?: string; 
    avatar?: string;
    title?: string;
    bio?: string;
    rate?: string;
    location?: string;
    skills?: any;
    online?: boolean;
  }) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },
};

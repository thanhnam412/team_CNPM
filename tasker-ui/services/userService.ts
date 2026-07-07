import api from "./api";
import { UserDto, MeProfileDto } from "@/types/user.dto";

export const userService = {
  getUser: async (id: string): Promise<UserDto> => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  getMe: async (): Promise<MeProfileDto> => {
    const { data } = await api.get(`/me`);
    return data;
  },
  updateUser: async (id: string, payload: Partial<UserDto>): Promise<UserDto> => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },
  switchRole: async (id: string, role: UserDto["currentRole"]): Promise<UserDto> => {
    const { data } = await api.patch(`/users/${id}/switch-role`, { role });
    return data;
  }
};

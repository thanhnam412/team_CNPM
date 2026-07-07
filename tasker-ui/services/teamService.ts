import api from "./api";
import { UserDto } from "@/types/user.dto";

export interface ProjectMemberDto {
  id: string;
  userId: string;
  role: string;
  status: string;
  rating: number | null;
  name?: string;
  email?: string;
  avatar?: string | null;
}

export const teamService = {
  getTeamMembers: async (projectId: string): Promise<ProjectMemberDto[]> => {
    const { data } = await api.get(`/projects/${projectId}/team`);
    return data;
  },
  updateMemberRole: async (projectId: string, memberId: string, role: string): Promise<ProjectMemberDto> => {
    const { data } = await api.patch(`/projects/${projectId}/team/${memberId}`, { role });
    return data;
  },
  removeMember: async (projectId: string, memberId: string): Promise<unknown> => {
    const { data } = await api.delete(`/projects/${projectId}/team/${memberId}`);
    return data;
  },
};

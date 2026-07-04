import api from './api';

export interface TeamMember {
  id: string;
  projectId: string;
  userId: string;
  role: 'Client Admin' | 'Internal Team' | 'Expert';
  status: 'Active' | 'Pending';
  rating: number | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  email: string;
  avatar: string;
}

export const teamService = {
  getTeam: async (projectId: string): Promise<TeamMember[]> => {
    const response = await api.get(`/projects/${projectId}/team`);
    return response.data.map((m: any) => {
      const roleStr = m.role === 'CLIENT_ADMIN' ? 'Client Admin' : (m.role === 'INTERNAL_TEAM' ? 'Internal Team' : 'Expert');
      return {
        ...m,
        name: m.user?.name || 'Unknown',
        email: m.user?.email || 'N/A',
        avatar: (m.user?.name || 'U').charAt(0),
        role: roleStr,
        status: m.status === 'ACTIVE' ? 'Active' : 'Pending',
        rating: m.rating || null
      };
    });
  },
  updateRole: async (projectId: string, memberId: string, role: string) => {
    const response = await api.patch(`/projects/${projectId}/team/${memberId}`, { role });
    return response.data;
  },
  removeMember: async (projectId: string, memberId: string) => {
    const response = await api.delete(`/projects/${projectId}/team/${memberId}`);
    return response.data;
  },
};

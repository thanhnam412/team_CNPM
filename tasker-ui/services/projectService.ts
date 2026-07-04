import api from './api';

export interface Project {
  id: string;
  title: string;
  description: string | null;
  budget: string | number;
  spent: string | number;
  escrow: string | number;
  createdAt: string;
  updatedAt: string;
  // Computed fields from backend or mapped in frontend
  status?: string;
  statusColor?: string;
  progress?: number;
  deadline?: string;
  expert?: string;
  milestones?: { completed: number; total: number };
  proposals?: number;
}

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    const response = await api.get('/projects');
    return response.data.map((p: any) => ({
      ...p,
      desc: p.description || "No description provided",
      status: p.status || "Open",
      statusColor: p.statusColor || "bg-blue-500/10 text-blue-600 border-blue-500", // Default
      progress: p.progress || 0,
      deadline: p.deadline || "TBD",
      expert: p.expert || null,
      milestones: p.milestones || { completed: 0, total: 0 },
      proposals: p.proposals || 0,
      budget: `$${Number(p.budget || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      spent: `$${Number(p.spent || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      escrow: `$${Number(p.escrow || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
    }));
  },
  getProject: async (id: string): Promise<Project> => {
    const response = await api.get(`/projects/${id}`);
    const p = response.data;
    return {
      ...p,
      desc: p.description || "No description provided",
      status: p.status || "Open",
      statusColor: p.statusColor || "bg-blue-500/10 text-blue-600 border-blue-500",
      progress: p.stats?.completion || 0,
      deadline: p.deadline || "TBD",
      expert: p.expert || null,
      milestones: p.upcomingMilestones || [],
      proposals: p.proposals || 0,
      budget: `$${Number(p.budget || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      spent: `$${Number(p.spent || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      escrow: `$${Number(p.escrow || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`,
      stats: p.stats || { completion: 0, activeTasks: 0, totalMembers: 0, expertMembers: 0 }
    };
  },
  getProjectFinance: async (id: string) => {
    const response = await api.get(`/projects/${id}/finance`);
    return response.data;
  },
  getProjectMarketplace: async (id: string) => {
    const response = await api.get(`/projects/${id}/marketplace`);
    return response.data;
  },
  createProject: async (data: any) => {
    const response = await api.post("/projects", data);
    return response.data;
  },
  addFunds: async (projectId: string, amount: number) => {
    const response = await api.post(`/projects/${projectId}/finance/add-funds`, { amount });
    return response.data;
  },
  updateProject: async (id: string, data: any) => {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  }
};

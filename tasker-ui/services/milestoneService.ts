import api from './api';

export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  amount: string | number;
  status: 'PENDING' | 'ACTIVE' | 'REVIEW' | 'PAID';
  dueDate: string | null;
  progress: number;
  deliverables: any;
  createdAt: string;
  updatedAt: string;
}

export const milestoneService = {
  getMilestones: async (projectId: string): Promise<Milestone[]> => {
    const response = await api.get(`/projects/${projectId}/milestones`);
    return response.data.map((m: any) => ({
      ...m,
      amount: `$${m.amount || 0}`,
      status: (m.status || 'PENDING').toLowerCase(),
      dueDate: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : 'TBD',
      progress: m.progress || 0,
      deliverables: m.deliverables || []
    }));
  },

  getAvailableMilestones: async (): Promise<any[]> => {
    const response = await api.get('/milestones/available');
    return response.data;
  },
  
  updateMilestone: async (projectId: string, milestoneId: string, data: any): Promise<any> => {
    const response = await api.patch(`/projects/${projectId}/milestones/${milestoneId}`, data);
    return response.data;
  },
  
  approveMilestone: async (projectId: string, milestoneId: string): Promise<any> => {
    const response = await api.patch(`/projects/${projectId}/milestones/${milestoneId}/status`, { status: "PAID" });
    return response.data;
  },
  
  submitDeliverables: async (projectId: string, milestoneId: string, data: any): Promise<any> => {
    const response = await api.post(`/projects/${projectId}/milestones/${milestoneId}/submit`, data);
    return response.data;
  },

  requestRevision: async (projectId: string, milestoneId: string, feedback: string): Promise<any> => {
    // Currently no specific endpoint for requesting revision, maybe handled via chat or milestone status
    // Here we will just resolve for UI purposes until backend supports it
    return new Promise((resolve) => setTimeout(() => resolve({ success: true, feedback }), 1000));
  },

  createMilestone: async (projectId: string, data: any): Promise<any> => {
    const response = await api.post(`/projects/${projectId}/milestones`, data);
    return response.data;
  },

  deleteMilestone: async (projectId: string, milestoneId: string): Promise<any> => {
    const response = await api.delete(`/projects/${projectId}/milestones/${milestoneId}`);
    return response.data;
  },

  submitBid: async (milestoneId: string, data: any): Promise<any> => {
    const response = await api.post(`/projects/000/milestones/${milestoneId}/bids`, data); // Note: projectId doesn't matter for the new controller routes if we hit them directly, but the controller is bound to /api/projects/:projectId/milestones
    return response.data;
  },

  acceptBid: async (bidId: string): Promise<any> => {
    const response = await api.post(`/projects/000/milestones/bids/${bidId}/accept`);
    return response.data;
  }
};

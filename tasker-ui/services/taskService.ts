import api from './api';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH';
  assigneeId: string | null;
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  milestoneId?: string | null;
  milestone?: {
    title: string;
  } | null;
  client?: string;
}

export const taskService = {
  getTasks: async (projectId: string): Promise<Task[]> => {
    const response = await api.get(`/projects/${projectId}/tasks`);
    return response.data.map((t: any) => ({
      ...t,
      status: (t.status || 'TODO').toLowerCase().replace('_', '-'),
      priority: (t.priority || 'MEDIUM').toLowerCase(),
      assignee: t.assignee?.name || null,
      milestoneId: t.milestoneId || null,
      milestone: t.milestone || null
    }));
  },
  getExpertTasks: async (): Promise<Task[]> => {
    const response = await api.get(`/expert/tasks`);
    return response.data.map((t: any) => ({
      ...t,
      status: (t.status || 'TODO').toLowerCase().replace('_', '-'),
      priority: (t.priority || 'MEDIUM').toLowerCase(),
      assignee: t.assignee?.name || null,
      milestoneId: t.milestoneId || null,
      milestone: t.milestoneName ? { title: t.milestoneName } : null,
      client: t.projectName || "Unknown Client"
    }));
  },
  updateTaskStatus: async (projectId: string, taskId: string, status: string) => {
    const uppercaseStatus = status.toUpperCase().replace('-', '_');
    const response = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status: uppercaseStatus });
    return response.data;
  },
  createTask: async (projectId: string, data: { title: string; priority: string; milestoneId?: string | null }) => {
    const payload = { ...data, priority: data.priority.toUpperCase() };
    if (payload.milestoneId === "") payload.milestoneId = null;
    const response = await api.post(`/projects/${projectId}/tasks`, payload);
    return response.data;
  },
  updateTask: async (projectId: string, taskId: string, data: any) => {
    const payload = { ...data };
    if (payload.priority) {
      payload.priority = payload.priority.toUpperCase();
    }
    if (payload.milestoneId === "") payload.milestoneId = null;
    const response = await api.patch(`/projects/${projectId}/tasks/${taskId}`, payload);
    return response.data;
  },
  deleteTask: async (projectId: string, taskId: string) => {
    const response = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return response.data;
  },
};

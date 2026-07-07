import api from "./api";
import { TaskDto } from "@/types/project.dto";

export const taskService = {
  getTasks: async (projectId: string): Promise<TaskDto[]> => {
    const { data } = await api.get(`/projects/${projectId}/tasks`);
    return data;
  },
  getExpertTasks: async (): Promise<TaskDto[]> => {
    const { data } = await api.get(`/expert/tasks`);
    return data;
  },
  updateTaskStatus: async (projectId: string, taskId: string, status: string): Promise<TaskDto> => {
    const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}/status`, { status });
    return data;
  },
  createTask: async (projectId: string, payload: Partial<TaskDto>): Promise<TaskDto> => {
    const { data } = await api.post(`/projects/${projectId}/tasks`, payload);
    return data;
  },
  updateTask: async (projectId: string, taskId: string, payload: Partial<TaskDto>): Promise<TaskDto> => {
    const { data } = await api.patch(`/projects/${projectId}/tasks/${taskId}`, payload);
    return data;
  },
  deleteTask: async (projectId: string, taskId: string): Promise<unknown> => {
    const { data } = await api.delete(`/projects/${projectId}/tasks/${taskId}`);
    return data;
  },
};

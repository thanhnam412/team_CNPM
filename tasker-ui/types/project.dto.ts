export interface ProjectDto {
  id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  industry: string | null;
  category?: string | null;
  technicalScope?: string | null;
  type?: string | null;
  duration?: string | null;
  commitment?: string | null;
  tags: string | string[] | null;
  attachmentsCount: number;
  links: string | string[] | null;
  startDate: string | null;
  endDate: string | null;
  status: string;
  budget: string | number;
  spent: string | number;
  escrow: string | number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDto {
  id: string;
  projectId: string;
  milestoneId: string | null;
  title: string;
  status: "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  comments: number;
  attachments: number;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
  milestone?: {
    title: string;
  } | null;
  client?: string;
}

export interface MilestoneDto {
  id: string;
  projectId: string;
  assigneeId: string | null;
  title: string;
  description: string | null;
  budget: string | number;
  status: "PENDING" | "ACTIVE" | "REVIEW" | "PAID";
  createdAt: string;
  updatedAt: string;
  endDate?: string;
  assignee?: {
    id: string;
    name: string;
    avatar: string | null;
  } | null;
}

export interface ProjectFinanceDto {
  budget: string | number;
  escrow: string | number;
  spent: string | number;
  transactions: unknown[];
}

export interface ProjectMarketplaceDto {
  outsourcedTasks: unknown[];
}

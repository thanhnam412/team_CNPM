export interface QuickTaskDto {
  id: string;
  clientId: string;
  expertId: string | null;
  title: string;
  description: string | null;
  budget: string | number;
  status: "OPEN" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "CANCELLED";
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  proposals?: unknown[];
  client?: {
    id: string;
    name: string;
    avatar: string | null;
  };
  expert?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ProposalDto {
  id: string;
  expertId: string;
  milestoneId: string | null;
  quickTaskId: string | null;
  amount: string | number;
  message: string | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";
  createdAt: string;
  updatedAt: string;
  expert?: {
    id: string;
    name: string;
    avatar: string | null;
    title: string | null;
  };
  client?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface InvitationDto {
  id: string;
  clientId: string;
  expertId: string;
  projectId: string | null;
  quickTaskId: string | null;
  milestoneId: string | null;
  message: string | null;
  budget: string | number | null;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  expert?: {
    id: string;
    name: string;
    avatar: string | null;
    title: string | null;
  };
  client?: {
    id: string;
    name: string;
    avatar: string | null;
  };
}

export interface ContractDto {
  id: string;
  projectId: string | null;
  milestoneId: string | null;
  quickTaskId: string | null;
  clientId: string;
  expertId: string;
  agreedPrice: string | number;
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  escrowStatus: "PENDING" | "HELD" | "RELEASED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
}

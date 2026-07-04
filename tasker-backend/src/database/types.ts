import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
    CLIENT: "CLIENT",
    EXPERT: "EXPERT",
    ADMIN: "ADMIN"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const QuickTaskStatus = {
    OPEN: "OPEN",
    IN_PROGRESS: "IN_PROGRESS",
    REVIEW: "REVIEW",
    COMPLETED: "COMPLETED"
} as const;
export type QuickTaskStatus = (typeof QuickTaskStatus)[keyof typeof QuickTaskStatus];
export const ProposalStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    WITHDRAWN: "WITHDRAWN"
} as const;
export type ProposalStatus = (typeof ProposalStatus)[keyof typeof ProposalStatus];
export const InvitationStatus = {
    PENDING: "PENDING",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    CANCELLED: "CANCELLED"
} as const;
export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus];
export const ConversationContextType = {
    QUICK_TASK: "QUICK_TASK",
    PROJECT: "PROJECT",
    DIRECT: "DIRECT"
} as const;
export type ConversationContextType = (typeof ConversationContextType)[keyof typeof ConversationContextType];
export const MessageType = {
    TEXT: "TEXT",
    CODE: "CODE",
    FILE: "FILE",
    SYSTEM: "SYSTEM"
} as const;
export type MessageType = (typeof MessageType)[keyof typeof MessageType];
export const TransactionType = {
    DEPOSIT: "DEPOSIT",
    ESCROW: "ESCROW",
    SPENT: "SPENT",
    FEE: "FEE",
    REFUND: "REFUND",
    PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
    WITHDRAWAL: "WITHDRAWAL"
} as const;
export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];
export const ProjectRole = {
    CLIENT_ADMIN: "CLIENT_ADMIN",
    INTERNAL_TEAM: "INTERNAL_TEAM",
    EXPERT: "EXPERT"
} as const;
export type ProjectRole = (typeof ProjectRole)[keyof typeof ProjectRole];
export const TaskStatus = {
    TODO: "TODO",
    IN_PROGRESS: "IN_PROGRESS",
    REVIEW: "REVIEW",
    DONE: "DONE"
} as const;
export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus];
export const TaskPriority = {
    LOW: "LOW",
    MEDIUM: "MEDIUM",
    HIGH: "HIGH"
} as const;
export type TaskPriority = (typeof TaskPriority)[keyof typeof TaskPriority];
export const MilestoneStatus = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    REVIEW: "REVIEW",
    PAID: "PAID"
} as const;
export type MilestoneStatus = (typeof MilestoneStatus)[keyof typeof MilestoneStatus];
export type Bid = {
    id: string;
    milestoneId: string;
    expertId: string;
    coverLetter: string;
    amount: string;
    contractType: string | null;
    status: Generated<ProposalStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Conversation = {
    id: string;
    name: string | null;
    isGroup: Generated<boolean>;
    contextType: Generated<ConversationContextType>;
    contextRef: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ConversationParticipant = {
    id: string;
    conversationId: string;
    userId: string;
    joinedAt: Generated<Timestamp>;
};
export type Invitation = {
    id: string;
    clientId: string;
    expertId: string;
    projectId: string | null;
    taskId: string | null;
    milestoneId: string | null;
    message: string | null;
    budget: string | null;
    status: Generated<InvitationStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Message = {
    id: string;
    conversationId: string;
    senderId: string | null;
    type: Generated<MessageType>;
    content: string;
    metadata: unknown | null;
    createdAt: Generated<Timestamp>;
};
export type Milestone = {
    id: string;
    projectId: string;
    title: string;
    amount: Generated<string>;
    status: Generated<MilestoneStatus>;
    progress: Generated<number>;
    dueDate: Timestamp | null;
    deliverables: unknown | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Project = {
    id: string;
    title: string;
    description: string | null;
    budget: Generated<string>;
    spent: Generated<string>;
    escrow: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ProjectMember = {
    id: string;
    projectId: string;
    userId: string;
    role: Generated<ProjectRole>;
    status: Generated<string>;
    rating: number | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Proposal = {
    id: string;
    quickTaskId: string;
    expertId: string;
    coverLetter: string;
    proposedPrice: string;
    estimatedDays: number;
    status: Generated<ProposalStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type QuickTask = {
    id: string;
    clientId: string;
    expertId: string | null;
    title: string;
    description: string;
    status: Generated<QuickTaskStatus>;
    budget: Generated<string>;
    deadline: Timestamp | null;
    proposalsCount: Generated<number>;
    projectId: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type RefreshToken = {
    id: string;
    token: string;
    userId: string;
    device: string | null;
    expiresAt: Timestamp;
    createdAt: Generated<Timestamp>;
};
export type Review = {
    id: string;
    reviewerId: string;
    expertId: string;
    rating: number;
    feedback: string | null;
    taskTitle: string | null;
    createdAt: Generated<Timestamp>;
};
export type Task = {
    id: string;
    projectId: string;
    title: string;
    status: Generated<TaskStatus>;
    priority: Generated<TaskPriority>;
    assigneeId: string | null;
    comments: Generated<number>;
    attachments: Generated<number>;
    milestoneId: string | null;
    bucket: string | null;
    isOutsource: Generated<boolean>;
    budget: Generated<string>;
    quickTaskId: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Transaction = {
    id: string;
    userId: string;
    date: Generated<Timestamp>;
    desc: string;
    type: TransactionType;
    amount: string;
    balanceAfter: string;
    status: Generated<string>;
    source: string | null;
    projectId: string | null;
    createdAt: Generated<Timestamp>;
};
export type User = {
    id: string;
    googleId: string;
    email: string;
    name: string;
    avatar: string | null;
    role: Generated<Role>;
    currentRole: Generated<Role>;
    balance: Generated<string>;
    title: string | null;
    bio: string | null;
    skills: unknown | null;
    rate: string | null;
    location: string | null;
    badge: string | null;
    online: Generated<boolean>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    bids: Bid;
    conversation_participants: ConversationParticipant;
    conversations: Conversation;
    invitations: Invitation;
    messages: Message;
    milestones: Milestone;
    project_members: ProjectMember;
    projects: Project;
    proposals: Proposal;
    quick_tasks: QuickTask;
    refresh_tokens: RefreshToken;
    reviews: Review;
    tasks: Task;
    transactions: Transaction;
    users: User;
};

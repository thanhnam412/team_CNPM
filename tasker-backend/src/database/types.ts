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
    COMPLETED: "COMPLETED",
    DISPUTE: "DISPUTE",
    SYSTEM_RESOLVING: "SYSTEM_RESOLVING"
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
export const PaymentStatus = {
    PENDING: "PENDING",
    COMPLETED: "COMPLETED",
    FAILED: "FAILED",
    REFUNDED: "REFUNDED"
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
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
export type ClientProfile = {
    id: string;
    userId: string;
    companyName: string | null;
    companyWebsite: string | null;
    industry: string | null;
    totalSpent: Generated<string>;
    completedTasksCount: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Contract = {
    id: string;
    quickTaskId: string | null;
    milestoneId: string | null;
    expertId: string;
    clientId: string;
    agreedPrice: string;
    escrowStatus: Generated<string>;
    deadline: Timestamp | null;
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
export type ExpertProfile = {
    id: string;
    userId: string;
    title: string | null;
    bio: string | null;
    skills: unknown | null;
    hourlyRate: Generated<string>;
    experienceYears: Generated<number>;
    portfolioUrl: string | null;
    rating: Generated<string>;
    status: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Invitation = {
    id: string;
    clientId: string;
    expertId: string;
    projectId: string | null;
    quickTaskId: string | null;
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
    assigneeId: string | null;
    title: string;
    description: string | null;
    budget: Generated<string>;
    status: Generated<MilestoneStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Payment = {
    id: string;
    contractId: string | null;
    taskId: string | null;
    expertId: string;
    clientId: string;
    amount: string;
    fee: Generated<string>;
    amountReceived: string;
    status: Generated<PaymentStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Project = {
    id: string;
    title: string;
    description: string | null;
    requirements: string | null;
    industry: string | null;
    tags: unknown | null;
    attachmentsCount: Generated<number>;
    links: unknown | null;
    startDate: Timestamp | null;
    endDate: Timestamp | null;
    status: Generated<string>;
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
    quickTaskId: string | null;
    milestoneId: string | null;
    expertId: string;
    coverLetter: string;
    proposedPrice: string;
    estimatedDays: number;
    status: Generated<ProposalStatus>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type ProposalNegotiation = {
    id: string;
    proposalId: string;
    actorId: string;
    actorRole: string;
    offeredPrice: string;
    status: Generated<string>;
    createdAt: Generated<Timestamp>;
};
export type QuickTask = {
    id: string;
    clientId: string;
    expertId: string | null;
    title: string;
    description: string;
    requirements: string | null;
    tags: unknown | null;
    attachments: unknown | null;
    status: Generated<QuickTaskStatus>;
    budget: Generated<string>;
    deadline: Timestamp | null;
    proposalsCount: Generated<number>;
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
export type Task = {
    id: string;
    projectId: string;
    milestoneId: string | null;
    title: string;
    status: Generated<TaskStatus>;
    priority: Generated<TaskPriority>;
    assigneeId: string | null;
    comments: Generated<number>;
    attachments: Generated<number>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type Transaction = {
    id: string;
    paymentId: string | null;
    userId: string;
    amount: string;
    date: Generated<Timestamp>;
    desc: string | null;
    type: TransactionType;
    balanceAfter: string;
    status: string;
    source: string;
    projectId: string | null;
    createdAt: Generated<Timestamp>;
};
export type User = {
    id: string;
    googleId: string;
    email: string;
    name: string;
    avatar: string | null;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
    currentRole: Generated<Role>;
    location: string | null;
    online: Generated<boolean>;
};
export type Wallet = {
    id: string;
    userId: string;
    balance: Generated<string>;
    escrowBalance: Generated<string>;
    currency: Generated<string>;
    status: Generated<string>;
    createdAt: Generated<Timestamp>;
    updatedAt: Timestamp;
};
export type DB = {
    client_profiles: ClientProfile;
    contracts: Contract;
    conversation_participants: ConversationParticipant;
    conversations: Conversation;
    expert_profiles: ExpertProfile;
    invitations: Invitation;
    messages: Message;
    milestones: Milestone;
    payments: Payment;
    project_members: ProjectMember;
    projects: Project;
    proposal_negotiations: ProposalNegotiation;
    proposals: Proposal;
    quick_tasks: QuickTask;
    refresh_tokens: RefreshToken;
    tasks: Task;
    transactions: Transaction;
    users: User;
    wallets: Wallet;
};

export type Role = "client" | "expert" | "enterprise" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  title: string;
  verified?: boolean;
  trustScore?: number;
  company?: string;
  enterpriseId?: string;
  password?: string;
  blocked?: boolean;
  createdAt?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  hourlyRate?: number;
  walletBalance?: number;
  totalEarnings?: number;
  portfolioUrls?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  language?: string;
  phone?: string;
};

export type JobStatus = "draft" | "pending_approval" | "open" | "matching" | "contracting" | "active" | "completed" | "rejected" | "disputed";
export type Job = {
  id: string;
  title: string;
  clientId: string;
  enterpriseId?: string;
  category: string;
  budget: number;
  duration: string;
  level: "Starter" | "Pro" | "Enterprise";
  status: JobStatus;
  description: string;
  skills: string[];
  proposals: string[];
  createdAt: string;
  aiBrief: string;
  approvedBy?: string;
  approvalNote?: string;
  currency?: string;
  isRemote?: boolean;
  location?: string;
};

export type ProposalStatus = "sent" | "shortlisted" | "rejected" | "accepted";
export type Proposal = {
  id: string;
  jobId: string;
  expertId: string;
  rate: number;
  coverLetter: string;
  status: ProposalStatus;
  score: number;
  eta: string;
  createdAt?: string;
};

export type MilestoneStatus = "planned" | "pending" | "in_progress" | "submitted" | "change_requested" | "approved" | "paid";
export type Milestone = {
  id: string;
  contractId: string;
  title: string;
  amount: number;
  dueDate: string;
  status: MilestoneStatus;
  deliverable?: string;
  privateNote?: string;
  changeRequest?: string;
  paidAt?: string;
};

export type ContractStatus = "active" | "review" | "disputed" | "completed" | "cancelled";
export type Contract = {
  id: string;
  jobId: string;
  proposalId?: string;
  clientId: string;
  expertId: string;
  title: string;
  status: ContractStatus;
  escrow: number;
  progress: number;
  privacy: "standard" | "private_delivery";
  startedAt: string;
  completedAt?: string;
  endDate?: string;
};

export type Message = {
  id: string;
  contractId: string;
  senderId: string;
  body: string;
  kind: "text" | "code" | "file" | "ai" | "warning";
  createdAt: string;
};

export type TransactionType = "escrow" | "release" | "withdraw" | "withdrawal" | "refund" | "fee";
export type Transaction = {
  id: string;
  userId: string;
  contractId?: string;
  milestoneId?: string;
  type: TransactionType;
  amount: number;
  status: "pending" | "success" | "failed";
  createdAt: string;
  note?: string;
};

export type DisputeStatus = "collecting_evidence" | "mediation" | "decision" | "enforced";
export type Dispute = {
  id: string;
  contractId: string;
  openedBy: string;
  reason: string;
  evidence: string[];
  status: DisputeStatus;
  decision?: string;
};

export type Notification = {
  id: string;
  userId: string;
  title: string;
  body: string;
  tone: "info" | "success" | "warning" | "danger";
  read: boolean;
  createdAt: string;
  link?: string;
  entityType?: string;
  entityId?: string;
};

export type Review = {
  id: string;
  contractId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  body: string;
  reply?: string;
  createdAt?: string;
  communicationRating?: number;
  qualityRating?: number;
  timelinessRating?: number;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  priceFrom: number;
  delivery: string;
  tags: string[];
  expertId: string;
};

export type AuditLog = {
  id: string;
  actorId: string;
  action: string;
  targetId?: string;
  metadata?: string;
  createdAt: string;
};

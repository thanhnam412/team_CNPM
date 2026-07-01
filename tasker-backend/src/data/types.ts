import type { Role } from '../common/roles.decorator';

export type User = { id: string; name: string; email: string; password?: string; role: Role; avatar?: string; title?: string; verified?: boolean; trustScore?: number; company?: string; enterpriseId?: string; blocked?: boolean };
export type Job = { id: string; title: string; clientId: string; enterpriseId?: string; category: string; budget: number; duration: string; level: 'Starter' | 'Pro' | 'Enterprise'; status: string; description: string; skills: string[]; proposals: string[]; createdAt: string; aiBrief?: string };
export type Proposal = { id: string; jobId: string; expertId: string; rate: number; coverLetter: string; status: string; score: number; eta: string; createdAt?: string };
export type Contract = { id: string; jobId: string; proposalId?: string; clientId: string; expertId: string; title: string; status: string; escrow: number; progress: number; privacy: string; startedAt: string };
export type Milestone = { id: string; contractId: string; title: string; amount: number; dueDate: string; status: string; deliverable?: string; changeRequest?: string };
export type Transaction = { id: string; userId: string; contractId?: string; type: string; amount: number; status: string; createdAt: string; note?: string };
export type Dispute = { id: string; contractId: string; openedBy: string; reason: string; evidence: string[]; status: string; decision?: string };
export type Notification = { id: string; userId: string; title: string; body: string; tone: string; read: boolean; createdAt: string };
export type Review = { id: string; contractId: string; fromUserId: string; toUserId: string; rating: number; body: string; reply?: string };
export type Message = { id: string; contractId: string; senderId: string; body: string; kind: string; createdAt: string };

import { Injectable } from '@nestjs/common';
import type { Contract, Dispute, Job, Message, Milestone, Notification, Proposal, Review, Transaction, User } from './types';

@Injectable()
export class MockStore {
  users: User[] = [
    { id: 'u_client', name: 'Minh Labs', email: 'client@aitasker.dev', password: 'demo1234', role: 'client', avatar: 'ML', title: 'Product Owner', trustScore: 88 },
    { id: 'u_expert', name: 'An Tran', email: 'expert@aitasker.dev', password: 'demo1234', role: 'expert', avatar: 'AT', title: 'RAG / LLM Engineer', verified: true, trustScore: 96 },
    { id: 'u_enterprise', name: 'Nova Enterprise', email: 'enterprise@aitasker.dev', password: 'demo1234', role: 'enterprise', avatar: 'NE', title: 'AI Program Office', enterpriseId: 'ent_nova', trustScore: 91 },
    { id: 'u_admin', name: 'AITasker Ops', email: 'admin@aitasker.dev', password: 'demo1234', role: 'admin', avatar: 'AO', title: 'Trust & Safety Admin', trustScore: 100 },
  ];
  jobs: Job[] = [{ id: 'job_rag_001', title: 'Build Custom RAG Chatbot for Internal Docs', clientId: 'u_client', category: 'LLM / RAG', budget: 4200, duration: '3 weeks', level: 'Pro', status: 'open', description: 'Secure RAG chatbot over internal docs.', skills: ['LangChain', 'Vector DB'], proposals: [], createdAt: '2026-06-27', aiBrief: 'Hybrid search, guardrails, eval harness.' }];
  proposals: Proposal[] = [];
  contracts: Contract[] = [];
  milestones: Milestone[] = [];
  transactions: Transaction[] = [];
  disputes: Dispute[] = [];
  notifications: Notification[] = [];
  reviews: Review[] = [];
  messages: Message[] = [];

  id(prefix: string) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`; }
  today() { return new Date().toISOString().slice(0, 10); }
  notify(userId: string, title: string, body: string, tone = 'info') { this.notifications.unshift({ id: this.id('noti'), userId, title, body, tone, read: false, createdAt: new Date().toISOString() }); }
}

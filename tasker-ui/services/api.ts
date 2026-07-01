import type { Contract, Dispute, Job, Message, Milestone, Notification, Proposal, Review, Role, Transaction, User } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
let memoryToken: string | null = null;

export function setApiToken(token: string | null) {
  memoryToken = token;
  if (typeof window !== "undefined") {
    if (token) localStorage.setItem("aitasker_token", token);
    else localStorage.removeItem("aitasker_token");
  }
}

export function getApiToken() {
  if (typeof window !== "undefined") return localStorage.getItem("aitasker_token") ?? memoryToken;
  return memoryToken;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getApiToken();
  const headers = new Headers(options?.headers);
  if (!headers.has("Content-Type") && options?.body) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  const res = await fetch(`${BASE}${path}`, { ...options, headers, cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export const api = {
  login: (email: string, password: string, role?: Role) => request<{ access_token: string; user: User }>("/auth/login", { method: "POST", body: JSON.stringify({ email, password, role }) }),
  register: (data: object) => request<{ access_token: string; user: User }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  getUsers: () => request<User[]>("/users"),
  updateUser: (id: string, data: object) => request<User>(`/users/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getJobs: (params?: string) => request<Job[]>(`/jobs${params ? "?" + params : ""}`),
  getJob: (id: string) => request<Job>(`/jobs/${id}`),
  createJob: (data: object) => request<Job>("/jobs", { method: "POST", body: JSON.stringify(data) }),
  updateJob: (id: string, data: object) => request<Job>(`/jobs/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getProposals: (jobId?: string) => request<Proposal[]>(`/proposals${jobId ? "?jobId=" + jobId : ""}`),
  createProposal: (data: object) => request<Proposal>("/proposals", { method: "POST", body: JSON.stringify(data) }),
  updateProposal: (id: string, data: object) => request<Proposal>(`/proposals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  acceptProposal: (id: string) => request<Contract>(`/proposals/${id}/accept`, { method: "POST" }),
  getContracts: () => request<Contract[]>("/contracts"),
  getContract: (id: string) => request<Contract>(`/contracts/${id}`),
  createContract: (data: object) => request<Contract>("/contracts", { method: "POST", body: JSON.stringify(data) }),
  updateContract: (id: string, data: object) => request<Contract>(`/contracts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getMilestones: (contractId?: string) => request<Milestone[]>(`/milestones${contractId ? "?contractId=" + contractId : ""}`),
  createMilestone: (data: object) => request<Milestone>("/milestones", { method: "POST", body: JSON.stringify(data) }),
  updateMilestone: (id: string, data: object) => request<Milestone>(`/milestones/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getDisputes: () => request<Dispute[]>("/disputes"),
  createDispute: (data: object) => request<Dispute>("/disputes", { method: "POST", body: JSON.stringify(data) }),
  updateDispute: (id: string, data: object) => request<Dispute>(`/disputes/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  getTransactions: () => request<Transaction[]>("/transactions"),
  createTransaction: (data: object) => request<Transaction>("/transactions", { method: "POST", body: JSON.stringify(data) }),
  getNotifications: () => request<Notification[]>("/notifications"),
  markRead: (id: string) => request<Notification>(`/notifications/${id}`, { method: "PATCH", body: JSON.stringify({ read: true }) }),
  getReviews: (toUserId?: string) => request<Review[]>(`/reviews${toUserId ? "?toUserId=" + toUserId : ""}`),
  createReview: (data: object) => request<Review>("/reviews", { method: "POST", body: JSON.stringify(data) }),
  getMessages: (contractId: string) => request<Message[]>(`/chat/${contractId}`),
  sendMessage: (contractId: string, data: object) => request<Message>(`/chat/${contractId}`, { method: "POST", body: JSON.stringify(data) }),
};

export default api;

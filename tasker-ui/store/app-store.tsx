"use client";

import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from "react";
import {
  demoAuditLogs,
  demoContracts,
  demoDisputes,
  demoJobs,
  demoMessages,
  demoMilestones,
  demoNotifications,
  demoProposals,
  demoReviews,
  demoServices,
  demoTransactions,
  demoUsers,
} from "@/lib/mock-data";
import type { AuditLog, Contract, Dispute, DisputeStatus, Job, Message, Milestone, Notification, Proposal, ProposalStatus, Review, Role, Service, Transaction, TransactionType, User } from "@/lib/types";
import { api, setApiToken } from "@/services/api";

const DEMO_PASSWORD = "demo1234";

export type LoginResult = { ok: boolean; message?: string; redirectTo?: string; user?: User };
type ToastMessage = { id: string; message: string; type: "info" | "success" | "warning" | "error" };

type State = {
  hydrated: boolean;
  currentUser: User | null;
  users: User[];
  jobs: Job[];
  proposals: Proposal[];
  contracts: Contract[];
  milestones: Milestone[];
  messages: Message[];
  transactions: Transaction[];
  disputes: Dispute[];
  notifications: Notification[];
  reviews: Review[];
  services: Service[];
  favorites: string[];
  auditLogs: AuditLog[];
  toasts: ToastMessage[];
};

type Action =
  | { type: "hydrate"; user?: User | null }
  | { type: "login_user"; user: User }
  | { type: "register_user"; user: User }
  | { type: "logout" }
  | { type: "create_job"; job: Job }
  | { type: "publish_job"; jobId: string; actorId: string }
  | { type: "enterprise_job_decision"; jobId: string; actorId: string; approved: boolean; note?: string }
  | { type: "send_proposal"; proposal: Proposal }
  | { type: "proposal_status"; proposalId: string; status: ProposalStatus; actorId?: string }
  | { type: "accept_proposal"; proposalId: string; actorId: string }
  | { type: "create_milestone"; milestone: Milestone; actorId: string }
  | { type: "milestone_status"; milestoneId: string; status: Milestone["status"]; actorId: string; deliverable?: string; changeRequest?: string }
  | { type: "send_message"; message: Message }
  | { type: "create_dispute"; dispute: Dispute }
  | { type: "dispute_status"; disputeId: string; status: DisputeStatus; actorId: string; decision?: string; resolution?: "release_to_expert" | "refund_client" | "request_evidence" }
  | { type: "transaction"; transaction: Transaction }
  | { type: "review"; review: Review }
  | { type: "reply_review"; reviewId: string; reply: string }
  | { type: "read_notifications"; userId: string }
  | { type: "favorite"; serviceId: string }
  | { type: "verify_user"; userId: string; verified: boolean; actorId: string }
  | { type: "block_user"; userId: string; blocked: boolean; actorId: string }
  | { type: "update_user"; userId: string; patch: Partial<User>; actorId?: string }
  | { type: "replace_remote"; data: Partial<Omit<State, "hydrated" | "currentUser" | "toasts">> }
  | { type: "toast"; toast: ToastMessage }
  | { type: "dismiss_toast"; id: string };

const initialState: State = {
  hydrated: false,
  currentUser: null,
  users: demoUsers,
  jobs: demoJobs,
  proposals: demoProposals,
  contracts: demoContracts,
  milestones: demoMilestones,
  messages: demoMessages,
  transactions: demoTransactions,
  disputes: demoDisputes,
  notifications: demoNotifications,
  reviews: demoReviews,
  services: demoServices,
  favorites: ["svc_rag"],
  auditLogs: demoAuditLogs,
  toasts: [],
};

function nowLabel() {
  return new Date().toLocaleString("vi-VN", { hour12: false });
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 7)}`;
}

function roleHome(role: Role) {
  return `/${role}/dashboard`;
}

function makeNotification(userId: string, title: string, body: string, tone: Notification["tone"] = "info"): Notification {
  return { id: uid("noti"), userId, title, body, tone, read: false, createdAt: nowLabel() };
}

function makeAudit(actorId: string, action: string, targetId?: string, metadata?: string): AuditLog {
  return { id: uid("aud"), actorId, action, targetId, metadata, createdAt: nowLabel() };
}

function pushNotifications(state: State, notifications: Notification[]) {
  return [...notifications, ...state.notifications];
}

function pushAudit(state: State, actorId: string, action: string, targetId?: string, metadata?: string) {
  return [makeAudit(actorId, action, targetId, metadata), ...state.auditLogs];
}

function calcContractProgress(milestones: Milestone[], contractId: string) {
  const contractMilestones = milestones.filter((m) => m.contractId === contractId);
  if (!contractMilestones.length) return 0;
  const approved = contractMilestones.filter((m) => m.status === "approved" || m.status === "paid").length;
  return Math.round((approved / contractMilestones.length) * 100);
}

function isContractDone(milestones: Milestone[], contractId: string) {
  const contractMilestones = milestones.filter((m) => m.contractId === contractId);
  return contractMilestones.length > 0 && contractMilestones.every((m) => m.status === "approved" || m.status === "paid");
}

function defaultMilestones(contractId: string, amount: number): Milestone[] {
  const first = Math.round(amount * 0.25);
  const second = Math.round(amount * 0.4);
  const third = amount - first - second;
  return [
    { id: uid("ms"), contractId, title: "Discovery + architecture blueprint", amount: first, dueDate: today(), status: "planned" },
    { id: uid("ms"), contractId, title: "Prototype + evaluation harness", amount: second, dueDate: today(), status: "in_progress" },
    { id: uid("ms"), contractId, title: "Production handover + documentation", amount: third, dueDate: today(), status: "planned" },
  ];
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "hydrate":
      return { ...state, hydrated: true, currentUser: action.user ?? state.currentUser };
    case "login_user":
      return {
        ...state,
        currentUser: action.user,
        notifications: pushNotifications(state, [makeNotification(action.user.id, "Đăng nhập thành công", `Chào mừng ${action.user.name} quay lại AITasker.`, "success")]),
      };
    case "register_user":
      return {
        ...state,
        users: [action.user, ...state.users],
        currentUser: action.user,
        notifications: pushNotifications(state, [makeNotification(action.user.id, "Tài khoản đã được tạo", "Bạn có thể bắt đầu test luồng AITasker ngay.", "success")]),
        auditLogs: pushAudit(state, action.user.id, "auth.register", action.user.id, action.user.role),
      };
    case "logout":
      return { ...state, currentUser: null };
    case "create_job":
      return {
        ...state,
        jobs: [action.job, ...state.jobs],
        notifications: pushNotifications(state, [
          makeNotification(action.job.clientId, action.job.status === "pending_approval" ? "Job chờ enterprise approval" : "Bản nháp việc làm đã tạo", `${action.job.title} đã được tạo trong hệ thống.`, action.job.status === "pending_approval" ? "warning" : "success"),
          ...(action.job.status === "pending_approval" ? [makeNotification("u_enterprise", "Job cần phê duyệt", `${action.job.title} đang chờ duyệt trước khi ra marketplace.`, "warning")] : []),
        ]),
        auditLogs: pushAudit(state, action.job.clientId, "job.create", action.job.id, action.job.status),
      };
    case "publish_job": {
      const job = state.jobs.find((j) => j.id === action.jobId);
      return {
        ...state,
        jobs: state.jobs.map((j) => (j.id === action.jobId ? { ...j, status: "open" } : j)),
        notifications: job ? pushNotifications(state, [makeNotification(job.clientId, "Job published", `${job.title} đã xuất hiện ở marketplace cho Expert.`, "success")]) : state.notifications,
        auditLogs: pushAudit(state, action.actorId, "job.publish", action.jobId),
      };
    }
    case "enterprise_job_decision": {
      const job = state.jobs.find((j) => j.id === action.jobId);
      if (!job) return state;
      const nextStatus = action.approved ? "open" : "rejected";
      return {
        ...state,
        jobs: state.jobs.map((j) => (j.id === action.jobId ? { ...j, status: nextStatus, approvedBy: action.actorId, approvalNote: action.note } : j)),
        notifications: pushNotifications(state, [
          makeNotification(job.clientId, action.approved ? "Enterprise approved job" : "Enterprise rejected job", action.note || `${job.title} → ${nextStatus}`, action.approved ? "success" : "danger"),
          makeNotification(action.actorId, "Approval action saved", `${job.title} → ${nextStatus}`, action.approved ? "success" : "warning"),
        ]),
        auditLogs: pushAudit(state, action.actorId, action.approved ? "enterprise.job.approve" : "enterprise.job.reject", action.jobId, action.note),
      };
    }
    case "send_proposal": {
      const job = state.jobs.find((j) => j.id === action.proposal.jobId);
      return {
        ...state,
        proposals: [action.proposal, ...state.proposals],
        jobs: state.jobs.map((j) => (j.id === action.proposal.jobId ? { ...j, proposals: [action.proposal.id, ...j.proposals.filter((id) => id !== action.proposal.id)], status: j.status === "open" ? "matching" : j.status } : j)),
        notifications: job ? pushNotifications(state, [
          makeNotification(job.clientId, "Có proposal mới", `Expert gửi proposal cho job ${job.title}.`, "info"),
          makeNotification(action.proposal.expertId, "Proposal đã gửi", `Proposal của bạn đã xuất hiện ở Client Applicants.`, "success"),
        ]) : state.notifications,
        auditLogs: pushAudit(state, action.proposal.expertId, "proposal.send", action.proposal.id, action.proposal.jobId),
      };
    }
    case "proposal_status": {
      const proposal = state.proposals.find((p) => p.id === action.proposalId);
      const job = state.jobs.find((j) => j.id === proposal?.jobId);
      return {
        ...state,
        proposals: state.proposals.map((p) => (p.id === action.proposalId ? { ...p, status: action.status } : p)),
        notifications: proposal ? pushNotifications(state, [makeNotification(proposal.expertId, `Proposal ${action.status}`, job ? `${job.title} → ${action.status}` : action.status, action.status === "rejected" ? "danger" : "info")]) : state.notifications,
        auditLogs: action.actorId ? pushAudit(state, action.actorId, `proposal.${action.status}`, action.proposalId) : state.auditLogs,
      };
    }
    case "accept_proposal": {
      const proposal = state.proposals.find((p) => p.id === action.proposalId);
      const job = state.jobs.find((j) => j.id === proposal?.jobId);
      if (!proposal || !job) return state;
      const contractId = uid("ctr");
      const contract: Contract = {
        id: contractId,
        jobId: job.id,
        proposalId: proposal.id,
        clientId: job.clientId,
        expertId: proposal.expertId,
        title: `${job.title} Contract`,
        status: "active",
        escrow: proposal.rate,
        progress: 0,
        privacy: "private_delivery",
        startedAt: today(),
      };
      const milestones = defaultMilestones(contract.id, proposal.rate);
      const escrowTxn: Transaction = { id: uid("txn"), userId: job.clientId, contractId: contract.id, type: "escrow", amount: proposal.rate, status: "success", createdAt: today(), note: "Client funds moved to escrow" };
      return {
        ...state,
        proposals: state.proposals.map((p) => (p.jobId === job.id ? { ...p, status: p.id === proposal.id ? "accepted" : p.status === "sent" || p.status === "shortlisted" ? "rejected" : p.status } : p)),
        jobs: state.jobs.map((j) => (j.id === job.id ? { ...j, status: "active" } : j)),
        contracts: [contract, ...state.contracts],
        milestones: [...milestones, ...state.milestones],
        transactions: [escrowTxn, ...state.transactions],
        messages: [
          ...state.messages,
          { id: uid("msg"), contractId: contract.id, senderId: "u_admin", body: "Contract workspace created. Escrow is secured and milestones are ready.", kind: "ai", createdAt: nowLabel() },
        ],
        notifications: pushNotifications(state, [
          makeNotification(job.clientId, "Hợp đồng đã tạo", `${contract.title} đã active và escrow đã được giữ.`, "success"),
          makeNotification(proposal.expertId, "Proposal accepted", `Bạn đã có workspace mới: ${contract.title}.`, "success"),
        ]),
        auditLogs: pushAudit(state, action.actorId, "proposal.accept_and_contract.create", contract.id, proposal.id),
      };
    }
    case "create_milestone": {
      const contract = state.contracts.find((c) => c.id === action.milestone.contractId);
      return {
        ...state,
        milestones: [action.milestone, ...state.milestones],
        notifications: contract ? pushNotifications(state, [makeNotification(contract.clientId, "Milestone mới", `${action.milestone.title} đang chờ review.`, "info")]) : state.notifications,
        auditLogs: pushAudit(state, action.actorId, "milestone.create", action.milestone.id, action.milestone.contractId),
      };
    }
    case "milestone_status": {
      const before = state.milestones.find((m) => m.id === action.milestoneId);
      const contract = state.contracts.find((c) => c.id === before?.contractId);
      if (!before || !contract) return state;
      const paidAt = action.status === "approved" || action.status === "paid" ? today() : before.paidAt;
      const milestones = state.milestones.map((m) =>
        m.id === action.milestoneId
          ? { ...m, status: action.status, deliverable: action.deliverable ?? m.deliverable, changeRequest: action.changeRequest ?? m.changeRequest, paidAt }
          : m,
      );
      const progress = calcContractProgress(milestones, contract.id);
      const completed = isContractDone(milestones, contract.id);
      const releaseTxn: Transaction | null = action.status === "approved" && before.status !== "approved" && before.status !== "paid"
        ? { id: uid("txn"), userId: contract.expertId, contractId: contract.id, type: "release", amount: before.amount, status: "success", createdAt: today(), note: `Milestone release: ${before.title}` }
        : null;
      const notifications: Notification[] = [];
      if (action.status === "submitted") notifications.push(makeNotification(contract.clientId, "Milestone submitted", `${before.title} đã sẵn sàng để Client review.`, "info"));
      if (action.status === "change_requested") notifications.push(makeNotification(contract.expertId, "Client yêu cầu chỉnh sửa", action.changeRequest || before.title, "warning"));
      if (action.status === "approved") {
        notifications.push(makeNotification(contract.expertId, "Milestone approved + funds released", `${before.title}: +$${before.amount.toLocaleString("en-US")}`, "success"));
        notifications.push(makeNotification(contract.clientId, "Milestone approved", `${before.title} đã được duyệt và giải ngân.`, "success"));
      }
      if (completed) {
        notifications.push(makeNotification(contract.clientId, "Contract completed", `${contract.title} đã hoàn tất. Bạn có thể đánh giá Expert.`, "success"));
        notifications.push(makeNotification(contract.expertId, "Contract completed", `${contract.title} đã hoàn tất.`, "success"));
      }
      return {
        ...state,
        milestones,
        contracts: state.contracts.map((c) => (c.id === contract.id ? { ...c, progress, status: completed ? "completed" : action.status === "change_requested" ? "review" : c.status, completedAt: completed ? today() : c.completedAt } : c)),
        jobs: completed ? state.jobs.map((j) => (j.id === contract.jobId ? { ...j, status: "completed" } : j)) : state.jobs,
        transactions: releaseTxn ? [releaseTxn, ...state.transactions] : state.transactions,
        notifications: notifications.length ? pushNotifications(state, notifications) : state.notifications,
        auditLogs: pushAudit(state, action.actorId, `milestone.${action.status}`, action.milestoneId, contract.id),
      };
    }
    case "send_message": {
      const contract = state.contracts.find((c) => c.id === action.message.contractId);
      const recipients = contract ? [contract.clientId, contract.expertId].filter((id) => id !== action.message.senderId) : [];
      return {
        ...state,
        messages: [...state.messages, action.message],
        notifications: pushNotifications(state, recipients.map((id) => makeNotification(id, "Tin nhắn workspace mới", action.message.body.slice(0, 90), action.message.kind === "warning" ? "warning" : "info"))),
      };
    }
    case "create_dispute": {
      const contract = state.contracts.find((c) => c.id === action.dispute.contractId);
      return {
        ...state,
        disputes: [action.dispute, ...state.disputes],
        contracts: state.contracts.map((c) => (c.id === action.dispute.contractId ? { ...c, status: "disputed" } : c)),
        notifications: contract ? pushNotifications(state, [
          makeNotification("u_admin", "New dispute case", `${action.dispute.id} cần mediation review.`, "warning"),
          makeNotification(contract.clientId, "Dispute opened", action.dispute.reason, "warning"),
          makeNotification(contract.expertId, "Dispute opened", action.dispute.reason, "warning"),
        ]) : state.notifications,
        auditLogs: pushAudit(state, action.dispute.openedBy, "dispute.create", action.dispute.id, action.dispute.contractId),
      };
    }
    case "dispute_status": {
      const dispute = state.disputes.find((d) => d.id === action.disputeId);
      const contract = state.contracts.find((c) => c.id === dispute?.contractId);
      if (!dispute || !contract) return state;
      const txns: Transaction[] = [];
      if (action.status === "enforced" && action.resolution === "release_to_expert") txns.push({ id: uid("txn"), userId: contract.expertId, contractId: contract.id, type: "release", amount: Math.round(contract.escrow * 0.7), status: "success", createdAt: today(), note: "Admin dispute decision: release to expert" });
      if (action.status === "enforced" && action.resolution === "refund_client") txns.push({ id: uid("txn"), userId: contract.clientId, contractId: contract.id, type: "refund", amount: Math.round(contract.escrow * 0.3), status: "success", createdAt: today(), note: "Admin dispute decision: refund client" });
      return {
        ...state,
        disputes: state.disputes.map((d) => (d.id === action.disputeId ? { ...d, status: action.status, decision: action.decision ?? d.decision } : d)),
        contracts: state.contracts.map((c) => (c.id === contract.id ? { ...c, status: action.status === "enforced" ? "completed" : "disputed", progress: action.status === "enforced" ? 100 : c.progress } : c)),
        transactions: [...txns, ...state.transactions],
        notifications: pushNotifications(state, [
          makeNotification(contract.clientId, "Dispute updated", action.decision || action.status, action.status === "enforced" ? "success" : "warning"),
          makeNotification(contract.expertId, "Dispute updated", action.decision || action.status, action.status === "enforced" ? "success" : "warning"),
          makeNotification("u_admin", "Dispute action saved", `${dispute.id} → ${action.status}`, "info"),
        ]),
        auditLogs: pushAudit(state, action.actorId, `dispute.${action.status}`, action.disputeId, action.decision),
      };
    }
    case "transaction":
      return {
        ...state,
        transactions: [action.transaction, ...state.transactions],
        notifications: pushNotifications(state, [makeNotification(action.transaction.userId, "Wallet updated", `${action.transaction.type}: $${action.transaction.amount.toLocaleString("en-US")}`, action.transaction.status === "failed" ? "danger" : "success")]),
        auditLogs: pushAudit(state, action.transaction.userId, `wallet.${action.transaction.type}`, action.transaction.id, action.transaction.contractId),
      };
    case "review": {
      const target = state.users.find((u) => u.id === action.review.toUserId);
      const reviewsForTarget = [action.review, ...state.reviews].filter((r) => r.toUserId === action.review.toUserId);
      const avg = Math.round((reviewsForTarget.reduce((sum, r) => sum + r.rating, 0) / Math.max(1, reviewsForTarget.length)) * 20);
      const nextTrust = target?.role === "expert" ? Math.round(((target.trustScore ?? 80) * 0.65) + (avg * 0.35)) : target?.trustScore;
      return {
        ...state,
        reviews: [action.review, ...state.reviews],
        users: state.users.map((u) => (u.id === action.review.toUserId && nextTrust ? { ...u, trustScore: nextTrust } : u)),
        notifications: pushNotifications(state, [makeNotification(action.review.toUserId, "Có review mới", action.review.body, "success")]),
        auditLogs: pushAudit(state, action.review.fromUserId, "review.create", action.review.id, action.review.contractId),
      };
    }
    case "reply_review":
      return { ...state, reviews: state.reviews.map((r) => (r.id === action.reviewId ? { ...r, reply: action.reply } : r)) };
    case "read_notifications":
      return { ...state, notifications: state.notifications.map((n) => (n.userId === action.userId ? { ...n, read: true } : n)) };
    case "favorite":
      return { ...state, favorites: state.favorites.includes(action.serviceId) ? state.favorites.filter((id) => id !== action.serviceId) : [action.serviceId, ...state.favorites] };
    case "verify_user": {
      const target = state.users.find((u) => u.id === action.userId);
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, verified: action.verified, trustScore: action.verified ? Math.max(u.trustScore ?? 80, 90) : Math.min(u.trustScore ?? 80, 79) } : u)),
        notifications: target ? pushNotifications(state, [makeNotification(target.id, action.verified ? "Verification approved" : "Verification rejected", action.verified ? "Badge chuyên gia AI đã được cấp." : "Hồ sơ cần bổ sung bằng chứng portfolio.", action.verified ? "success" : "warning")]) : state.notifications,
        auditLogs: pushAudit(state, action.actorId, action.verified ? "user.verify" : "user.reject_verification", action.userId),
      };
    }
    case "block_user": {
      const target = state.users.find((u) => u.id === action.userId);
      return {
        ...state,
        users: state.users.map((u) => (u.id === action.userId ? { ...u, blocked: action.blocked } : u)),
        currentUser: state.currentUser?.id === action.userId && action.blocked ? null : state.currentUser,
        notifications: target ? pushNotifications(state, [makeNotification(target.id, action.blocked ? "Tài khoản bị khóa" : "Tài khoản đã mở khóa", action.blocked ? "Admin đã khóa đăng nhập tài khoản này." : "Bạn có thể đăng nhập lại.", action.blocked ? "danger" : "success")]) : state.notifications,
        auditLogs: pushAudit(state, action.actorId, action.blocked ? "user.block" : "user.unblock", action.userId),
      };
    }
    case "update_user": {
      const nextUsers = state.users.map((u) => (u.id === action.userId ? { ...u, ...action.patch } : u));
      const nextCurrent = state.currentUser?.id === action.userId ? { ...state.currentUser, ...action.patch } : state.currentUser;
      return {
        ...state,
        users: nextUsers,
        currentUser: nextCurrent,
        notifications: pushNotifications(state, [makeNotification(action.userId, "Hồ sơ đã cập nhật", "Thông tin tài khoản/hồ sơ đã được lưu.", "success")]),
        auditLogs: action.actorId ? pushAudit(state, action.actorId, "user.update", action.userId) : state.auditLogs,
      };
    }
    case "replace_remote":
      return { ...state, ...action.data };
    case "toast":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, 4) };
    case "dismiss_toast":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.id) };
    default:
      return state;
  }
}

type NewJobPayload = Pick<Job, "title" | "description" | "budget" | "duration" | "category" | "skills">;
type NewMilestonePayload = Pick<Milestone, "title" | "amount" | "dueDate">;

type Store = State & {
  login: (role: Role, email?: string, name?: string) => void;
  loginByEmail: (email: string, password: string, role?: Role) => Promise<LoginResult>;
  registerUser: (role: Role, email: string, password: string, name: string) => Promise<LoginResult>;
  logout: () => void;
  createJob: (payload: NewJobPayload, publishNow?: boolean) => Job;
  publishJob: (jobId: string) => void;
  decideEnterpriseJob: (jobId: string, approved: boolean, note?: string) => void;
  sendProposal: (jobId: string, expertId: string, coverLetter: string, rate: number) => Proposal;
  updateProposalStatus: (proposalId: string, status: ProposalStatus) => void;
  acceptProposal: (proposalId: string) => Contract | null;
  createMilestone: (contractId: string, payload: NewMilestonePayload) => Milestone;
  approveMilestone: (milestoneId: string) => void;
  submitMilestone: (milestoneId: string, deliverable: string) => void;
  requestMilestoneChange: (milestoneId: string, reason: string) => void;
  sendMessage: (contractId: string, senderId: string, body: string, kind?: Message["kind"]) => void;
  createDispute: (contractId: string, openedBy: string, reason: string, evidence: string[]) => Dispute;
  updateDispute: (disputeId: string, status: DisputeStatus, decision?: string, resolution?: "release_to_expert" | "refund_client" | "request_evidence") => void;
  addTransaction: (userId: string, amount: number, type: TransactionType, contractId?: string, status?: Transaction["status"], note?: string) => void;
  withdraw: (userId: string, amount: number) => void;
  addReview: (contractId: string, fromUserId: string, toUserId: string, rating: number, body: string) => void;
  replyReview: (reviewId: string, reply: string) => void;
  markNotificationsRead: (userId: string) => void;
  toggleFavorite: (serviceId: string) => void;
  verifyUser: (userId: string, verified: boolean) => void;
  blockUser: (userId: string, blocked: boolean) => void;
  updateUser: (userId: string, patch: Partial<User>) => void;
  getWalletBalance: (userId: string) => number;
  getRoleHome: (role: Role) => string;
  showToast: (message: string, type?: ToastMessage["type"]) => void;
  dismissToast: (id: string) => void;
};

const AppStoreContext = createContext<Store | null>(null);

function setAuthCookie(user: User | null) {
  if (typeof document === "undefined") return;
  if (!user) {
    document.cookie = "aitasker_role=; path=/; max-age=0";
    document.cookie = "aitasker_email=; path=/; max-age=0";
    return;
  }
  document.cookie = `aitasker_role=${user.role}; path=/; max-age=604800; SameSite=Lax`;
  document.cookie = `aitasker_email=${encodeURIComponent(user.email)}; path=/; max-age=604800; SameSite=Lax`;
}

function readCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  return document.cookie.split("; ").find((row) => row.startsWith(`${name}=`))?.split("=")[1];
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const showToast = useCallback((message: string, type: ToastMessage["type"] = "info") => {
    dispatch({ type: "toast", toast: { id: uid("toast"), message, type } });
  }, []);

  const dismissToast = useCallback((id: string) => {
    dispatch({ type: "dismiss_toast", id });
  }, []);

  useEffect(() => {
    const email = readCookie("aitasker_email");
    const user = email ? demoUsers.find((u) => u.email === decodeURIComponent(email) && !u.blocked) : null;
    dispatch({ type: "hydrate", user: user ?? null });
  }, []);

  useEffect(() => {
    if (!state.currentUser) return;
    let cancelled = false;
    async function loadRemote() {
      try {
        const [jobs, proposals, contracts, milestones, transactions, disputes, notifications, reviews] = await Promise.all([
          api.getJobs(),
          api.getProposals(),
          api.getContracts(),
          api.getMilestones(),
          api.getTransactions(),
          api.getDisputes(),
          api.getNotifications(),
          api.getReviews(),
        ]);
        const users = state.currentUser?.role === "admin" ? await api.getUsers().catch(() => undefined) : undefined;
        if (!cancelled) dispatch({ type: "replace_remote", data: { ...(users ? { users } : {}), jobs, proposals, contracts, milestones, transactions, disputes, notifications, reviews } });
      } catch (error) {
        console.warn("AITasker API unavailable, keeping in-memory mock store", error);
      }
    }
    loadRemote();
    return () => { cancelled = true; };
  }, [state.currentUser?.id, state.currentUser?.role]);

  const loginByEmail = useCallback(async (email: string, password: string, role?: Role): Promise<LoginResult> => {
    const normalized = email.trim().toLowerCase();
    try {
      const result = await api.login(normalized, password, role);
      setApiToken(result.access_token);
      dispatch({ type: "login_user", user: result.user });
      setAuthCookie(result.user);
      showToast("Đăng nhập thành công", "success");
      return { ok: true, redirectTo: roleHome(result.user.role), user: result.user };
    } catch (error) {
      console.warn("API login failed, falling back to local demo auth", error);
    }
    const user = state.users.find((u) => u.email.toLowerCase() === normalized && (!role || u.role === role));
    if (!user) return { ok: false, message: "Không tìm thấy tài khoản demo cho email/role này." };
    if (user.blocked) return { ok: false, message: "Tài khoản này đã bị Admin khóa." };
    if ((user.password ?? DEMO_PASSWORD) !== password) return { ok: false, message: "Sai mật khẩu demo. Dùng demo1234." };
    setApiToken(null);
    dispatch({ type: "login_user", user });
    setAuthCookie(user);
    showToast("Đang chạy bằng dữ liệu demo cục bộ", "warning");
    return { ok: true, redirectTo: roleHome(user.role), user };
  }, [state.users, showToast]);

  const login = useCallback((role: Role, email?: string, name?: string) => {
    const seed = state.users.find((u) => u.role === role && (!email || u.email.toLowerCase() === email.toLowerCase())) ?? state.users.find((u) => u.role === role) ?? state.users[0];
    const user = { ...seed, email: email || seed.email, name: name || seed.name };
    dispatch({ type: "login_user", user });
    setAuthCookie(user);
  }, [state.users]);

  const registerUser = useCallback(async (role: Role, email: string, password: string, name: string): Promise<LoginResult> => {
    const normalized = email.trim().toLowerCase();
    try {
      const result = await api.register({ role, email: normalized, password, name: name.trim(), fullName: name.trim() });
      setApiToken(result.access_token);
      dispatch({ type: "register_user", user: result.user });
      setAuthCookie(result.user);
      showToast("Đăng ký thành công", "success");
      return { ok: true, redirectTo: roleHome(result.user.role), user: result.user };
    } catch (error) {
      console.warn("API register failed, falling back to local demo store", error);
    }
    if (state.users.some((u) => u.email.toLowerCase() === normalized)) return { ok: false, message: "Email này đã tồn tại trong mock users." };
    const user: User = { id: uid(`u_${role}`), role, email: normalized, password, name: name.trim(), avatar: name.trim().slice(0, 2).toUpperCase(), title: role === "expert" ? "AI Expert" : role === "enterprise" ? "Enterprise Program Owner" : role === "admin" ? "Admin" : "Client", trustScore: role === "admin" ? 100 : 80, verified: role === "expert" ? false : undefined, company: role === "client" || role === "enterprise" ? name.trim() : undefined, enterpriseId: role === "enterprise" ? uid("ent") : undefined, createdAt: today() };
    dispatch({ type: "register_user", user });
    setAuthCookie(user);
    showToast("Đã lưu tài khoản demo cục bộ", "warning");
    return { ok: true, redirectTo: roleHome(role), user };
  }, [state.users, showToast]);

  const logout = useCallback(() => { setApiToken(null); dispatch({ type: "logout" }); setAuthCookie(null); showToast("Đã đăng xuất", "info"); }, [showToast]);

  const createJob = useCallback((payload: NewJobPayload, publishNow = false) => {
    const actor = state.currentUser ?? state.users.find((u) => u.role === "client")!;
    const isEnterprise = actor.role === "enterprise";
    const status = isEnterprise ? "pending_approval" : publishNow ? "open" : "draft";
    const job: Job = {
      id: uid("job"),
      clientId: actor.id,
      enterpriseId: actor.enterpriseId,
      level: payload.budget > 6000 || isEnterprise ? "Enterprise" : payload.budget > 2500 ? "Pro" : "Starter",
      status,
      proposals: [],
      createdAt: today(),
      aiBrief: `AI brief: ${payload.title} nên chia thành discovery, prototype/eval, delivery/handover; yêu cầu bảo mật và nghiệm thu rõ ràng.`,
      ...payload,
    };
    dispatch({ type: "create_job", job });
    showToast(job.status === "pending_approval" ? "Việc làm đang chờ phê duyệt" : "Đăng việc làm thành công", job.status === "pending_approval" ? "warning" : "success");
    void api.createJob(job).catch((error) => console.warn("createJob API fallback", error));
    return job;
  }, [state.currentUser, state.users]);

  const publishJob = useCallback((jobId: string) => { dispatch({ type: "publish_job", jobId, actorId: state.currentUser?.id ?? "u_client" }); showToast("Đã đăng việc làm lên sàn giao dịch", "success"); void api.updateJob(jobId, { status: "open" }).catch((error) => console.warn("publishJob API fallback", error)); }, [state.currentUser?.id, showToast]);
  const decideEnterpriseJob = useCallback((jobId: string, approved: boolean, note?: string) => { dispatch({ type: "enterprise_job_decision", jobId, approved, note, actorId: state.currentUser?.id ?? "u_enterprise" }); showToast(approved ? "Đã duyệt việc làm" : "Đã từ chối việc làm", approved ? "success" : "warning"); void api.updateJob(jobId, { status: approved ? "open" : "rejected", approvalNote: note }).catch((error) => console.warn("enterprise approval API fallback", error)); }, [state.currentUser?.id, showToast]);

  const sendProposal = useCallback((jobId: string, expertId: string, coverLetter: string, rate: number) => {
    const proposal: Proposal = { id: uid("prop"), jobId, expertId, coverLetter, rate, status: "sent", score: 89 + Math.floor(Math.random() * 8), eta: "21 days", createdAt: today() };
    dispatch({ type: "send_proposal", proposal });
    showToast("Đã gửi đơn ứng tuyển", "success");
    void api.createProposal(proposal).catch((error) => console.warn("sendProposal API fallback", error));
    return proposal;
  }, [showToast]);

  const updateProposalStatus = useCallback((proposalId: string, status: ProposalStatus) => { dispatch({ type: "proposal_status", proposalId, status, actorId: state.currentUser?.id }); showToast(status === "rejected" ? "Đã từ chối đơn ứng tuyển" : "Đã cập nhật đơn ứng tuyển", status === "rejected" ? "warning" : "success"); void api.updateProposal(proposalId, { status }).catch((error) => console.warn("proposal update API fallback", error)); }, [state.currentUser?.id, showToast]);

  const acceptProposal = useCallback((proposalId: string) => {
    const proposal = state.proposals.find((p) => p.id === proposalId);
    const job = state.jobs.find((j) => j.id === proposal?.jobId);
    if (!proposal || !job) return null;
    const contract: Contract = { id: uid("ctr_preview"), jobId: job.id, proposalId, clientId: job.clientId, expertId: proposal.expertId, title: `${job.title} Contract`, status: "active", escrow: proposal.rate, progress: 0, privacy: "private_delivery", startedAt: today() };
    dispatch({ type: "accept_proposal", proposalId, actorId: state.currentUser?.id ?? job.clientId });
    showToast("Đã chấp nhận proposal và tạo hợp đồng", "success");
    void api.acceptProposal(proposalId).catch((error) => console.warn("acceptProposal API fallback", error));
    return contract;
  }, [state.currentUser?.id, state.jobs, state.proposals, showToast]);

  const createMilestone = useCallback((contractId: string, payload: NewMilestonePayload) => {
    const milestone: Milestone = { id: uid("ms"), contractId, status: "planned", ...payload };
    dispatch({ type: "create_milestone", milestone, actorId: state.currentUser?.id ?? "u_expert" });
    showToast("Đã tạo cột mốc", "success");
    void api.createMilestone(milestone).catch((error) => console.warn("createMilestone API fallback", error));
    return milestone;
  }, [state.currentUser?.id, showToast]);

  const approveMilestone = useCallback((milestoneId: string) => { dispatch({ type: "milestone_status", milestoneId, status: "approved", actorId: state.currentUser?.id ?? "u_client" }); showToast("Đã duyệt cột mốc và giải ngân", "success"); void api.updateMilestone(milestoneId, { status: "approved" }).catch((error) => console.warn("approveMilestone API fallback", error)); }, [state.currentUser?.id, showToast]);
  const submitMilestone = useCallback((milestoneId: string, deliverable: string) => { dispatch({ type: "milestone_status", milestoneId, status: "submitted", deliverable, actorId: state.currentUser?.id ?? "u_expert" }); showToast("Đã nộp deliverable", "success"); void api.updateMilestone(milestoneId, { status: "submitted", deliverable }).catch((error) => console.warn("submitMilestone API fallback", error)); }, [state.currentUser?.id, showToast]);
  const requestMilestoneChange = useCallback((milestoneId: string, reason: string) => { dispatch({ type: "milestone_status", milestoneId, status: "change_requested", changeRequest: reason, actorId: state.currentUser?.id ?? "u_client" }); showToast("Đã yêu cầu chỉnh sửa", "warning"); void api.updateMilestone(milestoneId, { status: "change_requested", changeRequest: reason }).catch((error) => console.warn("requestMilestoneChange API fallback", error)); }, [state.currentUser?.id, showToast]);
  const sendMessage = useCallback((contractId: string, senderId: string, body: string, kind: Message["kind"] = "text") => { const message = { id: uid("msg"), contractId, senderId, body, kind, createdAt: nowLabel() }; dispatch({ type: "send_message", message }); showToast("Đã gửi tin nhắn", "success"); void api.sendMessage(contractId, message).catch((error) => console.warn("sendMessage API fallback", error)); }, [showToast]);

  const createDispute = useCallback((contractId: string, openedBy: string, reason: string, evidence: string[]) => {
    const dispute: Dispute = { id: uid("dr"), contractId, openedBy, reason, evidence, status: "collecting_evidence" };
    dispatch({ type: "create_dispute", dispute });
    showToast("Đã tạo tranh chấp", "warning");
    void api.createDispute(dispute).catch((error) => console.warn("createDispute API fallback", error));
    return dispute;
  }, [showToast]);

  const updateDispute = useCallback((disputeId: string, status: DisputeStatus, decision?: string, resolution?: "release_to_expert" | "refund_client" | "request_evidence") => { dispatch({ type: "dispute_status", disputeId, status, decision, resolution, actorId: state.currentUser?.id ?? "u_admin" }); showToast("Đã cập nhật tranh chấp", status === "enforced" ? "success" : "warning"); void api.updateDispute(disputeId, { status, decision, resolution }).catch((error) => console.warn("updateDispute API fallback", error)); }, [state.currentUser?.id, showToast]);

  const addTransaction = useCallback((userId: string, amount: number, type: TransactionType, contractId?: string, status: Transaction["status"] = "success", note?: string) => { const transaction = { id: uid("txn"), userId, amount, type, contractId, status, createdAt: today(), note }; dispatch({ type: "transaction", transaction }); showToast("Ví điện tử đã cập nhật", status === "failed" ? "error" : "success"); void api.createTransaction(transaction).catch((error) => console.warn("transaction API fallback", error)); }, [showToast]);
  const withdraw = useCallback((userId: string, amount: number) => addTransaction(userId, amount, "withdrawal", undefined, "pending", "Expert withdrawal request"), [addTransaction]);
  const addReview = useCallback((contractId: string, fromUserId: string, toUserId: string, rating: number, body: string) => { const review = { id: uid("rev"), contractId, fromUserId, toUserId, rating, body, createdAt: today() }; dispatch({ type: "review", review }); showToast("Đã gửi đánh giá", "success"); void api.createReview(review).catch((error) => console.warn("review API fallback", error)); }, [showToast]);
  const replyReview = useCallback((reviewId: string, reply: string) => dispatch({ type: "reply_review", reviewId, reply }), []);
  const markNotificationsRead = useCallback((userId: string) => { const unread = state.notifications.filter((n) => n.userId === userId && !n.read); dispatch({ type: "read_notifications", userId }); unread.forEach((n) => void api.markRead(n.id).catch(() => undefined)); }, [state.notifications]);
  const toggleFavorite = useCallback((serviceId: string) => dispatch({ type: "favorite", serviceId }), []);
  const verifyUser = useCallback((userId: string, verified: boolean) => { dispatch({ type: "verify_user", userId, verified, actorId: state.currentUser?.id ?? "u_admin" }); showToast(verified ? "Đã xác minh chuyên gia" : "Đã từ chối xác minh", verified ? "success" : "warning"); void api.updateUser(userId, { verified }).catch((error) => console.warn("verifyUser API fallback", error)); }, [state.currentUser?.id, showToast]);
  const blockUser = useCallback((userId: string, blocked: boolean) => { dispatch({ type: "block_user", userId, blocked, actorId: state.currentUser?.id ?? "u_admin" }); showToast(blocked ? "Đã khóa tài khoản" : "Đã mở khóa tài khoản", blocked ? "warning" : "success"); void api.updateUser(userId, { blocked }).catch((error) => console.warn("blockUser API fallback", error)); }, [state.currentUser?.id, showToast]);
  const updateUser = useCallback((userId: string, patch: Partial<User>) => { dispatch({ type: "update_user", userId, patch, actorId: state.currentUser?.id }); showToast("Đã lưu thông tin", "success"); void api.updateUser(userId, patch).catch((error) => console.warn("updateUser API fallback", error)); }, [state.currentUser?.id, showToast]);

  const getWalletBalance = useCallback((userId: string) => {
    return state.transactions.filter((t) => t.userId === userId && t.status !== "failed").reduce((balance, t) => {
      if (t.type === "release" || t.type === "refund") return balance + t.amount;
      if (t.type === "withdraw" || t.type === "withdrawal" || t.type === "escrow" || t.type === "fee") return balance - t.amount;
      return balance;
    }, 0);
  }, [state.transactions]);

  const value = useMemo<Store>(() => ({
    ...state,
    login,
    loginByEmail,
    registerUser,
    logout,
    createJob,
    publishJob,
    decideEnterpriseJob,
    sendProposal,
    updateProposalStatus,
    acceptProposal,
    createMilestone,
    approveMilestone,
    submitMilestone,
    requestMilestoneChange,
    sendMessage,
    createDispute,
    updateDispute,
    addTransaction,
    withdraw,
    addReview,
    replyReview,
    markNotificationsRead,
    toggleFavorite,
    verifyUser,
    blockUser,
    updateUser,
    getWalletBalance,
    getRoleHome: roleHome,
    showToast,
    dismissToast,
  }), [state, login, loginByEmail, registerUser, logout, createJob, publishJob, decideEnterpriseJob, sendProposal, updateProposalStatus, acceptProposal, createMilestone, approveMilestone, submitMilestone, requestMilestoneChange, sendMessage, createDispute, updateDispute, addTransaction, withdraw, addReview, replyReview, markNotificationsRead, toggleFavorite, verifyUser, blockUser, updateUser, getWalletBalance, showToast, dismissToast]);

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}

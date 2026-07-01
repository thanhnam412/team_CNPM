function plain(doc: any) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : doc;
  const { _id, __v, passwordHash, ...rest } = obj;
  return { id: String(_id ?? rest.id), ...rest };
}

function fmt(value: any) {
  if (!value) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return value;
}

export function toUser(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  const initials = (obj.fullName || obj.name || obj.email || 'AI').split(' ').map((x: string) => x[0]).join('').slice(-2).toUpperCase();
  return {
    id: obj.id,
    name: obj.fullName || obj.name,
    email: obj.email,
    role: obj.role,
    avatar: obj.avatarUrl || initials,
    title: obj.title || '',
    verified: obj.isVerified ?? obj.verified ?? false,
    blocked: obj.isBlocked ?? obj.blocked ?? false,
    trustScore: obj.trustScore ?? 80,
    company: obj.company || undefined,
    enterpriseId: obj.enterpriseId || undefined,
    createdAt: fmt(obj.createdAt),
    bio: obj.bio || '',
    location: obj.location || '',
    skills: obj.skills || [],
    hourlyRate: obj.hourlyRate ?? 0,
    walletBalance: obj.walletBalance ?? 0,
    totalEarnings: obj.totalEarnings ?? 0,
    portfolioUrls: obj.portfolioUrls || [],
    linkedinUrl: obj.linkedinUrl || '',
    githubUrl: obj.githubUrl || '',
    language: obj.language || 'vi',
    phone: obj.phone || '',
  };
}

export function toJob(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, title: obj.title, clientId: obj.clientId, enterpriseId: obj.enterpriseId || undefined, category: obj.category, budget: obj.budget, duration: obj.duration, level: obj.level || 'Pro', status: obj.status || 'open', description: obj.description, skills: obj.skills || [], proposals: obj.proposalIds || obj.proposals || [], createdAt: fmt(obj.createdAt) || new Date().toISOString().slice(0, 10), aiBrief: obj.aiBrief || '', approvedBy: obj.approvedBy || undefined, approvalNote: obj.approvalNote || undefined, currency: obj.currency || 'USD', isRemote: obj.isRemote ?? true, location: obj.location || '' };
}

export function toProposal(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, jobId: obj.jobId, expertId: obj.expertId, rate: obj.rate, coverLetter: obj.coverLetter, status: obj.status === 'pending' ? 'sent' : obj.status, score: obj.score ?? 0, eta: obj.eta || '21 ngày', createdAt: fmt(obj.createdAt) };
}

export function toContract(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, jobId: obj.jobId, proposalId: obj.proposalId, clientId: obj.clientId, expertId: obj.expertId, title: obj.title, status: obj.status || 'active', escrow: obj.escrowAmount ?? obj.escrow ?? obj.totalBudget ?? 0, progress: obj.progress ?? 0, privacy: obj.privacy === 'private' ? 'private_delivery' : obj.privacy || 'standard', startedAt: fmt(obj.createdAt) || new Date().toISOString().slice(0, 10), completedAt: fmt(obj.completedAt), endDate: fmt(obj.endDate) };
}

export function toMilestone(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, contractId: obj.contractId, title: obj.title, amount: obj.amount, dueDate: obj.dueDate, status: obj.status === 'revision_requested' ? 'change_requested' : obj.status || 'planned', deliverable: obj.deliverable || undefined, changeRequest: obj.changeRequest || undefined, paidAt: fmt(obj.paidAt || obj.approvedAt) };
}

export function toTransaction(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  const typeMap: Record<string, string> = { milestone_release: 'release', deposit: 'escrow', platform_fee: 'fee' };
  const statusMap: Record<string, string> = { completed: 'success', cancelled: 'failed' };
  return { id: obj.id, userId: obj.userId, contractId: obj.contractId || undefined, milestoneId: obj.milestoneId || undefined, type: typeMap[obj.type] || obj.type, amount: obj.amount, status: statusMap[obj.status] || obj.status || 'success', createdAt: fmt(obj.createdAt) || new Date().toISOString().slice(0, 10), note: obj.note || undefined };
}

export function toDispute(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  const statusMap: Record<string, string> = { open: 'collecting_evidence', under_review: 'collecting_evidence', resolved: 'enforced', closed: 'enforced' };
  return { id: obj.id, contractId: obj.contractId, openedBy: obj.openedBy, reason: obj.reason, evidence: obj.evidence || [], status: statusMap[obj.status] || obj.status || 'collecting_evidence', decision: obj.decision || undefined };
}

export function toNotification(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, userId: obj.userId, title: obj.title, body: obj.body, tone: obj.tone === 'error' ? 'danger' : obj.tone, read: !!obj.read, createdAt: fmt(obj.createdAt) || '', link: obj.link || '', entityType: obj.entityType || '', entityId: obj.entityId || '' };
}

export function toReview(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, contractId: obj.contractId, fromUserId: obj.fromUserId, toUserId: obj.toUserId, rating: obj.rating, body: obj.body, reply: obj.reply || undefined, createdAt: fmt(obj.createdAt), communicationRating: obj.communicationRating ?? 0, qualityRating: obj.qualityRating ?? 0, timelinessRating: obj.timelinessRating ?? 0 };
}

export function toMessage(doc: any) {
  const obj = plain(doc);
  if (!obj) return obj;
  return { id: obj.id, contractId: obj.contractId, senderId: obj.senderId, body: obj.body, kind: obj.kind || 'text', createdAt: obj.createdAt instanceof Date ? obj.createdAt.toLocaleString('vi-VN', { hour12: false }) : fmt(obj.createdAt) || '' };
}

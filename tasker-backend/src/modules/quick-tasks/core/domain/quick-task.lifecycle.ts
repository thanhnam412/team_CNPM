// Quick Task Status Machine — type definitions & valid transitions
// KHÔNG import NestJS ở đây, layer này là pure TypeScript

export type QuickTaskStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTE"
  | "SYSTEM_RESOLVING";
export type ContractEscrowStatus = "HELD" | "RELEASED";

/**
 * Snapshot tối thiểu của Quick Task để logic layer validate.
 * Service có trách nhiệm fetch và map vào shape này trước khi gọi case functions.
 */
export interface QuickTaskSnapshot {
  id: string;
  status: QuickTaskStatus;
  expertId: string | null;
  clientId: string;
  /** null nếu chưa tồn tại Contract nào cho task này */
  contractEscrowStatus: ContractEscrowStatus | null;
}

export const VALID_TRANSITIONS: Record<QuickTaskStatus, QuickTaskStatus[]> = {
  OPEN: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["REVIEW", "CANCELLED", "DISPUTE", "SYSTEM_RESOLVING"],
  REVIEW: [
    "COMPLETED",
    "IN_PROGRESS",
    "CANCELLED",
    "DISPUTE",
    "SYSTEM_RESOLVING",
  ],
  COMPLETED: [],
  CANCELLED: [],
  DISPUTE: ["CANCELLED", "COMPLETED"], // Sau khi admin giải quyết
  SYSTEM_RESOLVING: ["CANCELLED", "COMPLETED"],
};

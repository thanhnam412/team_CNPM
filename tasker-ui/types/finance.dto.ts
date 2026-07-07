export interface TransactionDto {
  id: string;
  paymentId: string | null;
  userId: string;
  amount: string | number;
  date: string;
  desc: string | null;
  type: "DEPOSIT" | "ESCROW" | "SPENT" | "FEE" | "REFUND" | "PAYMENT_RECEIVED" | "WITHDRAWAL";
  balanceAfter: string | number;
  status: string;
  source: string;
  projectId: string | null;
  createdAt: string;
}

export interface PaymentDto {
  id: string;
  contractId: string | null;
  taskId: string | null;
  expertId: string;
  clientId: string;
  amount: string | number;
  fee: string | number;
  amountReceived: string | number;
  status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
  createdAt: string;
  updatedAt: string;
}

export interface WalletDto {
  id: string;
  userId: string;
  balance: string | number;
  escrowBalance: string | number;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

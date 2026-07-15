"use client";

import { Wallet, Plus } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { FinanceStats, StatItem } from "./components/finance-stats";
import { ActiveEscrow } from "./components/active-escrow";
import { TransactionLedger } from "./components/transaction-ledger";
import { AddFundsModal } from "./components/add-funds-modal";

export interface ProjectFinanceBlockProps {
  stats: StatItem[];
  transactions: any[];
  activeContracts?: any[];
  isLoading: boolean;
  isAddFundsOpen: boolean;
  onOpenAddFunds: () => void;
  onCloseAddFunds: () => void;
  form: any;
}

export function ProjectFinanceBlock({
  stats,
  transactions,
  activeContracts = [],
  isLoading,
  isAddFundsOpen,
  onOpenAddFunds,
  onCloseAddFunds,
  form,
}: ProjectFinanceBlockProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <NeoPageHeader
        variant="transparent"
        className="mb-2"
        containerClassName="!px-0 !pt-0 !pb-6"
        headingTag="h2"
        title="Financials"
        icon={<Wallet className="w-8 h-8 text-primary" />}
        description="Manage project budget, escrow, and payments"
        rightContent={
          <NeoButton className="h-12 px-6" onClick={onOpenAddFunds}>
            <Plus className="w-4 h-4 mr-2" /> Add Funds
          </NeoButton>
        }
      />

      <FinanceStats stats={stats} />

      <ActiveEscrow contracts={activeContracts} />

      <TransactionLedger transactions={transactions} isLoading={isLoading} />

      <AddFundsModal
        isOpen={isAddFundsOpen}
        onClose={onCloseAddFunds}
        form={form}
      />
    </div>
  );
}

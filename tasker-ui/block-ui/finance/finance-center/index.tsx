"use client";

import { FinanceHeader } from "./components/finance-header";
import { FinanceStats } from "./components/finance-stats";
import { FinanceTabs } from "./components/finance-tabs";
import { TabTransactions } from "./components/tab-transactions";
import { TabPayouts } from "./components/tab-payouts";
import { TabReports } from "./components/tab-reports";
import { TabSettings } from "./components/tab-settings";
import { DepositModal } from "./components/deposit-modal";

export interface FinanceCenterBlockProps {
  stats: any[];
  transactions: any[];
  isTransactionsLoading: boolean;
  pendingPayouts: any[];
  budgetReports: any[];
  activeTab: string;
  onChangeTab: (tabId: string) => void;
  isDepositOpen: boolean;
  onOpenDeposit: () => void;
  onCloseDeposit: () => void;
}

export function FinanceCenterBlock({
  stats,
  transactions,
  isTransactionsLoading,
  pendingPayouts,
  budgetReports,
  activeTab,
  onChangeTab,
  isDepositOpen,
  onOpenDeposit,
  onCloseDeposit,
}: FinanceCenterBlockProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <FinanceHeader onOpenDeposit={onOpenDeposit} />

      <div className="flex-1 overflow-y-auto p-6 bg-background relative z-0">
        <div className="max-w-7xl mx-auto space-y-8 pb-24">
          <FinanceStats stats={stats} />

          <FinanceTabs
            activeTab={activeTab}
            onChangeTab={onChangeTab}
            payoutsCount={pendingPayouts.length}
          />

          {activeTab === "transactions" && (
            <TabTransactions
              transactions={transactions}
              isLoading={isTransactionsLoading}
            />
          )}

          {activeTab === "payouts" && (
            <TabPayouts pendingPayouts={pendingPayouts} />
          )}

          {activeTab === "reports" && (
            <TabReports budgetReports={budgetReports} />
          )}

          {activeTab === "settings" && <TabSettings />}
        </div>
      </div>

      <DepositModal isOpen={isDepositOpen} onClose={onCloseDeposit} />
    </div>
  );
}

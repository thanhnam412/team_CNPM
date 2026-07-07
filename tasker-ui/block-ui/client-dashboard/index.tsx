"use client";

import { DashboardHeader } from "./components/dashboard-header";
import { FinanceSnapshotWidget } from "./components/finance-snapshot-widget";
import { ActionRequiredWidget } from "./components/action-required-widget";
import { ActiveProjectsWidget } from "./components/active-projects-widget";
import { UrgentInboxWidget } from "./components/urgent-inbox-widget";

export interface ClientDashboardBlockProps {
  userName: string;
  finance: {
    availableBalance: string;
    inEscrow: string;
    spentMTD: string;
  };
  pendingActions: any[];
  activeProjects: any[];
  unreadMessages: any[];
}

export function ClientDashboardBlock({
  userName,
  finance,
  pendingActions,
  activeProjects,
  unreadMessages,
}: ClientDashboardBlockProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      <DashboardHeader userName={userName} />

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Row: Finance & Action Required */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <FinanceSnapshotWidget
            availableBalance={finance.availableBalance}
            inEscrow={finance.inEscrow}
            spentMTD={finance.spentMTD}
          />
          <ActionRequiredWidget pendingActions={pendingActions} />
        </div>

        {/* Middle Row: Active Projects & Inbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ActiveProjectsWidget projects={activeProjects} />
          <UrgentInboxWidget messages={unreadMessages} />
        </div>
      </div>
    </div>
  );
}

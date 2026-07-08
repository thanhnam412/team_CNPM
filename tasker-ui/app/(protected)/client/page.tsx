"use client";

import { ClientDashboardBlock } from "@/block-ui/client-dashboard";

import { useClientOverview } from "@/tanstack/useClient";
import { useGetMe } from "@/tanstack/useGetMe";
import { Loader2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function DashboardOverviewPage() {
  const { data: me } = useGetMe();
  const userName = me?.name || "Client";
  
  const { data, isLoading, isError } = useClientOverview();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-[50vh] text-destructive">
        Failed to load dashboard overview.
      </div>
    );
  }

  const { finance, pendingActions, activeProjects, unreadMessages } = data;

  const formattedFinance = {
    availableBalance: formatCurrency(Number(finance.availableBalance)),
    inEscrow: formatCurrency(Number(finance.inEscrow)),
    spentMTD: formatCurrency(Number(finance.spentMTD)),
  };

  const formattedProjects = activeProjects.map(p => ({
    ...p,
    escrow: formatCurrency(Number(p.escrow)),
  }));

  return (
    <ClientDashboardBlock
      userName={userName}
      finance={formattedFinance}
      pendingActions={pendingActions}
      activeProjects={formattedProjects}
      unreadMessages={unreadMessages}
    />
  );
}

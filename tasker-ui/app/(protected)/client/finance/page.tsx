"use client";

import { useState } from "react";
import { useTransactions, useWallet } from "@/tanstack/useFinance";
import { useGetMe } from "@/tanstack/useGetMe";
import { formatCurrency } from "@/lib/utils";
import { useProjects } from "@/tanstack/useProjects";
import { useClientQuickTasks } from "@/tanstack/useQuickTasks";
import { useContracts } from "@/tanstack/useContracts";
import { Wallet, Lock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { FinanceCenterBlock } from "@/block-ui/finance/finance-center";

export default function GlobalFinancePage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  const { data: me } = useGetMe();
  const currentUserId = me?.id || "";

  const { data: wallet } = useWallet(currentUserId);
  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactions(currentUserId);

  const totalSpent = transactions
    .filter((tx: any) => tx.type === "SPENT")
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

  const totalDeposited = transactions
    .filter((tx: any) => tx.type === "DEPOSIT")
    .reduce((sum: number, tx: any) => sum + Number(tx.amount), 0);

  const stats = [
    { title: "Available Balance", value: wallet ? formatCurrency(wallet.balance) : "$0.00", icon: Wallet, color: "text-primary" },
    { title: "Total in Escrow", value: wallet ? formatCurrency(wallet.escrowBalance) : "$0.00", icon: Lock, color: "text-[#E1801E]" },
    { title: "Total Spent", value: formatCurrency(totalSpent), icon: ArrowUpRight, color: "text-destructive" },
    { title: "Total Deposited", value: formatCurrency(totalDeposited), icon: ArrowDownRight, color: "text-foreground" },
  ];

  const { data: projects = [] } = useProjects();
  const { data: quickTasks = [] } = useClientQuickTasks(currentUserId);
  const { data: contracts = [] } = useContracts();

  const pendingPayouts = contracts
    .filter((c: any) => c.escrowStatus === "HELD")
    .filter((c: any) => {
      if (c.quickTaskId) {
        const qt = quickTasks.find((q: any) => q.id === c.quickTaskId);
        return qt?.status === "REVIEW";
      }
      return false;
    })
    .map((c: any) => {
      const qt = quickTasks.find((q: any) => q.id === c.quickTaskId);
      return {
        id: c.id.substring(0, 8),
        quickTaskId: c.quickTaskId,
        expert: c.expertId.substring(0, 8),
        avatar: c.expertId.substring(0, 1).toUpperCase(),
        task: qt ? qt.title : `Milestone`,
        amount: formatCurrency(c.agreedPrice),
        deadline: "Needs Approval",
      };
    });

  const projectReports = projects.map((p: any) => {
    const projContracts = contracts.filter((c: any) => c.projectId === p.id);
    const escrow = projContracts.filter((c: any) => c.escrowStatus === "HELD").reduce((acc: number, c: any) => acc + Number(c.agreedPrice), 0);
    const spent = projContracts.filter((c: any) => c.escrowStatus === "RELEASED").reduce((acc: number, c: any) => acc + Number(c.agreedPrice), 0);
    const utilized = Number(p.budget) > 0 ? ((spent + escrow) / Number(p.budget)) * 100 : 0;
    
    return {
      id: p.id,
      name: p.title,
      expected: formatCurrency(p.budget || 0),
      spent: formatCurrency(spent),
      escrow: formatCurrency(escrow),
      utilized: Math.round(utilized),
    };
  });

  const qtContracts = contracts.filter((c: any) => c.quickTaskId);
  const qtEscrow = qtContracts.filter((c: any) => c.escrowStatus === "HELD").reduce((acc: number, c: any) => acc + Number(c.agreedPrice), 0);
  const qtSpent = qtContracts.filter((c: any) => c.escrowStatus === "RELEASED").reduce((acc: number, c: any) => acc + Number(c.agreedPrice), 0);
  const qtExpected = quickTasks.reduce((acc: number, qt: any) => acc + Number(qt.budget), 0);
  const qtUtilized = qtExpected > 0 ? ((qtSpent + qtEscrow) / qtExpected) * 100 : 0;

  const budgetReports = [
    ...projectReports,
    {
      id: "QT-ALL",
      name: "Quick Tasks (All)",
      expected: formatCurrency(qtExpected),
      spent: formatCurrency(qtSpent),
      escrow: formatCurrency(qtEscrow),
      utilized: Math.round(qtUtilized),
    }
  ];

  return (
    <FinanceCenterBlock
      stats={stats}
      transactions={transactions}
      isTransactionsLoading={isTransactionsLoading}
      pendingPayouts={pendingPayouts}
      budgetReports={budgetReports}
      activeTab={activeTab}
      onChangeTab={setActiveTab}
      isDepositOpen={isDepositOpen}
      onOpenDeposit={() => setIsDepositOpen(true)}
      onCloseDeposit={() => setIsDepositOpen(false)}
    />
  );
}

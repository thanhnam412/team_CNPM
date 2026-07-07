"use client";

import { useState } from "react";
import { useTransactions, useWallet } from "@/tanstack/useFinance";
import { useGetMe } from "@/tanstack/useGetMe";
import { formatCurrency } from "@/lib/utils";
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

  const pendingPayouts = [
    {
      id: "PO-101",
      expert: "Alex_Code",
      avatar: "A",
      task: "Write a Python script for web scraping (QT-889)",
      amount: "$150.00",
      deadline: "Auto-release in 2 Days",
    },
    {
      id: "PO-102",
      expert: "DesignStudio",
      avatar: "D",
      task: "Logo Design Milestone (PROJ-123)",
      amount: "$450.00",
      deadline: "Auto-release in 5 Hrs",
    },
    {
      id: "PO-103",
      expert: "AI_Vision_Pro",
      avatar: "V",
      task: "Fine-tune Llama-3 Dataset Prep (QT-2)",
      amount: "$500.00",
      deadline: "Action Required",
    },
  ];

  const budgetReports = [
    { id: "PROJ-1", name: "Hệ thống AI ATS", expected: "$5,000", spent: "$3,200", escrow: "$1,000", utilized: 84 },
    { id: "PROJ-2", name: "B2B E-commerce", expected: "$10,000", spent: "$2,000", escrow: "$4,500", utilized: 65 },
    { id: "QT-ALL", name: "Quick Tasks (All)", expected: "$2,000", spent: "$1,850", escrow: "$150", utilized: 100 },
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

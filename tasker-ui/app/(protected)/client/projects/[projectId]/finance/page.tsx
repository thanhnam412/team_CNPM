"use client";

import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  History,
  Plus,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";

export default function ProjectFinancePage() {
  const stats = [
    {
      title: "Total Budget",
      value: "$10,000",
      icon: Wallet,
      color: "text-foreground",
    },
    {
      title: "Escrow (Locked)",
      value: "$2,500",
      icon: Lock,
      color: "text-[#E1801E]",
    },
    {
      title: "Spent",
      value: "$4,500",
      icon: ArrowUpRight,
      color: "text-destructive",
    },
    {
      title: "Available",
      value: "$3,000",
      icon: ArrowDownRight,
      color: "text-primary",
    },
  ];

  const transactions = [
    {
      id: "TX-9921",
      date: "Oct 12, 2026",
      desc: "Locked Escrow: Label dataset with bounding boxes",
      type: "escrow",
      amount: "$1,200",
      expert: "DataCorp",
    },
    {
      id: "TX-9920",
      date: "Oct 10, 2026",
      desc: "Released Escrow: Setup AWS Infrastructure",
      type: "spent",
      amount: "$800",
      expert: "CloudGuru",
    },
    {
      id: "TX-9919",
      date: "Oct 01, 2026",
      desc: "Initial Budget Allocation",
      type: "deposit",
      amount: "$10,000",
      expert: "Internal",
    },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-2 border-border pb-6">
        <div>
          <h2 className="text-3xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
            <Wallet className="w-8 h-8 text-primary" /> Financials
          </h2>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
            Manage project budget, escrow, and payments
          </p>
        </div>

        <NeoButton className="h-12 px-6">
          <Plus className="w-4 h-4 mr-2" /> Add Funds
        </NeoButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex flex-col justify-between h-32"
            >
              <div className="flex items-center justify-between">
                <h3 className="uppercase tracking-widest font-bold text-[0.625rem] text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon className={cn("w-4 h-4", stat.color)} />
              </div>
              <div
                className={cn(
                  "text-3xl font-heading font-black tracking-wider",
                  stat.color,
                )}
              >
                {stat.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Escrow Section */}
      <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
        <h3 className="uppercase tracking-widest font-black text-sm mb-6 flex items-center gap-2 border-b-2 border-border pb-4">
          <Lock className="w-4 h-4 text-[#E1801E]" /> Active Escrow Contracts
        </h3>

        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-2 border-border bg-secondary/20 hover:border-primary/50 transition-colors"
            >
              <div>
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">
                  {i === 1
                    ? "Label dataset with bounding boxes"
                    : "API Integration for Payment Gateway"}
                </h4>
                <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                  Expert: {i === 1 ? "DataCorp" : "AlexN"} • Milestone: Phase 1
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-xl font-heading font-black text-[#E1801E] tracking-wider">
                  {i === 1 ? "$1,200" : "$1,300"}
                </span>
                <NeoButton variant="outline" className="text-xs h-8">
                  View Task
                </NeoButton>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
        <div className="p-6 border-b-2 border-border bg-secondary/30 flex justify-between items-center">
          <h3 className="uppercase tracking-widest font-black text-sm flex items-center gap-2">
            <History className="w-4 h-4" /> Transaction Ledger
          </h3>
          <NeoButton variant="ghost" className="text-xs h-8">
            View All
          </NeoButton>
        </div>

        <div className="divide-y-2 divide-border">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-10 h-10 rounded-none border-2 border-border flex items-center justify-center shrink-0",
                    tx.type === "escrow"
                      ? "bg-[#E1801E]/20 text-[#E1801E]"
                      : tx.type === "spent"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary",
                  )}
                >
                  {tx.type === "escrow" ? (
                    <Lock className="w-4 h-4" />
                  ) : tx.type === "spent" ? (
                    <ArrowUpRight className="w-4 h-4" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider mb-1">
                    {tx.desc}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    <span>{tx.date}</span>
                    <span className="hidden sm:inline">•</span>
                    <span>{tx.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-[0.625rem] font-bold uppercase tracking-widest border-2 border-border px-2 py-0.5 bg-background">
                  {tx.expert}
                </span>
                <span
                  className={cn(
                    "font-heading font-black tracking-wider text-sm",
                    tx.type === "deposit" ? "text-primary" : "text-foreground",
                  )}
                >
                  {tx.type === "deposit" ? "+" : "-"}
                  {tx.amount}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

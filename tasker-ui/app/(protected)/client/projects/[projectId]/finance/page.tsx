"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useParams } from "next/navigation";
import { useState } from "react";
import { NeoFormField } from "@/components/ui-custom/neo-form-field";
import { useProjectFinance, useAddProjectFundsMutation } from "@/tanstack/useProjects";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  History,
  Plus,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn, formatCurrency } from "@/lib/utils";

export default function ProjectFinancePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: financeData, isLoading } = useProjectFinance(projectId);

  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const addFundsMutation = useAddProjectFundsMutation(projectId);

  const form = useForm({
    defaultValues: { amount: 100 },
    onSubmit: async ({ value }) => {
      addFundsMutation.mutate(value.amount, {
        onSuccess: () => {
          setIsAddFundsOpen(false);
          form.reset();
        }
      });
    },
  });

  const stats = [
    {
      title: "Total Budget",
      value: formatCurrency(financeData?.budget || 0),
      icon: Wallet,
      color: "text-foreground",
    },
    {
      title: "Escrow (Locked)",
      value: formatCurrency(financeData?.escrow || 0),
      icon: Lock,
      color: "text-[#E1801E]",
    },
    {
      title: "Spent",
      value: formatCurrency(financeData?.spent || 0),
      icon: ArrowUpRight,
      color: "text-destructive",
    },
    {
      title: "Available",
      value: formatCurrency(Number(financeData?.budget || 0) - Number(financeData?.spent || 0) - Number(financeData?.escrow || 0)),
      icon: ArrowDownRight,
      color: "text-primary",
    },
  ];

  const transactions = financeData?.transactions || [];

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
          <NeoButton className="h-12 px-6" onClick={() => setIsAddFundsOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Funds
          </NeoButton>
        }
      />

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
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground uppercase text-xs font-bold">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground uppercase text-xs font-bold">
              No transactions yet.
            </div>
          ) : (
            transactions.map((tx: any) => (
              <div
                key={tx.id}
                className="p-4 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-secondary/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-none border-2 border-border flex items-center justify-center shrink-0",
                      tx.type === "ESCROW"
                        ? "bg-[#E1801E]/20 text-[#E1801E]"
                        : tx.type === "SPENT" || tx.type === "FEE"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary",
                    )}
                  >
                    {tx.type === "ESCROW" ? (
                      <Lock className="w-4 h-4" />
                    ) : tx.type === "SPENT" || tx.type === "FEE" ? (
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
                      <span>{new Date(tx.createdAt).toLocaleDateString()}</span>
                      <span className="hidden sm:inline">•</span>
                      <span title={tx.id}>{tx.id.split('-')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest border-2 border-border px-2 py-0.5 bg-background">
                    {tx.source || "System"}
                  </span>
                  <span
                    className={cn(
                      "font-heading font-black tracking-wider text-sm",
                      tx.type === "DEPOSIT" || tx.type === "REFUND" || tx.type === "PAYMENT_RECEIVED"
                        ? "text-primary"
                        : "text-foreground",
                    )}
                  >
                    {tx.type === "DEPOSIT" || tx.type === "REFUND" || tx.type === "PAYMENT_RECEIVED" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ADD FUNDS MODAL */}
      {isAddFundsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-heading font-black text-xl uppercase tracking-widest mb-2">
              Add Funds to Project
            </h3>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
              Increase your project's working budget
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="space-y-6">
                <NeoFormField
                  form={form}
                  name="amount"
                  label="Amount ($)"
                  type="number"
                  placeholder="e.g. 500"
                  validators={{ onChange: z.number().min(1, "Minimum $1") }}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8 border-t-2 border-border pt-6">
                <NeoButton
                  variant="outline"
                  type="button"
                  onClick={() => setIsAddFundsOpen(false)}
                >
                  Cancel
                </NeoButton>
                <form.Subscribe
                  selector={(s) => [s.canSubmit, s.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <NeoButton type="submit" disabled={!canSubmit || isSubmitting}>
                      {isSubmitting ? "Processing..." : "Confirm Payment"}
                    </NeoButton>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

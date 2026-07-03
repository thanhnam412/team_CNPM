"use client";

import { useState } from "react";
import {
  Wallet,
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  Landmark,
  CreditCard,
  Bitcoin,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  Briefcase,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { cn } from "@/lib/utils";

// Mock Transaction History
const TRANSACTIONS = [
  {
    id: "TX-9901",
    date: "Oct 12, 2026",
    type: "payment_received",
    desc: "Payment for QT-889",
    amount: "+$150.00",
    status: "cleared",
  },
  {
    id: "TX-9902",
    date: "Oct 12, 2026",
    type: "platform_fee",
    desc: "Platform Fee (10%)",
    amount: "-$15.00",
    status: "cleared",
  },
  {
    id: "TX-9850",
    date: "Oct 05, 2026",
    type: "withdrawal",
    desc: "Bank Transfer Withdraw",
    amount: "-$1,200.00",
    status: "completed",
  },
  {
    id: "TX-9849",
    date: "Oct 01, 2026",
    type: "payment_received",
    desc: "Milestone 1 - PROJ-65",
    amount: "+$1,500.00",
    status: "cleared",
  },
  {
    id: "TX-9848",
    date: "Oct 01, 2026",
    type: "platform_fee",
    desc: "Platform Fee (10%)",
    amount: "-$150.00",
    status: "cleared",
  },
];

export default function ExpertEarningsPage() {
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setWithdrawAmount("");
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Header */}
      <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
            <Wallet className="w-8 h-8 md:w-10 md:h-10 text-primary" /> Earnings
            & Payouts
          </h1>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
            Manage your available funds, track pending clearances, and withdraw
            to your accounts.
          </p>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Top Grid: Snapshots & Withdraw */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Snapshots Column */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Balance */}
            <div className="bg-card border-4 border-primary p-6 shadow-[6px_6px_0px_0px_var(--primary)] flex flex-col justify-center">
              <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
                Available to Withdraw{""}
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </div>
              <div className="font-heading font-black text-5xl md:text-6xl text-foreground">
                $4,350.00
              </div>
              <p className="text-xs font-bold text-muted-foreground mt-4">
                Funds have cleared and are ready for payout.
              </p>
            </div>

            <div className="space-y-6">
              {/* In Clearance */}
              <div className="bg-[#E1801E]/10 border-2 border-[#E1801E] p-4 flex flex-col justify-center shadow-[4px_4px_0px_0px_#E1801E]">
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-[#E1801E] mb-1 flex items-center gap-2">
                  In Clearance <Clock className="w-3 h-3" />
                </div>
                <div className="font-heading font-black text-2xl text-foreground">
                  $800.00
                </div>
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                  Pending 5-day security hold
                </div>
              </div>

              {/* In Escrow */}
              <div className="bg-secondary/10 border-2 border-border p-4 flex flex-col justify-center">
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-2">
                  In Escrow (Work in Progress) <Briefcase className="w-3 h-3" />
                </div>
                <div className="font-heading font-black text-2xl text-muted-foreground">
                  $1,250.00
                </div>
              </div>
            </div>
          </div>

          {/* Withdraw Column */}
          <div className="lg:col-span-1 bg-card border-2 border-foreground p-6 shadow-[6px_6px_0px_0px_var(--foreground)] flex flex-col">
            <h3 className="font-heading font-black uppercase tracking-widest text-lg mb-6 flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" /> Withdraw Funds
            </h3>

            <div className="space-y-5 flex-1">
              <div>
                <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                  Amount to withdraw
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-lg text-muted-foreground">
                    $
                  </span>
                  <NeoInput
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="0.00"
                    className="pl-8 h-14 font-heading text-xl focus-visible: focus-visible:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                  Payout Method
                </label>
                <NeoSelect defaultValue="bank">
                  <NeoSelectTrigger className="w-full h-12 bg-background text-sm">
                    <NeoSelectValue placeholder="Select Method" />
                  </NeoSelectTrigger>
                  <NeoSelectContent className="">
                    <NeoSelectItem
                      value="bank"
                      className="text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Landmark className="w-4 h-4" /> Bank Transfer (Free)
                      </div>
                    </NeoSelectItem>
                    <NeoSelectItem
                      value="paypal"
                      className="text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> PayPal (-$2.00 Fee)
                      </div>
                    </NeoSelectItem>
                    <NeoSelectItem
                      value="crypto"
                      className="text-xs cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Bitcoin className="w-4 h-4" /> Crypto (USDT)
                      </div>
                    </NeoSelectItem>
                  </NeoSelectContent>
                </NeoSelect>
              </div>
            </div>

            <NeoButton
              onClick={handleWithdraw}
              disabled={isWithdrawing || !withdrawAmount}
              className={cn(
                "w-full h-14 text-sm mt-6",
                showSuccess
                  ? "bg-green-500 border-green-700 text-white"
                  : "hover:-translate-y-1  active:translate-y-1  disabled:opacity-50 disabled:hover:translate-y-0",
              )}
            >
              {isWithdrawing
                ? "Processing..."
                : showSuccess
                  ? "Success!"
                  : "Withdraw Now"}
            </NeoButton>
          </div>
        </div>

        {/* Transaction History */}
        <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] overflow-hidden">
          <div className="p-4 border-b-2 border-border bg-secondary/10 flex items-center justify-between">
            <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" /> Transaction History
            </h3>
            <NeoButton variant="outline" className="h-8 text-[0.625rem]">
              Download CSV
            </NeoButton>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-background border-b-2 border-border">
                <tr>
                  <th className="px-6 py-4">Transaction ID</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-border">
                {TRANSACTIONS.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-secondary/5 transition-colors group"
                  >
                    <td className="px-6 py-4 font-bold font-mono text-xs">
                      {tx.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-muted-foreground text-xs">
                      {tx.date}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === "payment_received" && (
                          <ArrowDownLeft className="w-4 h-4 text-green-500 shrink-0" />
                        )}
                        {tx.type === "withdrawal" && (
                          <ArrowUpRight className="w-4 h-4 text-foreground shrink-0" />
                        )}
                        {tx.type === "platform_fee" && (
                          <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                        )}
                        <span className="font-bold text-xs uppercase">
                          {tx.desc}
                        </span>
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-6 py-4 font-heading font-black text-right",
                        tx.amount.startsWith("+")
                          ? "text-green-600"
                          : "text-foreground",
                      )}
                    >
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-[0.625rem] font-black uppercase tracking-widest bg-secondary px-2 py-1 border-2 border-border">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

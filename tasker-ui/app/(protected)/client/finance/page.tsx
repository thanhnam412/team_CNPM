"use client";

import { useState } from "react";
import { useTransactions } from "@/tanstack/useFinance";
import {
  Wallet,
  ArrowDownRight,
  ArrowUpRight,
  Lock,
  History,
  CreditCard,
  Plus,
  Search,
  Filter,
  Download,
  AlertCircle,
  X,
  CheckCircle2,
  PieChart,
  Bell,
  Trash2,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { cn, formatCurrency } from "@/lib/utils";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function GlobalFinancePage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [isDepositOpen, setIsDepositOpen] = useState(false);

  // Snapshots
  const stats = [
    {
      title: "Available Balance",
      value: "$12,450.00",
      icon: Wallet,
      color: "text-primary",
    },
    {
      title: "Total in Escrow",
      value: "$4,200.00",
      icon: Lock,
      color: "text-[#E1801E]",
    },
    {
      title: "Total Spent (This Month)",
      value: "$1,850.00",
      icon: ArrowUpRight,
      color: "text-destructive",
    },
    {
      title: "Total Deposited",
      value: "$20,000.00",
      icon: ArrowDownRight,
      color: "text-foreground",
    },
  ];

  const currentUserId = "user-1";

  const { data: transactions = [], isLoading: isTransactionsLoading } = useTransactions(currentUserId);

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

  // Mock Budget Reports
  const budgetReports = [
    {
      id: "PROJ-1",
      name: "Hệ thống AI ATS",
      expected: "$5,000",
      spent: "$3,200",
      escrow: "$1,000",
      utilized: 84,
    },
    {
      id: "PROJ-2",
      name: "B2B E-commerce",
      expected: "$10,000",
      spent: "$2,000",
      escrow: "$4,500",
      utilized: 65,
    },
    {
      id: "QT-ALL",
      name: "Quick Tasks (All)",
      expected: "$2,000",
      spent: "$1,850",
      escrow: "$150",
      utilized: 100,
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Global Header */}
      <NeoPageHeader
        className="relative z-10"
        containerClassName="max-w-7xl mx-auto w-full"
        title="Finance Center"
        icon={<Wallet className="w-8 h-8 text-primary" />}
        description="Global overview of your wallets, escrows, and spending"
        rightContent={
          <>
            <NeoButton
              variant="outline"
              className="flex-1 md:flex-none h-12 px-6"
            >
              Spending Report
            </NeoButton>
            <NeoButton
              onClick={() => setIsDepositOpen(true)}
              className="flex-1 md:flex-none h-12 px-6"
            >
              <Plus className="w-4 h-4 mr-2" /> Deposit Funds
            </NeoButton>
          </>
        }
      />

      <div className="flex-1 overflow-y-auto p-6 bg-background relative z-0">
        <div className="max-w-7xl mx-auto space-y-8 pb-24">
          {/* Snapshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div
                  key={i}
                  className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex flex-col justify-between h-36 cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="uppercase tracking-widest font-bold text-[0.625rem] text-muted-foreground group-hover:text-foreground transition-colors">
                      {stat.title}
                    </h3>
                    <Icon className={cn("w-5 h-5", stat.color)} />
                  </div>
                  <div
                    className={cn(
                      "text-3xl lg:text-4xl font-heading font-black tracking-wider mt-4 truncate",
                      stat.color,
                    )}
                  >
                    {stat.value}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Client-side Tabs */}
          <div className="flex items-center gap-1 border-b-2 border-border overflow-x-auto no-scrollbar pt-4">
            {[
              {
                id: "transactions",
                label: "Transaction History",
                icon: History,
              },
              { id: "payouts", label: "Pending Payouts", icon: AlertCircle },
              { id: "reports", label: "Budget Reports", icon: Download },
              { id: "settings", label: "Settings", icon: CreditCard },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-4 border-2 border-transparent uppercase font-bold tracking-widest text-xs transition-all whitespace-nowrap outline-none",
                    isActive
                      ? "border-border border-b-background bg-background text-primary translate-y-[2px] shadow-[0px_-2px_0px_0px_var(--primary)_inset]"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground border-b-transparent hover:border-border/50",
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === "payouts" && (
                    <span className="ml-2 bg-purple-500 text-white text-[0.625rem] px-1.5 py-0.5 font-black rounded-none">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content: Transactions */}
          {activeTab === "transactions" && (
            <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
              {/* Filter Toolbar */}
              <div className="p-4 border-b-2 border-border bg-secondary/20 flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-1 w-full max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <NeoInput
                    placeholder="Search by ID, Description..."
                    className="pl-9 h-10 focus-visible:"
                  />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <NeoSelect defaultValue="all">
                    <NeoSelectTrigger className="w-full md:w-40 h-10 text-[0.625rem]">
                      <Filter className="w-3 h-3 mr-2" />
                      <NeoSelectValue placeholder="Type" />
                    </NeoSelectTrigger>
                    <NeoSelectContent>
                      <NeoSelectItem value="all" className="text-[0.625rem]">
                        All Types
                      </NeoSelectItem>
                      <NeoSelectItem
                        value="deposit"
                        className="text-[0.625rem]"
                      >
                        Deposits
                      </NeoSelectItem>
                      <NeoSelectItem value="escrow" className="text-[0.625rem]">
                        Escrow Locked
                      </NeoSelectItem>
                      <NeoSelectItem value="spent" className="text-[0.625rem]">
                        Payouts/Spent
                      </NeoSelectItem>
                    </NeoSelectContent>
                  </NeoSelect>

                  <NeoSelect defaultValue="7days">
                    <NeoSelectTrigger className="w-full md:w-40 h-10 text-[0.625rem]">
                      <NeoSelectValue placeholder="Timeframe" />
                    </NeoSelectTrigger>
                    <NeoSelectContent>
                      <NeoSelectItem value="7days" className="text-[0.625rem]">
                        Last 7 Days
                      </NeoSelectItem>
                      <NeoSelectItem value="30days" className="text-[0.625rem]">
                        Last 30 Days
                      </NeoSelectItem>
                      <NeoSelectItem value="all" className="text-[0.625rem]">
                        All Time
                      </NeoSelectItem>
                    </NeoSelectContent>
                  </NeoSelect>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b-2 border-border text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
                      <th className="p-4 border-r-2 border-border min-w-[120px]">
                        Date & ID
                      </th>
                      <th className="p-4 border-r-2 border-border min-w-[300px]">
                        Description & Source
                      </th>
                      <th className="p-4 border-r-2 border-border min-w-[100px]">
                        Type
                      </th>
                      <th className="p-4 border-r-2 border-border text-right min-w-[120px]">
                        Amount
                      </th>
                      <th className="p-4 text-right min-w-[120px]">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-border font-semibold text-sm">
                    {isTransactionsLoading ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground uppercase text-xs">
                          Loading transactions...
                        </td>
                      </tr>
                    ) : transactions.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-muted-foreground uppercase text-xs">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      transactions.map((tx: any) => (
                        <tr
                          key={tx.id}
                          className="hover:bg-secondary/10 transition-colors group cursor-pointer"
                        >
                          <td className="p-4 border-r-2 border-border">
                            <div className="flex flex-col">
                              <span className="text-xs">
                                {new Date(tx.date || tx.createdAt).toLocaleDateString()}
                              </span>
                              <span className="text-[0.625rem] text-muted-foreground">
                                {new Date(tx.date || tx.createdAt).toLocaleTimeString()}
                              </span>
                              <span className="text-[0.625rem] font-bold text-muted-foreground mt-1 truncate max-w-[100px]" title={tx.id}>
                                {tx.id.split('-')[0]}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 border-r-2 border-border">
                            <div className="font-bold uppercase tracking-wide text-xs mb-2 group-hover:text-primary transition-colors">
                              {tx.desc}
                            </div>
                            <div className="text-[0.625rem] uppercase tracking-widest px-2 py-0.5 border-2 border-border bg-background inline-block">
                              {tx.source || "System"}
                            </div>
                          </td>
                          <td className="p-4 border-r-2 border-border">
                            <div
                              className={cn(
                                "inline-flex items-center justify-center text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 w-24",
                                tx.type === "DEPOSIT"
                                  ? "bg-primary/10 border-primary text-primary"
                                  : tx.type === "ESCROW"
                                    ? "bg-[#E1801E]/10 border-[#E1801E] text-[#E1801E]"
                                    : tx.type === "SPENT" || tx.type === "FEE"
                                      ? "bg-destructive/10 border-destructive text-destructive"
                                      : "bg-purple-500/10 border-purple-500 text-purple-600",
                              )}
                            >
                              {tx.type}
                            </div>
                          </td>
                          <td className="p-4 border-r-2 border-border text-right">
                            <span
                              className={cn(
                                "font-heading font-black tracking-wider text-base",
                                tx.type === "DEPOSIT" || tx.type === "REFUND" || tx.type === "PAYMENT_RECEIVED"
                                  ? "text-primary"
                                  : tx.type === "ESCROW"
                                    ? "text-[#E1801E]"
                                    : "text-destructive",
                              )}
                            >
                              {tx.type === "DEPOSIT" || tx.type === "REFUND" || tx.type === "PAYMENT_RECEIVED"
                                ? "+"
                                : "-"}
                              {formatCurrency(tx.amount)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-heading font-black text-right text-foreground">
                              {formatCurrency(tx.balanceAfter)}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Pending Payouts */}
          {activeTab === "payouts" && (
            <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 border-b-2 border-border bg-purple-500/10 flex items-center justify-between">
                <div>
                  <h3 className="uppercase tracking-widest font-black text-sm text-purple-600">
                    Pending Approvals
                  </h3>
                  <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    Review work and release funds to experts
                  </p>
                </div>
                <NeoButton className="h-10 px-4 text-xs">
                  Approve Selected (0)
                </NeoButton>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/40 border-b-2 border-border text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
                      <th className="p-4 border-r-2 border-border w-10 text-center">
                        <NeoCheckbox />
                      </th>
                      <th className="p-4 border-r-2 border-border min-w-[200px]">
                        Expert
                      </th>
                      <th className="p-4 border-r-2 border-border min-w-[300px]">
                        Task / Milestone
                      </th>
                      <th className="p-4 border-r-2 border-border min-w-[150px]">
                        Deadline
                      </th>
                      <th className="p-4 border-r-2 border-border text-right min-w-[120px]">
                        Amount
                      </th>
                      <th className="p-4 text-center min-w-[100px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y-2 divide-border font-semibold text-sm">
                    {pendingPayouts.map((po) => (
                      <tr
                        key={po.id}
                        className="hover:bg-secondary/10 transition-colors"
                      >
                        <td className="p-4 border-r-2 border-border text-center">
                          <NeoCheckbox />
                        </td>
                        <td className="p-4 border-r-2 border-border">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 flex items-center justify-center font-bold text-xs uppercase border-2 border-border shrink-0">
                              {po.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-xs uppercase">
                                {po.expert}
                              </div>
                              <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                                {po.id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-border">
                          <div className="font-bold uppercase tracking-wide text-xs">
                            {po.task}
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-border">
                          <div
                            className={cn(
                              "text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 inline-block",
                              po.deadline.includes("Action")
                                ? "bg-destructive/10 text-destructive border-destructive"
                                : "bg-[#E1801E]/10 text-[#E1801E] border-[#E1801E]",
                            )}
                          >
                            {po.deadline}
                          </div>
                        </td>
                        <td className="p-4 border-r-2 border-border text-right">
                          <span className="font-heading font-black tracking-wider text-base text-foreground">
                            {po.amount}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <NeoButton
                            variant="outline"
                            className="text-[0.625rem] h-8 bg-primary/10 w-full"
                          >
                            Release
                          </NeoButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Tab Content: Budget Reports */}
          {activeTab === "reports" && (
            <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 border-b-2 border-border bg-secondary/20 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <PieChart className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="uppercase tracking-widest font-black text-sm">
                      Budget Utilization
                    </h3>
                    <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                      Breakdown by Project Space
                    </p>
                  </div>
                </div>
                <NeoButton
                  variant="outline"
                  className="text-xs h-10 px-4 w-full md:w-auto"
                >
                  <Download className="w-4 h-4 mr-2" /> Export CSV
                </NeoButton>
              </div>

              <div className="p-6">
                <div className="space-y-8">
                  {budgetReports.map((report) => (
                    <div
                      key={report.id}
                      className="border-2 border-border p-4 hover:bg-secondary/5 transition-colors group"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                        <div>
                          <h4 className="font-heading font-black text-lg uppercase group-hover:text-primary transition-colors">
                            {report.name}
                          </h4>
                          <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                            {report.id}
                          </span>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                              Budget
                            </span>
                            <span className="font-heading font-black">
                              {report.expected}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                              Spent
                            </span>
                            <span className="font-heading font-black text-destructive">
                              {report.spent}
                            </span>
                          </div>
                          <div>
                            <span className="block text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                              Escrow
                            </span>
                            <span className="font-heading font-black text-[#E1801E]">
                              {report.escrow}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Brutalist Progress Bar */}
                      <div>
                        <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest mb-1">
                          <span>Utilization</span>
                          <span
                            className={cn(
                              report.utilized >= 90
                                ? "text-destructive"
                                : "text-primary",
                            )}
                          >
                            {report.utilized}%
                          </span>
                        </div>
                        <div className="h-4 w-full border-2 border-border bg-secondary/30 relative">
                          <div
                            className={cn(
                              "h-full border-r-2 border-border",
                              report.utilized >= 90
                                ? "bg-destructive"
                                : report.utilized >= 75
                                  ? "bg-[#E1801E]"
                                  : "bg-primary",
                            )}
                            style={{ width: `${report.utilized}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab Content: Settings */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="lg:col-span-2 space-y-6">
                {/* Payment Methods */}
                <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
                  <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" /> Payment
                    Methods
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border-2 border-primary bg-primary/5 shadow-[2px_2px_0px_0px_var(--primary)] -translate-y-[1px]">
                      <div className="w-12 h-8 bg-secondary border-2 border-border flex items-center justify-center font-black text-xs">
                        VISA
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-bold text-sm uppercase">
                          Visa ending in 4242
                        </div>
                        <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                          Expires 12/28 • Default
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <NeoButton
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-destructive text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </NeoButton>
                      </div>
                    </div>

                    <NeoButton
                      variant="outline"
                      className="w-full border-dashed h-12 text-xs"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add New Payment Method
                    </NeoButton>
                  </div>
                </div>

                {/* Automation & Escrow */}
                <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
                  <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#E1801E]" /> Escrow
                    Automation
                  </h3>

                  <div className="space-y-4 mt-4">
                    <div className="flex items-start gap-3">
                      <NeoCheckbox
                        id="auto-escrow"
                        defaultChecked
                        className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                      />
                      <div>
                        <label
                          htmlFor="auto-escrow"
                          className="font-bold text-sm uppercase cursor-pointer block"
                        >
                          Auto-Fund Escrow on Task Accept
                        </label>
                        <p className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest mt-1">
                          Automatically deduct from Wallet or charge Default
                          Payment Method when you accept an expert's proposal.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 h-fit">
                <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-foreground" /> Notifications
                </h3>

                <div className="space-y-6">
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="notif-payout"
                      className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer"
                    >
                      Payout Successful
                    </label>
                    <NeoCheckbox id="notif-payout" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="notif-low"
                      className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer"
                    >
                      Low Wallet Balance
                    </label>
                    <NeoCheckbox id="notif-low" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <label
                      htmlFor="notif-action"
                      className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer text-[#E1801E]"
                    >
                      Action Required (Escrow)
                    </label>
                    <NeoCheckbox
                      id="notif-action"
                      defaultChecked
                      className="border-[#E1801E] data-[state=checked]:bg-[#E1801E] data-[state=checked]:text-white"
                    />
                  </div>

                  <NeoButton className="w-full mt-4 text-[0.625rem]">
                    Save Preferences
                  </NeoButton>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal (Brutalist Popup) */}
      {isDepositOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30">
              <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                <ArrowDownRight className="w-6 h-6 text-primary" /> Deposit
                Funds
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => setIsDepositOpen(false)}
                className="border-transparent h-8 w-8"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <NeoButton
                    variant="outline"
                    className="border-2 border-border hover:border-primary hover:bg-primary/5 py-3 font-heading font-black text-lg transition-colors"
                  >
                    $5K
                  </NeoButton>
                  <NeoButton className="py-3 font-heading font-black text-lg shadow-[2px_2px_0px_0px_var(--primary)] -translate-y-[2px] transition-all">
                    $10K
                  </NeoButton>
                  <NeoButton
                    variant="outline"
                    className="border-2 border-border hover:border-primary hover:bg-primary/5 py-3 font-heading font-black text-lg transition-colors"
                  >
                    $50K
                  </NeoButton>
                </div>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-heading font-black text-lg text-muted-foreground">
                    $
                  </span>
                  <NeoInput
                    type="number"
                    defaultValue="10000"
                    className="pl-10 h-14 focus-visible: font-heading text-xl"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-4 p-4 border-2 border-primary bg-primary/5 shadow-[2px_2px_0px_0px_var(--primary)] cursor-pointer -translate-y-[2px]">
                    <CreditCard className="w-6 h-6 text-primary" />
                    <div className="flex-1">
                      <div className="font-bold text-sm uppercase">
                        Credit Card
                      </div>
                      <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                        Ending in 4242
                      </div>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </label>

                  <label className="flex items-center gap-4 p-4 border-2 border-border hover:bg-secondary/20 cursor-pointer">
                    <Wallet className="w-6 h-6 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="font-bold text-sm uppercase">
                        Bank Transfer
                      </div>
                      <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                        Wire / ACH (No fees)
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="bg-secondary/20 p-4 border-2 border-border">
                <div className="flex justify-between text-sm font-semibold mb-2">
                  <span>Amount to deposit</span>
                  <span>$10,000.00</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-muted-foreground mb-4">
                  <span>Processing Fee (2.9%)</span>
                  <span>$290.00</span>
                </div>
                <div className="flex justify-between text-lg font-heading font-black border-t-2 border-border pt-4">
                  <span>Total Charge</span>
                  <span>$10,290.00</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex gap-4">
              <NeoButton
                variant="outline"
                onClick={() => setIsDepositOpen(false)}
                className="flex-1 h-12"
              >
                Cancel
              </NeoButton>
              <NeoButton
                onClick={() => setIsDepositOpen(false)}
                className="flex-1 h-12"
              >
                Confirm Deposit
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

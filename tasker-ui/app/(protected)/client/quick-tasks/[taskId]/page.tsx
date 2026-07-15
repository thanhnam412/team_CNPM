"use client";

import { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Clock,
  Paperclip,
  MessageSquareText,
  CheckCircle2,
  Star,
  Download,
  Send,
  AlertTriangle,
  ShieldCheck,
  UserCheck,
  AlertCircle,
  Search,
  Edit,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn, formatCurrency } from "@/lib/utils";

import { useQuickTask, useApproveQuickTaskDeliverableMutation, useCancelQuickTaskMutation } from "@/tanstack/useQuickTasks";
import { useQuickTaskProposals, useUpdateProposalStatusMutation, useAcceptProposalMutation } from "@/tanstack/useProposals";
import { useContracts, useReleaseFundsMutation } from "@/tanstack/useContracts";

export default function QuickTaskDetailsPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const resolvedParams = use(params);
  const taskId = resolvedParams.taskId;

  const { data: task, isLoading: isTaskLoading } = useQuickTask(taskId);
  const { data: proposals = [], isLoading: isProposalsLoading } = useQuickTaskProposals(taskId);
  const { data: contracts = [] } = useContracts();

  const updateProposalMutation = useUpdateProposalStatusMutation();
  const acceptProposalMutation = useAcceptProposalMutation();
  const approveQuickTaskMutation = useApproveQuickTaskDeliverableMutation();
  const cancelTaskMutation = useCancelQuickTaskMutation();
  
  const activeContract = contracts.find((c) => c.quickTaskId === taskId);

  const [chatInput, setChatInput] = useState("");

  if (isTaskLoading) {
    return <div className="p-8 text-center text-muted-foreground">Loading task details...</div>;
  }

  if (!task) {
    return <div className="p-8 text-center text-destructive">Task not found</div>;
  }

  const status = task.status ? task.status.toLowerCase() : "open";

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Removed Mock UI Toolbar */}

      {/* Main Content Scrollable Area */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-5xl mx-auto space-y-6 pb-24">
          {/* Back & Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link href="/client/quick-tasks">
              <NeoButton variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="w-4 h-4" />
              </NeoButton>
            </Link>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
              Quick Tasks / {taskId}
            </span>
          </div>

          {/* Header Row */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch">
            {/* Title & Status Block */}
            <div className="flex-1 bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span
                  className={cn(
                    "text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2",
                    status === "open"
                      ? "bg-[#E1801E]/10 text-[#E1801E] border-[#E1801E]"
                      : status === "in_progress"
                        ? "bg-blue-500/10 text-blue-600 border-blue-500"
                        : status === "review"
                          ? "bg-purple-500/10 text-purple-600 border-purple-500"
                          : "bg-primary/10 text-primary border-primary",
                  )}
                >
                  Status: {status.replace("_", "")}
                </span>

                {status !== "completed" && (
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center bg-secondary px-2 py-1 border-2 border-border">
                    <Clock className="w-3 h-3 mr-1" />
                    {status === "open"
                      ? `Deadline: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'N/A'}`
                      : "Time Left: 2 Days 4 Hrs"}
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-3xl font-heading font-black tracking-widest uppercase text-foreground leading-tight">
                {task.title}
              </h1>

              {status === "open" && (
                <div className="mt-6 flex gap-2">
                  <NeoButton
                    variant="outline"
                    className="text-[0.625rem] h-8 px-4"
                  >
                    <Edit className="w-3 h-3 mr-2" /> Edit Task
                  </NeoButton>
                  <NeoButton
                    variant="outline"
                    className="border-destructive text-destructive text-[0.625rem] h-8 px-4"
                    disabled={cancelTaskMutation.isPending}
                    onClick={() => cancelTaskMutation.mutate(taskId)}
                  >
                    {cancelTaskMutation.isPending ? "Canceling..." : "Cancel Task"}
                  </NeoButton>
                </div>
              )}
            </div>

            {/* Escrow Widget */}
            <div className="w-full md:w-64 shrink-0 bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] flex flex-col justify-center">
              <h3 className="uppercase tracking-widest font-bold text-[0.625rem] text-muted-foreground mb-2 flex items-center gap-2">
                <Lock className="w-3 h-3" /> Escrow Status
              </h3>

              {status === "open" ? (
                <div>
                  <div className="text-2xl font-heading font-black tracking-wider text-muted-foreground mb-2">
                    Unfunded
                  </div>
                  <p className="text-[0.625rem] font-semibold text-muted-foreground leading-relaxed">
                    <span className="font-bold text-foreground block mb-1">Budget: {formatCurrency(Number(task.budget))}</span>
                    Deposit funds to safely hire an expert. Money is held
                    securely until you approve the work.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-3xl font-heading font-black tracking-wider text-[#E1801E] mb-2">
                    {formatCurrency(Number(activeContract?.agreedPrice || task.budget))}
                  </div>
                  <div className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-[#E1801E] bg-[#E1801E]/10 px-2 py-1 border-2 border-[#E1801E] mb-2">
                    <ShieldCheck className="w-3 h-3" /> Locked & Secured
                  </div>
                  {activeContract && Number(activeContract.agreedPrice) < Number(task.budget) && (
                    <div className="text-[0.625rem] font-bold text-green-600 bg-green-500/10 px-2 py-1 border border-green-500 uppercase tracking-widest mt-2 text-center">
                      Saved {formatCurrency(Number(task.budget) - Number(activeContract.agreedPrice))} vs budget!
                    </div>
                  )}
                  {activeContract && Number(activeContract.agreedPrice) > Number(task.budget) && (
                    <div className="text-[0.625rem] font-bold text-destructive bg-destructive/10 px-2 py-1 border border-destructive uppercase tracking-widest mt-2 text-center">
                      {formatCurrency(Number(activeContract.agreedPrice) - Number(task.budget))} over budget
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Conditional Content Based on State */}

          {/* STATE: OPEN */}
          {status === "open" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Details */}
              <div className="lg:col-span-2 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 space-y-6">
                <div>
                  <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4">
                    Task Description
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground leading-relaxed">
                    {task.description}
                  </p>
                </div>
                <div>
                  <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {["API Integration", "Web", "General"].map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-bold uppercase tracking-widest px-3 py-1 border-2 border-border bg-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Proposals */}
              <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
                <div className="p-4 border-b-2 border-border bg-secondary/20">
                  <h3 className="uppercase tracking-widest font-black text-sm flex items-center justify-between">
                    Proposals
                    <span className="bg-primary text-primary-foreground px-2 py-0.5 text-xs">
                      {proposals.length}
                    </span>
                  </h3>
                </div>
                <div className="divide-y-2 divide-border">
                  {proposals.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-xs uppercase">No proposals yet</div>
                  ) : proposals.map((p: any) => (
                    <div
                      key={p.id}
                      className="p-4 hover:bg-secondary/10 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-sm uppercase">
                            Expert: {p.expertId.substring(0,8)}
                          </h4>
                        </div>
                        <div className="text-right">
                          <div className={cn("font-heading font-black", Number(p.proposedPrice) < Number(task.budget) ? "text-green-600" : Number(p.proposedPrice) > Number(task.budget) ? "text-destructive" : "")}>
                            {formatCurrency(Number(p.proposedPrice || 0))}
                          </div>
                          {Number(p.proposedPrice) < Number(task.budget) && (
                            <div className="text-[0.625rem] text-green-600 font-bold uppercase tracking-widest">
                              -{formatCurrency(Number(task.budget) - Number(p.proposedPrice))}
                            </div>
                          )}
                          {Number(p.proposedPrice) > Number(task.budget) && (
                            <div className="text-[0.625rem] text-destructive font-bold uppercase tracking-widest">
                              +{formatCurrency(Number(p.proposedPrice) - Number(task.budget))}
                            </div>
                          )}
                          <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                            {p.status}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-muted-foreground italic mb-3 line-clamp-2">
                        "{p.coverLetter || 'No cover letter provided'}"
                      </p>
                      {p.status === "PENDING" && (
                        <div className="flex gap-2">
                          <NeoButton
                            variant="outline"
                            className="flex-1 text-[0.625rem] h-8"
                          >
                            Chat
                          </NeoButton>
                          <NeoButton
                            variant="outline"
                            className="flex-1 border-destructive text-destructive text-[0.625rem] h-8"
                            disabled={updateProposalMutation.isPending}
                            onClick={() => updateProposalMutation.mutate({ proposalId: p.id, status: "REJECTED" })}
                          >
                            Reject
                          </NeoButton>
                          <NeoButton 
                            className="flex-1 text-[0.625rem] h-8"
                            disabled={acceptProposalMutation.isPending}
                            onClick={() => acceptProposalMutation.mutate({ proposalId: p.id })}
                          >
                            Accept & Hire
                          </NeoButton>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STATE: IN PROGRESS */}
          {status === "in_progress" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[500px]">
              {/* Expert Info & Chat */}
              <div className="lg:col-span-2 bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] flex flex-col">
                <div className="p-4 border-b-2 border-border bg-secondary/20 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-none border-2 border-border bg-primary/20 flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="uppercase tracking-widest font-black text-sm">
                      Working with: DataScrapeInc
                    </h3>
                    <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                      Hired Expert • Online
                    </p>
                  </div>
                </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/5">
                      <div className="flex justify-center">
                        <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground bg-secondary px-2 py-1 border-2 border-border">
                          Contract Active. Work started.
                        </span>
                      </div>

                      <div className="flex gap-3 max-w-[80%]">
                        <div className="w-8 h-8 shrink-0 bg-primary/20 border-2 border-border flex items-center justify-center font-bold text-xs uppercase">
                          DS
                        </div>
                        <div className="bg-card border-2 border-border p-3 shadow-[2px_2px_0px_0px_var(--border)]">
                          <p className="text-sm font-semibold">
                            Hi! I've started setting up the proxy pool for the
                            scraper. Will have a sample CSV ready for you tomorrow.
                          </p>
                          <span className="text-[0.625rem] font-bold text-muted-foreground mt-2 block">
                            10:42 AM
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t-2 border-border bg-card">
                      <div className="flex gap-2 relative">
                        <NeoButton
                          variant="ghost"
                          size="icon"
                          className="absolute left-1 top-1/2 -translate-y-1/2"
                        >
                          <Paperclip className="w-4 h-4 text-muted-foreground" />
                        </NeoButton>
                        <NeoInput
                          placeholder="Type a message..."
                          className="pl-10 h-12 focus-visible:"
                        />
                        <NeoButton className="h-12 px-6">
                          <Send className="w-4 h-4" />
                        </NeoButton>
                      </div>
                    </div>
              </div>

              {/* Task Reference */}
              <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 overflow-y-auto">
                <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4">
                  Task Details
                </h3>
                <p className="text-xs font-semibold text-muted-foreground leading-relaxed mb-4">
                  {task.description}
                </p>

                <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-4 mt-6">
                  Actions
                </h3>
                <NeoButton
                  variant="outline"
                  className="w-full border-destructive text-destructive text-[0.625rem] h-10"
                >
                  Request Cancellation
                </NeoButton>
              </div>
            </div>
          )}

          {/* STATE: REVIEW */}
          {status === "review" && (
            <div className="space-y-6">
              <div className="bg-purple-500/10 border-2 border-purple-500 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-500 flex items-center justify-center text-white shrink-0 border-2 border-border">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-lg uppercase text-purple-600">
                      Expert has submitted work!
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Please review the deliverables below. Escrow will
                      auto-release in 3 days if no action is taken.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <NeoButton
                    variant="outline"
                    className="flex-1 md:flex-none border-destructive text-destructive text-[0.625rem] h-12 px-6"
                  >
                    Request Changes
                  </NeoButton>
                  <NeoButton 
                    className="flex-1 md:flex-none text-[0.625rem] h-12 px-6"
                    disabled={approveQuickTaskMutation.isPending}
                    onClick={() => approveQuickTaskMutation.mutate(taskId)}
                  >
                    {approveQuickTaskMutation.isPending ? "Approving..." : "Approve & Release Funds"}
                  </NeoButton>
                </div>
              </div>

              <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
                <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-6 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Submitted Deliverables
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-2 border-border p-4 flex items-center justify-between hover:bg-secondary/20 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex items-center justify-center font-bold text-xs uppercase border-2 border-border">
                        .PY
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          scraper_script.py
                        </div>
                        <div className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest">
                          14 KB • Source Code
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="border-2 border-border p-4 flex items-center justify-between hover:bg-secondary/20 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary flex items-center justify-center font-bold text-xs uppercase border-2 border-border">
                        .CSV
                      </div>
                      <div>
                        <div className="font-bold text-sm">
                          sample_output.csv
                        </div>
                        <div className="text-[0.625rem] font-semibold text-muted-foreground uppercase tracking-widest">
                          2.1 MB • Data
                        </div>
                      </div>
                    </div>
                    <Download className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                <div className="mt-6 border-t-2 border-border pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">
                    Expert's Note:
                  </h4>
                  <div className="p-4 bg-secondary/10 border-2 border-border text-sm font-semibold italic">
                    "All requested features are implemented. I included a README
                    file inside the python script comments on how to install
                    requirements. Let me know if you need any adjustments!"
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STATE: COMPLETED */}
          {status === "completed" && (
            <div className="space-y-6">
              <div className="bg-primary/10 border-2 border-primary p-6 flex flex-col items-center justify-center text-center py-12 shadow-[4px_4px_0px_0px_var(--primary)]">
                <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center bg-background mb-4">
                  <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-heading font-black tracking-widest uppercase text-primary mb-2">
                  Task Completed
                </h2>
                <p className="text-sm font-semibold text-muted-foreground max-w-md mx-auto mb-6">
                  Funds have been successfully released from Escrow. Thank you
                  for using the AI Tasker Marketplace!
                </p>
                <NeoButton variant="outline" className="text-xs h-10 px-6">
                  View Invoice
                </NeoButton>
              </div>

              <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6 max-w-2xl mx-auto">
                <h3 className="uppercase tracking-widest font-black text-sm border-b-2 border-border pb-4 mb-6 text-center">
                  Rate DataScrapeInc
                </h3>

                <div className="flex justify-center gap-2 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-10 h-10 text-muted-foreground hover:text-[#E1801E] hover:fill-[#E1801E] cursor-pointer transition-colors"
                    />
                  ))}
                </div>

                <NeoTextarea
                  placeholder="Leave a public review for this expert..."
                  className="min-h-[100px] focus-visible: mb-4"
                />

                <NeoButton className="w-full h-12">Submit Review</NeoButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

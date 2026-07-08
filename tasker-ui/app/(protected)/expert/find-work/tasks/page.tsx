"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Wallet,
  TerminalSquare,
  Handshake,
  ExternalLink,
  X,
  FileSignature,
  CheckCircle2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoCard, NeoCardContent } from "@/components/ui-custom/neo-card";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import {
  NeoDrawer,
  NeoDrawerClose,
  NeoDrawerContent,
  NeoDrawerFooter,
  NeoDrawerHeader,
  NeoDrawerTitle,
} from "@/components/ui-custom/neo-drawer";

import { useQuickTasks } from "@/tanstack/useQuickTasks";
import { useSubmitQuickTaskProposalMutation } from "@/tanstack/useProposals";
import { useGetMe } from "@/tanstack/useGetMe";

export default function FindTasksPage() {
  const { data: me } = useGetMe();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [drawerMode, setDrawerMode] = useState<"overview" | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const { data: rawTasks = [], isLoading } = useQuickTasks();

  const TASKS = rawTasks
    .filter((t: any) => t.status === "OPEN")
    .filter((t: any) =>
      searchQuery
        ? t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchQuery.toLowerCase())
        : true,
    )
    .sort((a: any, b: any) => {
      if (filter === "budget_high") {
        return (Number(b.budget) || 0) - (Number(a.budget) || 0);
      }
      if (filter === "deadline") {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      // "all" (Newest First)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  const createProposalMutation = useSubmitQuickTaskProposalMutation();

  const handleCreateProposal = () => {
    createProposalMutation.mutate(
      {
        quickTaskId: selectedTask.id,
        payload: {
          proposedPrice: proposedPrice,
          coverLetter: coverLetter,
        },
      },
      {
        onSuccess: () => {
          setSelectedTask(null);
          setDrawerMode(null);
          setIsRequestModalOpen(false);
          setContractType(null);
          setCoverLetter("");
          setProposedPrice("");
        },
      },
    );
  };

  const [contractType, setContractType] = useState<
    "platform" | "external" | null
  >(null);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">

      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 border-b-2 border-border shrink-0">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <NeoInput
            placeholder="Search tasks by keyword or technology..."
            className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <NeoSelect value={filter} onValueChange={(val) => setFilter(val || "all")}>
            <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
              <Filter className="w-4 h-4 mr-2" />
              <NeoSelectValue placeholder="Sort By" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all" className="text-xs">
                Newest First
              </NeoSelectItem>
              <NeoSelectItem
                value="budget_high"
                className="text-xs text-warning"
              >
                Highest Budget
              </NeoSelectItem>
              <NeoSelectItem value="deadline" className="text-xs text-red-600">
                Urgent Deadline
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pb-12">
          {TASKS.map((task) => (
            <NeoCard
              key={task.id}
              variant="interactive"
              className="flex flex-col md:flex-row items-stretch group cursor-pointer"
              onClick={() => {
                setSelectedTask(task);
                setDrawerMode("overview");
              }}
            >
              {/* Left Content Area */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <NeoBadge
                      variant="secondary"
                      className="bg-secondary/20 text-muted-foreground border-border flex items-center"
                    >
                      Client ID: {task.clientId.substring(0, 8)}
                    </NeoBadge>
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-destructive flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Due:{" "}
                      {task.deadline
                        ? new Date(task.deadline).toLocaleDateString()
                        : "Flexible"}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>

                  {/* Terminal Style Description */}
                  <div className="relative border-2 border-foreground bg-secondary/10 shadow-[2px_2px_0px_0px_var(--foreground)] p-1 mt-4">
                    <div className="bg-foreground flex items-center gap-2 px-3 py-1.5 border-b-2 border-foreground mb-1">
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                      <div className="w-2 h-2 rounded-full bg-warning" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-[0.5rem] font-mono text-background/50 ml-2 uppercase font-bold tracking-widest flex items-center gap-1">
                        <TerminalSquare className="w-3 h-3" />
                        {""}
                        task_description.txt
                      </span>
                    </div>
                    <div className="p-3 font-mono text-xs leading-relaxed text-foreground min-h-[80px]">
                      {task.description}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-muted-foreground">
                  <span className="text-[0.625rem] font-black uppercase tracking-widest">
                    {task.proposals?.length || 0}
                  </span>
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest">
                    Proposals Submitted
                  </span>
                </div>
              </div>

              {/* Right Action Area */}
              <div className="md:w-48 shrink-0 border-t-4 md:border-t-0 md:border-l-4 border-foreground bg-muted-foreground flex flex-col items-center justify-center gap-4 p-6">
                {/* Budget badge */}
                <div className="text-center">
                  <div className="text-[0.5rem] font-bold uppercase tracking-widest text-background/50 mb-0.5">
                    Bounty
                  </div>
                  <div className="font-heading font-black text-2xl text-warning">
                    {formatCurrency(task.budget)}
                  </div>
                </div>
                <NeoButton
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTask(task);
                    setIsRequestModalOpen(true);
                  }}
                  variant="secondary"
                  className="w-full h-12 text-xs"
                >
                  Request <Handshake className="w-4 h-4 ml-1" />
                </NeoButton>
              </div>
            </NeoCard>
          ))}
        </div>
      </div>

      {/* Task Overview Drawer */}
      <NeoDrawer
        open={!!selectedTask && !!drawerMode}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerMode(null);
            if (!isRequestModalOpen) setSelectedTask(null);
          }
        }}
      >
        <NeoDrawerContent side="right">
          <NeoDrawerHeader className="flex flex-row justify-between items-center space-y-0">
            <NeoDrawerTitle className="flex items-center gap-3">
              <FileSignature className="w-6 h-6 text-primary" /> Task Overview
            </NeoDrawerTitle>
            <NeoButton
              variant="ghost"
              size="icon"
              onClick={() => {
                setDrawerMode(null);
                if (!isRequestModalOpen) setSelectedTask(null);
              }}
              className="border-transparent h-8 w-8 shrink-0"
            >
              <X className="w-5 h-5" />
            </NeoButton>
          </NeoDrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {drawerMode === "overview" && selectedTask && (
              <div className="space-y-8">
                {/* Task Meta */}
                <div className="bg-foreground text-background p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-2">
                      Client ID: {selectedTask?.clientId}
                    </div>
                    <div className="font-heading font-black text-2xl uppercase mb-2">
                      {selectedTask?.title}
                    </div>
                    <div className="flex gap-4 text-xs font-bold uppercase text-background/80">
                      <span>
                        Posted:{" "}
                        {new Date(selectedTask.createdAt).toLocaleDateString()}
                      </span>
                      <span>Proposals: {selectedTask.proposalsCount || 0}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                      Bounty
                    </div>
                    <div className="font-heading font-black text-3xl text-warning">
                      {formatCurrency(selectedTask?.budget || 0)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-heading font-black text-lg uppercase border-b-2 border-foreground pb-2 mb-4">
                    Task Description
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedTask?.description}
                  </p>
                </div>

                {/* Skills & Additional Info Placeholders (To be fetched from API later) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border-2 border-foreground bg-secondary/10">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                      Required Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTask?.skills?.map((skill: string) => (
                        <NeoBadge key={skill}>{skill}</NeoBadge>
                      )) || (
                        <span className="text-xs italic text-muted-foreground">
                          No skills specified
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 border-2 border-foreground bg-secondary/10">
                    <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                      Client Info
                    </h4>
                    <div className="text-sm">
                      <p>
                        <strong>Experience Level:</strong>{" "}
                        {selectedTask?.experienceLevel || "Any"}
                      </p>
                      <p>
                        <strong>Project Type:</strong>{" "}
                        {selectedTask?.projectType || "One-time"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <NeoDrawerFooter>
            <NeoButton
              variant="outline"
              onClick={() => {
                setDrawerMode(null);
                if (!isRequestModalOpen) setSelectedTask(null);
              }}
              className="h-14 px-8"
            >
              Cancel
            </NeoButton>
            <NeoButton
              onClick={() => {
                setDrawerMode(null);
                setIsRequestModalOpen(true);
              }}
              className="h-14 px-10 text-lg"
            >
              Apply Now <Handshake className="w-5 h-5 ml-2" />
            </NeoButton>
          </NeoDrawerFooter>
        </NeoDrawerContent>
      </NeoDrawer>

      {/* Request Modal with Contract Signing */}
      {isRequestModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_var(--foreground)] w-full max-w-3xl animate-in zoom-in-95 duration-200 my-8">
            <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30">
              <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                <Handshake className="w-6 h-6 text-warning" /> Request to Work
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => {
                  setIsRequestModalOpen(false);
                  if (!drawerMode) setSelectedTask(null);
                  setContractType(null);
                }}
                className="border-transparent h-8 w-8"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Task Summary */}
              <div className="bg-foreground text-background p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                    Applying for Task
                  </div>
                  <div className="font-heading font-black text-xl uppercase">
                    {selectedTask?.title}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                    Bounty
                  </div>
                  <div className="font-heading font-black text-2xl text-warning">
                    {formatCurrency(selectedTask?.budget || 0)}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                  Cover Letter / Approach
                </label>
                <NeoTextarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Briefly explain how you plan to solve this task..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Proposed Price */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                  Proposed Price ($)
                </label>
                <NeoInput
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  placeholder={String(selectedTask?.budget || "")}
                />
              </div>

              {/* Contract Signing Selection */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-4 flex items-center gap-2">
                  <FileSignature className="w-4 h-4 text-primary" /> Contract
                  Signing Method
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Platform Option */}
                  <div
                    onClick={() => setContractType("platform")}
                    className={cn(
                      "border-4 p-6 cursor-pointer transition-all flex flex-col justify-between h-full min-h-[180px]",
                      contractType === "platform"
                        ? "border-primary bg-primary/5 shadow-[6px_6px_0px_0px_var(--primary)] -translate-y-1"
                        : "border-border bg-card hover:border-foreground hover:shadow-[4px_4px_0px_0px_var(--border)]",
                    )}
                  >
                    <div>
                      <div className="w-10 h-10 bg-primary/20 border-2 border-primary flex items-center justify-center mb-4">
                        <Handshake className="w-5 h-5 text-primary" />
                      </div>
                      <h3 className="font-heading font-black uppercase text-lg mb-2">
                        Platform Escrow
                      </h3>
                      <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Sign internal smart contract. Client pays AITasker
                        upfront. Guaranteed payment upon task approval.
                      </p>
                    </div>
                    {contractType === "platform" && (
                      <div className="mt-4 text-xs font-black text-primary uppercase tracking-widest flex items-center gap-1">
                        Selected <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {/* External Option */}
                  <div
                    onClick={() => setContractType("external")}
                    className={cn(
                      "border-4 p-6 cursor-pointer transition-all flex flex-col justify-between h-full min-h-[180px]",
                      contractType === "external"
                        ? "border-warning bg-warning/5 shadow-[6px_6px_0px_0px_var(--color-warning)] -translate-y-1"
                        : "border-border bg-card hover:border-foreground hover:shadow-[4px_4px_0px_0px_var(--border)]",
                    )}
                  >
                    <div>
                      <div className="w-10 h-10 bg-secondary border-2 border-foreground flex items-center justify-center mb-4">
                        <ExternalLink className="w-5 h-5 text-foreground" />
                      </div>
                      <h3 className="font-heading font-black uppercase text-lg mb-2">
                        External Contract
                      </h3>
                      <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Sign via Upwork, DocuSign, etc. AITasker does not hold
                        funds or guarantee payment.
                      </p>
                    </div>
                    {contractType === "external" && (
                      <div className="mt-4 text-xs font-black text-warning uppercase tracking-widest flex items-center gap-1">
                        Selected <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* External Link Input (Conditional) */}
                <div
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    contractType === "external"
                      ? "grid-rows-[1fr] opacity-100 mt-4"
                      : "grid-rows-[0fr] opacity-0 mt-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-4 border-2 border-dashed border-warning bg-warning/5">
                      <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                        External Platform URL (Upwork Job Link, DocuSign, etc.)
                        *
                      </label>
                      <NeoInput placeholder="https://..." />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex justify-end gap-4">
              <NeoButton
                variant="outline"
                onClick={() => {
                  setIsRequestModalOpen(false);
                  if (!drawerMode) setSelectedTask(null);
                  setContractType(null);
                }}
                className="h-14 px-8"
              >
                Cancel
              </NeoButton>
              <NeoButton
                disabled={
                  !contractType ||
                  createProposalMutation.isPending ||
                  !coverLetter ||
                  !proposedPrice ||
                  !me?.id
                }
                onClick={handleCreateProposal}
                className="h-14 px-10 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createProposalMutation.isPending
                  ? "Submitting..."
                  : "Submit Request"}
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

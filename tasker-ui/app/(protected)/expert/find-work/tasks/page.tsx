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
import { cn } from "@/lib/utils";
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

const TASKS = [
  {
    id: "qt-1",
    title: "Write a Python script for web scraping",
    desc: "Need a simple python script using BeautifulSoup to extract data from a specific e-commerce site.",
    budget: "$50",
    deadline: "Tomorrow",
    proposals: 3,
    client: "TechStartup Inc.",
  },
  {
    id: "qt-2",
    title: "Fix CUDA out of memory error in PyTorch",
    desc: "Training script keeps crashing after 2 epochs on an RTX 4090. Need someone to debug and optimize memory usage.",
    budget: "$150",
    deadline: "Today",
    proposals: 1,
    client: "AI_Research_Lab",
  },
  {
    id: "qt-3",
    title: "Optimize SQL Query for Data Pipeline",
    desc: "Our daily ETL pipeline is taking 4 hours. Need a Postgres expert to rewrite the aggregation queries.",
    budget: "$200",
    deadline: "In 3 days",
    proposals: 5,
    client: "DataCorp",
  },
];

export default function FindTasksPage() {
  const [filter, setFilter] = useState("all");
  const [selectedTask, setSelectedTask] = useState<(typeof TASKS)[0] | null>(
    null,
  );
  const [contractType, setContractType] = useState<
    "platform" | "external" | null
  >(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 pb-24">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <NeoInput
            placeholder="Search tasks by keyword or technology..."
            className="pl-9"
          />
        </div>

        <div className="w-full sm:w-64">
          <NeoSelect value={filter} onValueChange={setFilter}>
            <NeoSelectTrigger>
              <Filter className="w-4 h-4 mr-2" />
              <NeoSelectValue placeholder="Sort By" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all">Newest First</NeoSelectItem>
              <NeoSelectItem value="budget_high" className="text-warning">
                Highest Budget
              </NeoSelectItem>
              <NeoSelectItem value="deadline" className="text-red-600">
                Urgent Deadline
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>
        </div>
      </div>

      {/* Task List */}
      <div className="grid grid-cols-1 gap-6 mt-8">
        {TASKS.map((task) => (
          <NeoCard
            key={task.id}
            variant="interactive"
            className="flex flex-col md:flex-row items-stretch group"
          >
            {/* Left Content Area */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 bg-secondary/20 border-2 border-border text-muted-foreground flex items-center">
                    Client: {task.client}
                  </span>
                  <span className="text-[0.625rem] font-bold uppercase tracking-widest text-destructive flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {task.deadline}
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
                    {task.desc}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-2 text-muted-foreground">
                <span className="text-[0.625rem] font-black uppercase tracking-widest">
                  {task.proposals}
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
                  {task.budget}
                </div>
              </div>
              <NeoButton
                onClick={() => setSelectedTask(task)}
                variant="secondary"
                className="w-full h-12 text-xs"
              >
                Request <Handshake className="w-4 h-4 ml-1" />
              </NeoButton>
            </div>
          </NeoCard>
        ))}
      </div>

      {/* Request Modal with Contract Signing */}
      {selectedTask && (
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
                  setSelectedTask(null);
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
                    {selectedTask.title}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                    Bounty
                  </div>
                  <div className="font-heading font-black text-2xl text-warning">
                    {selectedTask.budget}
                  </div>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                  Cover Letter / Approach
                </label>
                <NeoTextarea
                  placeholder="Briefly explain how you plan to solve this task..."
                  className="min-h-[120px]"
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
                {contractType === "external" && (
                  <div className="mt-4 p-4 border-2 border-dashed border-warning bg-warning/5 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      External Platform URL (Upwork Job Link, DocuSign, etc.) *
                    </label>
                    <NeoInput placeholder="https://..." />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex justify-end gap-4">
              <NeoButton
                variant="outline"
                onClick={() => {
                  setSelectedTask(null);
                  setContractType(null);
                }}
                className="h-14 px-8"
              >
                Cancel
              </NeoButton>
              <NeoButton
                disabled={!contractType}
                className="h-14 px-10 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

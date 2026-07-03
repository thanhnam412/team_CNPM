"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Clock,
  Handshake,
  X,
  FileSignature,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Skull,
  Target,
  Layers,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { cn } from "@/lib/utils";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoCard } from "@/components/ui-custom/neo-card";

// Mock Data
const MILESTONES = [
  {
    id: "m-101",
    project: "Build a Customer Churn Prediction Model (PROJ-12)",
    title: "Phase 1: Architecture & Data Pipeline Setup",
    budget: "$2,000",
    deadline: "Oct 1, 2026",
    difficulty: "Medium",
    difficultyIcon: Target,
    difficultyColor: "text-blue-500 border-blue-500 bg-blue-500/10",
    skills: ["AWS", "Data Engineering", "Python"],
    desc: "Set up the initial AWS infrastructure and write the ETL scripts to pull data from Snowflake into an S3 bucket for training.",
  },
  {
    id: "m-102",
    project: "Autonomous Agent for Web Scraping (PROJ-44)",
    title: "Phase 3: Bypass Cloudflare & Recaptcha",
    budget: "$1,500",
    deadline: "Sep 25, 2026",
    difficulty: "Hard",
    difficultyIcon: ShieldAlert,
    difficultyColor: "text-red-500 border-red-500 bg-red-500/10",
    skills: ["Puppeteer", "Reverse Engineering", "Proxies"],
    desc: "The target site recently implemented strict Cloudflare turnstile and dynamic DOM obfuscation. Need to build a resilient scraper that can bypass these.",
  },
  {
    id: "m-103",
    project: "Custom LLM Kernel Optimization (PROJ-89)",
    title: "Phase 2: Write Custom CUDA Kernels for Attention",
    budget: "$5,000",
    deadline: "Nov 1, 2026",
    difficulty: "Nightmare",
    difficultyIcon: Skull,
    difficultyColor: "text-purple-600 border-purple-600 bg-purple-600/10",
    skills: ["CUDA", "C++", "Triton", "PyTorch Internals"],
    desc: "We need 2x speedup on inference over standard FlashAttention for our specific sparse architecture. Requires deep C++ and CUDA kernel knowledge.",
  },
  {
    id: "m-104",
    project: "E-commerce Recommendation Engine (PROJ-05)",
    title: "Phase 1: Exploratory Data Analysis (EDA)",
    budget: "$800",
    deadline: "Sep 20, 2026",
    difficulty: "Easy",
    difficultyIcon: CheckCircle2,
    difficultyColor: "text-green-500 border-green-500 bg-green-500/10",
    skills: ["Pandas", "Jupyter", "Data Visualization"],
    desc: "Perform basic EDA on a 50GB dataset of user clicks. Deliver a Jupyter notebook with insights and data cleaning steps.",
  },
];

export default function FindMilestonesPage() {
  const [filter, setFilter] = useState("all");
  const [selectedMilestone, setSelectedMilestone] = useState<
    (typeof MILESTONES)[0] | null
  >(null);
  const [contractType, setContractType] = useState<
    "platform" | "external" | null
  >(null);

  const getBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "success";
      case "Medium":
        return "info";
      case "Hard":
        return "destructive";
      case "Nightmare":
        return "nightmare";
      default:
        return "default";
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-24">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-card border-2 border-border p-4 shadow-[4px_4px_0px_0px_var(--border)]">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <NeoInput
            placeholder="Search milestones or projects..."
            className="pl-9 h-12 focus-visible: focus-visible:border-primary bg-background"
          />
        </div>

        <div className="w-full sm:w-64">
          <NeoSelect value={filter} onValueChange={setFilter}>
            <NeoSelectTrigger className="w-full h-12 bg-background text-xs focus:border-primary">
              <Filter className="w-4 h-4 mr-2" />
              <NeoSelectValue placeholder="Difficulty" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all" className="text-xs">
                All Difficulties
              </NeoSelectItem>
              <NeoSelectItem value="easy" className="text-xs text-green-500">
                Easy
              </NeoSelectItem>
              <NeoSelectItem value="medium" className="text-xs text-blue-500">
                Medium
              </NeoSelectItem>
              <NeoSelectItem value="hard" className="text-xs text-red-500">
                Hard
              </NeoSelectItem>
              <NeoSelectItem
                value="nightmare"
                className="text-xs text-purple-600"
              >
                Nightmare
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>
        </div>
      </div>

      {/* Grid of Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {MILESTONES.map((milestone) => {
          const DiffIcon = milestone.difficultyIcon;

          return (
            <NeoCard
              key={milestone.id}
              variant="interactive"
              className="flex flex-col group"
            >
              {/* Top Banner - Project Name */}
              <div className="border-b-2 border-border bg-secondary/20 px-4 py-2 flex items-center justify-between">
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2 truncate">
                  <Layers className="w-3 h-3" /> {milestone.project}
                </div>
                <div className="text-[0.625rem] font-black uppercase tracking-widest text-foreground">
                  {milestone.id}
                </div>
              </div>

              {/* Main Content */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-4 gap-4">
                  <h3 className="font-heading font-black text-xl uppercase tracking-wide group-hover:text-primary transition-colors leading-tight">
                    {milestone.title}
                  </h3>

                  {/* Difficulty Badge */}
                  <NeoBadge
                    variant={getBadgeVariant(milestone.difficulty)}
                    className="gap-1.5 px-2.5 py-1"
                  >
                    <DiffIcon className="w-4 h-4" />
                    {milestone.difficulty}
                  </NeoBadge>
                </div>

                <p className="text-sm font-semibold text-muted-foreground mb-6 line-clamp-3 flex-1">
                  {milestone.desc}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {milestone.skills.map((skill) => (
                    <NeoBadge
                      key={skill}
                      variant="outline"
                      className="shadow-none px-2 py-1"
                    >
                      {skill}
                    </NeoBadge>
                  ))}
                </div>

                {/* Footer Stats & Button */}
                <div className="flex items-center justify-between border-t-2 border-border pt-4 mt-auto">
                  <div className="flex gap-6">
                    <div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Budget
                      </div>
                      <div className="font-heading font-black text-xl text-primary">
                        {milestone.budget}
                      </div>
                    </div>
                    <div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                        Due Date
                      </div>
                      <div className="font-heading font-black text-lg text-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {""}
                        {milestone.deadline}
                      </div>
                    </div>
                  </div>

                  <NeoButton
                    onClick={() => setSelectedMilestone(milestone)}
                    className="h-10 px-6 text-xs"
                  >
                    Bid <Handshake className="w-4 h-4 ml-2" />
                  </NeoButton>
                </div>
              </div>
            </NeoCard>
          );
        })}
      </div>

      {/* Contract Signing / Bid Modal (Reused Logic from Quick Tasks) */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_var(--foreground)] w-full max-w-3xl animate-in zoom-in-95 duration-200 my-8">
            <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30">
              <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                <Handshake className="w-6 h-6 text-primary" /> Bid on Milestone
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedMilestone(null);
                  setContractType(null);
                }}
                className="border-transparent h-8 w-8"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 md:p-8 space-y-8">
              {/* Milestone Summary */}
              <div className="bg-foreground text-background p-4 border-b-4 border-primary">
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                  Project: {selectedMilestone.project}
                </div>
                <div className="font-heading font-black text-xl uppercase mb-4">
                  {selectedMilestone.title}
                </div>

                <div className="flex flex-wrap gap-4 items-center justify-between border-t border-background/20 pt-4">
                  <NeoBadge
                    variant={getBadgeVariant(selectedMilestone.difficulty)}
                    className="gap-1 px-2 py-1 shadow-none"
                  >
                    <selectedMilestone.difficultyIcon className="w-4 h-4" />
                    {selectedMilestone.difficulty}
                  </NeoBadge>
                  <div className="font-heading font-black text-2xl text-primary">
                    {selectedMilestone.budget}
                  </div>
                </div>
              </div>

              {/* Proposal Input */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                  Your Proposal for this Milestone
                </label>
                <NeoTextarea
                  placeholder="Explain your approach, timeline, and why you can handle this difficulty level..."
                  className="min-h-[120px] focus-visible: text-sm font-semibold p-4"
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
                        ? "border-[#E1801E] bg-[#E1801E]/5 shadow-[6px_6px_0px_0px_#E1801E] -translate-y-1"
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
                      <div className="mt-4 text-xs font-black text-[#E1801E] uppercase tracking-widest flex items-center gap-1">
                        Selected <CheckCircle2 className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                </div>

                {/* External Link Input (Conditional) */}
                {contractType === "external" && (
                  <div className="mt-4 p-4 border-2 border-dashed border-[#E1801E] bg-[#E1801E]/5 animate-in fade-in slide-in-from-top-2">
                    <label className="text-[0.625rem] font-black uppercase tracking-widest text-foreground block mb-2">
                      External Platform URL (Upwork Job Link, DocuSign, etc.) *
                    </label>
                    <NeoInput
                      placeholder="https://..."
                      className="bg-background h-12"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex justify-end gap-4">
              <NeoButton
                variant="outline"
                onClick={() => {
                  setSelectedMilestone(null);
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
                Submit Bid
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

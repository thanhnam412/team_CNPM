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
import {
  NeoDrawer,
  NeoDrawerContent,
  NeoDrawerFooter,
  NeoDrawerHeader,
  NeoDrawerTitle,
} from "@/components/ui-custom/neo-drawer";

import { formatCurrency } from "@/lib/utils";
import { useAvailableMilestones } from "@/tanstack/useMilestones";
import { useSubmitMilestoneProposalMutation } from "@/tanstack/useProposals";
import { useGetMe } from "@/tanstack/useGetMe";
import {
  ApplyTaskModal,
  ApplyTaskPayload,
} from "@/block-ui/expert/find-work/components/apply-task-modal";

export default function FindMilestonesPage() {
  const { data: me } = useGetMe();
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState<any | null>(null);

  const [drawerMode, setDrawerMode] = useState<"overview" | null>(null);
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);

  const { data: rawMilestones = [], isLoading } = useAvailableMilestones();
  const proposalMutation = useSubmitMilestoneProposalMutation();

  const handleProposalSubmit = (payload: ApplyTaskPayload) => {
    if (!selectedMilestone || !me?.id) return;
    proposalMutation.mutate(
      {
        milestoneId: selectedMilestone.id,
        payload: {
          proposedPrice: payload.proposedPrice
            ? parseFloat(payload.proposedPrice)
            : 0,
          coverLetter: payload.coverLetter,
        },
      },
      {
        onSuccess: () => {
          setSelectedMilestone(null);
          setIsProposalModalOpen(false);
          setDrawerMode(null);
        },
      },
    );
  };

  const MILESTONES = rawMilestones
    .map((m: any) => ({
      id: m.id,
      project: m.projectTitle || "Unknown Project",
      title: m.title,
      budget: m.budget,
      deadline: m.dueDate ? new Date(m.dueDate).toLocaleDateString() : "TBD",
      difficulty: "Medium",
      difficultyIcon: Target,
      skills: ["General"],
      desc: m.title,
    }))
    .filter((m: any) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !m.title.toLowerCase().includes(q) &&
          !m.project.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      if (filter !== "all") {
        if (m.difficulty.toLowerCase() !== filter) return false;
      }
      return true;
    });

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
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 border-b-2 border-border shrink-0">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground z-10" />
          <NeoInput
            placeholder="Search milestones or projects..."
            className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <NeoSelect
            value={filter}
            onValueChange={(val) => setFilter(val || "all")}
          >
            <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
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

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {MILESTONES.map((milestone) => {
            const DiffIcon = milestone.difficultyIcon;

            return (
              <NeoCard
                key={milestone.id}
                variant="interactive"
                className="flex flex-col group cursor-pointer"
                onClick={() => {
                  setSelectedMilestone(milestone);
                  setDrawerMode("overview");
                }}
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
                    {milestone.skills.map((skill: string) => (
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
                          {milestone.budget ? formatCurrency(milestone.budget) : "TBD"}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMilestone(milestone);
                        setIsProposalModalOpen(true);
                      }}
                      className="h-10 px-6 text-xs"
                    >
                      Send Proposal <Handshake className="w-4 h-4 ml-2" />
                    </NeoButton>
                  </div>
                </div>
              </NeoCard>
            );
          })}
        </div>
      </div>

      {/* Milestone Overview Drawer */}
      <NeoDrawer
        open={!!selectedMilestone && !!drawerMode}
        onOpenChange={(open) => {
          if (!open) {
            setDrawerMode(null);
            if (!isProposalModalOpen) setSelectedMilestone(null);
          }
        }}
      >
        <NeoDrawerContent side="right">
          <NeoDrawerHeader className="flex flex-row justify-between items-center space-y-0">
            <NeoDrawerTitle className="flex items-center gap-3">
              <FileSignature className="w-6 h-6 text-primary" /> Milestone
              Overview
            </NeoDrawerTitle>
            <NeoButton
              variant="ghost"
              size="icon"
              onClick={() => {
                setDrawerMode(null);
                if (!isProposalModalOpen) setSelectedMilestone(null);
              }}
              className="border-transparent h-8 w-8 shrink-0"
            >
              <X className="w-5 h-5" />
            </NeoButton>
          </NeoDrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
            {drawerMode === "overview" && selectedMilestone && (
              <div className="space-y-8">
                {/* Meta */}
                <div className="bg-foreground text-background p-6 flex flex-col justify-between items-start gap-4">
                  <div>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-2">
                      Project: {selectedMilestone?.project}
                    </div>
                    <div className="font-heading font-black text-2xl uppercase mb-2">
                      {selectedMilestone?.title}
                    </div>
                    <div className="flex gap-4 text-xs font-bold uppercase text-background/80">
                      <span>Deadline: {selectedMilestone.deadline}</span>
                    </div>
                  </div>
                  <div className="text-left shrink-0 mt-4 border-t border-background/20 pt-4 w-full flex justify-between items-center">
                    <div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                        Budget
                      </div>
                      <div className="font-heading font-black text-3xl text-warning">
                        {selectedMilestone.budget ? formatCurrency(selectedMilestone.budget) : "TBD"}
                      </div>
                    </div>
                    <NeoBadge
                      variant={getBadgeVariant(selectedMilestone.difficulty)}
                      className="gap-1.5 px-3 py-1.5 shadow-none"
                    >
                      <selectedMilestone.difficultyIcon className="w-5 h-5" />
                      {selectedMilestone.difficulty}
                    </NeoBadge>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-heading font-black text-lg uppercase border-b-2 border-foreground pb-2 mb-4">
                    Milestone Description
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                    {selectedMilestone?.desc}
                  </p>
                </div>

                {/* Skills Placeholder */}
                <div className="p-4 border-2 border-foreground bg-secondary/10">
                  <h4 className="font-bold text-xs uppercase tracking-widest mb-3 text-muted-foreground">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedMilestone?.skills?.map((skill: string) => (
                      <NeoBadge key={skill}>{skill}</NeoBadge>
                    )) || (
                      <span className="text-xs italic text-muted-foreground">
                        No skills specified
                      </span>
                    )}
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
                if (!isProposalModalOpen) setSelectedMilestone(null);
              }}
              className="h-14 px-8"
            >
              Cancel
            </NeoButton>
            <NeoButton
              onClick={() => {
                setDrawerMode(null);
                setIsProposalModalOpen(true);
              }}
              className="h-14 px-10 text-lg"
            >
              Apply Now <Handshake className="w-5 h-5 ml-2" />
            </NeoButton>
          </NeoDrawerFooter>
        </NeoDrawerContent>
      </NeoDrawer>

      <ApplyTaskModal
        isOpen={isProposalModalOpen}
        task={selectedMilestone}
        isLoading={proposalMutation.isPending}
        onClose={() => {
          setIsProposalModalOpen(false);
          if (!drawerMode) setSelectedMilestone(null);
        }}
        onSubmit={handleProposalSubmit}
      />
    </div>
  );
}

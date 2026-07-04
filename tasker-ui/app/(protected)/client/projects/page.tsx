"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Plus,
  Clock,
  MessageSquare,
  Eye,
  CheckCircle2,
  MoreVertical,
  Wallet,
  Layers,
  ArrowRight,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { cn } from "@/lib/utils";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoProgress } from "@/components/ui-custom/neo-progress";
import { useProjects } from "@/tanstack/useProjects";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");

  const { data: projects = [], isLoading } = useProjects();

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <NeoPageHeader
        title="Projects"
        description="Manage your large-scale AI initiatives"
        rightContent={
          <Link href="/client/projects/new" className="w-full sm:w-auto">
            <NeoButton className="h-12 px-6 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" />
              Create New Project
            </NeoButton>
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 shrink-0">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <NeoInput
            placeholder="Search projects..."
            className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <NeoSelect value={filter} onValueChange={setFilter}>
            <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
              <Filter className="w-4 h-4 mr-2" />
              <NeoSelectValue placeholder="Filter Status" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all" className="text-xs">
                All Projects
              </NeoSelectItem>
              <NeoSelectItem value="open" className="text-xs text-warning">
                Open
              </NeoSelectItem>
              <NeoSelectItem
                value="progress"
                className="text-xs text-blue-600"
              >
                In Progress
              </NeoSelectItem>
              <NeoSelectItem
                value="review"
                className="text-xs text-purple-600"
              >
                Review
              </NeoSelectItem>
              <NeoSelectItem value="completed" className="text-xs">
                Completed
              </NeoSelectItem>
            </NeoSelectContent>
          </NeoSelect>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pb-12">
          {isLoading ? (
            <div className="text-center p-12 text-muted-foreground">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center p-12 text-muted-foreground">
              No projects found.
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-card border-4 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] transition-all flex flex-col cursor-pointer group"
              >
                {/* Top Banner with Status */}
                <div className="flex flex-wrap items-center justify-between border-b-2 border-border bg-secondary/10 px-6 py-3">
                  <div className="flex items-center gap-4">
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-widest px-3 py-1 border-2",
                        project.statusColor,
                      )}
                    >
                      {project.status}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> {project.deadline}
                    </span>
                  </div>
                  {project.expert && (
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-none border border-foreground bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase">
                        {project.expert.charAt(0)}
                      </div>
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                        Expert: {project.expert}
                      </span>
                    </div>
                  )}
                </div>

                {/* Main Info */}
                <div className="p-6 flex flex-col md:flex-row gap-6 justify-between">
                  <div className="flex-1">
                    <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground max-w-3xl break-words line-clamp-3">
                      {project.desc}
                    </p>

                    {project.status !== "Open" && (
                      <div className="mt-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[0.625rem] font-black uppercase tracking-widest text-foreground flex items-center gap-2">
                            <Layers className="w-4 h-4" /> Milestones (
                            {project.milestones.completed}/
                            {project.milestones.total})
                          </span>
                          <span className="text-[0.625rem] font-bold uppercase tracking-widest text-primary">
                            {project.progress}%
                          </span>
                        </div>
                        <NeoProgress value={project.progress} className="h-3" />
                      </div>
                    )}
                  </div>

                  {/* Stats & Actions */}
                  <div className="w-full md:w-64 shrink-0 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l-2 border-border pt-6 md:pt-0 md:pl-6">
                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          Budget
                        </p>
                        <div className="flex items-center gap-2 text-foreground font-heading font-black text-xl">
                          <Wallet className="w-5 h-5 text-primary" />{" "}
                          {project.budget}
                        </div>
                      </div>

                      {project.status === "Open" && (
                        <div>
                          <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                            Proposals
                          </p>
                          <div className="flex items-center gap-2 text-warning font-heading font-black text-xl">
                            <Eye className="w-5 h-5" /> {project.proposals}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Link href={`/client/projects/${project.id}`}>
                        <NeoButton className="w-full text-xs">
                          Manage Project <ArrowRight className="w-3 h-3 ml-2" />
                        </NeoButton>
                      </Link>

                      {project.status === "Review" && (
                        <NeoButton
                          variant="outline"
                          className="w-full border-purple-500 text-purple-600 bg-purple-500/10 text-[0.625rem]"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-2" /> Review
                          Delivery
                        </NeoButton>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

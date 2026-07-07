"use client";

import { useState } from "react";
import Link from "next/link";
import { quickTaskService } from "@/services/quickTaskService";
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
import { useQuickTasks } from "@/tanstack/useQuickTasks";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function QuickTasksPage() {
  const [filter, setFilter] = useState("all");

  const { data: tasks = [], isLoading: isTasksLoading } = useQuickTasks();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-[#E1801E]/10 text-[#E1801E] border-[#E1801E]";
      case "IN_PROGRESS":
        return "bg-blue-500/10 text-blue-600 border-blue-500";
      case "REVIEW":
        return "bg-purple-500/10 text-purple-600 border-purple-500";
      case "COMPLETED":
        return "bg-primary/10 text-primary border-primary";
      default:
        return "bg-secondary text-muted-foreground border-border";
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Header */}
      <NeoPageHeader
        title="Quick Tasks"
        description="Manage your standalone jobs and experts"
        rightContent={
          <Link href="/client/quick-tasks/create" className="w-full sm:w-auto">
            <NeoButton className="h-12 px-6 w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Create Quick Task
            </NeoButton>
          </Link>
        }
      />

      {/* Toolbar */}
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20 shrink-0 border-b-2 border-border">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <NeoInput
            placeholder="Search tasks or experts..."
            className="pl-9 h-10 focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
          />
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <NeoSelect value={filter} onValueChange={(val) => setFilter(val || "all")}>
            <NeoSelectTrigger className="w-full sm:w-48 h-10 text-xs">
              <Filter className="w-4 h-4 mr-2" />
              <NeoSelectValue placeholder="Filter Status" />
            </NeoSelectTrigger>
            <NeoSelectContent>
              <NeoSelectItem value="all" className="text-xs">
                All Tasks
              </NeoSelectItem>
              <NeoSelectItem value="open" className="text-xs text-[#E1801E]">
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
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
          {isTasksLoading ? (
            <div className="text-center p-8 text-muted-foreground uppercase text-xs">
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center p-8 text-muted-foreground uppercase text-xs">
              No tasks found. Create one!
            </div>
          ) : (
            tasks.map((task: any) => (
              <div
                key={task.id}
                className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex flex-col md:flex-row items-stretch cursor-pointer group"
              >
                {/* Left Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span
                        className={cn(
                          "text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2",
                          getStatusColor(task.status),
                        )}
                      >
                        {task.status}
                      </span>
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" /> Due:{" "}
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <h3 className="font-heading font-black text-xl uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-sm font-semibold text-muted-foreground line-clamp-2 max-w-2xl">
                      {task.description || task.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-muted-foreground" />
                      <span className="font-heading font-black text-lg">
                        {formatCurrency(task.budget)}
                      </span>
                    </div>

                    {task.status === "OPEN" ? (
                      <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#E1801E]">
                        <Eye className="w-4 h-4" /> {task.proposalsCount || 0}{" "}
                        Proposals
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-none border-2 border-border bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase shrink-0">
                          {task.expert?.name?.charAt(0) || "?"}
                        </div>
                        <div>
                          <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                            Expert
                          </p>
                          <span className="text-xs font-bold uppercase">
                            {task.expert?.name || "Assigned"}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Action Area (Desktop) / Bottom Action Area (Mobile) */}
                <div className="md:w-48 shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-border bg-secondary/10 flex flex-row md:flex-col items-center justify-center gap-3 p-4">
                  <Link
                    href={`/client/quick-tasks/${task.id}`}
                    className="w-full"
                  >
                    <NeoButton className="w-full text-[0.625rem]">
                      View Task
                    </NeoButton>
                  </Link>

                  {task.status === "REVIEW" && (
                    <NeoButton
                      variant="outline"
                      className="w-full border-purple-500 text-purple-600 bg-purple-500/10 text-[0.625rem]"
                    >
                      <CheckCircle2 className="w-3 h-3 mr-2" /> Review
                    </NeoButton>
                  )}

                  {task.expert && task.status !== "COMPLETED" && (
                    <NeoButton
                      variant="outline"
                      className="w-full text-[0.625rem]"
                    >
                      <MessageSquare className="w-3 h-3 mr-2" /> Chat
                    </NeoButton>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

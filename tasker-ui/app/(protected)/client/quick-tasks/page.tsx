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

export default function QuickTasksPage() {
  const [filter, setFilter] = useState("all");

  const tasks = [
    {
      id: "qt-1",
      title: "Write a Python script for web scraping",
      desc: "Need a simple python script using BeautifulSoup to extract data from a specific e-commerce site.",
      status: "Open",
      statusColor: "bg-[#E1801E]/10 text-[#E1801E] border-[#E1801E]",
      budget: "$50",
      deadline: "Tomorrow",
      proposals: 3,
      expert: null,
    },
    {
      id: "qt-2",
      title: "Fine-tune Llama-3 on custom medical dataset",
      desc: "Looking for an AI expert to fine-tune Llama-3 8B. Dataset is ready and cleaned.",
      status: "In Progress",
      statusColor: "bg-blue-500/10 text-blue-600 border-blue-500",
      budget: "$500",
      deadline: "In 5 days",
      proposals: 0,
      expert: "AI_Vision_Pro",
    },
    {
      id: "qt-3",
      title: "Review and optimize React Native app performance",
      desc: "App is lagging on Android. Need someone to profile and fix rendering bottlenecks.",
      status: "Review",
      statusColor: "bg-purple-500/10 text-purple-600 border-purple-500",
      budget: "$200",
      deadline: "Today",
      proposals: 0,
      expert: "MobileGuru",
    },
    {
      id: "qt-4",
      title: "Design logo for new SaaS product",
      desc: "Simple, modern, brutalist style logo.",
      status: "Completed",
      statusColor: "bg-primary/10 text-primary border-primary",
      budget: "$100",
      deadline: "Oct 10, 2026",
      proposals: 0,
      expert: "DesignStudio",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b-2 border-border bg-card">
        <div className="px-6 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black tracking-widest uppercase text-foreground">
              Quick Tasks
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              Manage your standalone jobs and experts
            </p>
          </div>

          <Link href="/client/quick-tasks/create">
            <NeoButton className="h-12 px-6  w-full md:w-auto">
              <Plus className="w-4 h-4 mr-2" /> Create Quick Task
            </NeoButton>
          </Link>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-4 bg-secondary/20">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <NeoInput
              placeholder="Search tasks or experts..."
              className="pl-9 h-10 focus-visible: focus-visible:-translate-x-[2px] focus-visible:-translate-y-[2px]"
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
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-5xl mx-auto space-y-6 pb-12">
          {tasks.map((task) => (
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
                        task.statusColor,
                      )}
                    >
                      {task.status}
                    </span>
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Due: {task.deadline}
                    </span>
                  </div>
                  <h3 className="font-heading font-black text-xl uppercase tracking-wide mb-2 group-hover:text-primary transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-sm font-semibold text-muted-foreground line-clamp-2 max-w-2xl">
                    {task.desc}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-muted-foreground" />
                    <span className="font-heading font-black text-lg">
                      {task.budget}
                    </span>
                  </div>

                  {task.status === "Open" ? (
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-[#E1801E]">
                      <Eye className="w-4 h-4" /> {task.proposals} Proposals
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none border-2 border-border bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase shrink-0">
                        {task.expert?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                          Expert
                        </p>
                        <span className="text-xs font-bold uppercase">
                          {task.expert}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Action Area (Desktop) / Bottom Action Area (Mobile) */}
              <div className="md:w-48 shrink-0 border-t-2 md:border-t-0 md:border-l-2 border-border bg-secondary/10 flex flex-row md:flex-col items-center justify-center gap-3 p-4">
                <NeoButton className="w-full text-[0.625rem]">
                  View Task
                </NeoButton>

                {task.status === "Review" && (
                  <NeoButton
                    variant="outline"
                    className="w-full border-purple-500 text-purple-600 bg-purple-500/10 text-[0.625rem]"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-2" /> Review
                  </NeoButton>
                )}

                {task.expert && task.status !== "Completed" && (
                  <NeoButton
                    variant="outline"
                    className="w-full text-[0.625rem]"
                  >
                    <MessageSquare className="w-3 h-3 mr-2" /> Chat
                  </NeoButton>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

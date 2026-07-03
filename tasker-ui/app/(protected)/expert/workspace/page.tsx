"use client";

import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  UploadCloud,
  MoreVertical,
  Zap,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";
import Link from "next/link";

// Mock Data for Expert Workspace
const TASKS = [
  {
    id: "QT-889",
    title: "Write a Python script for web scraping",
    client: "Acme Corp.",
    status: "to_do",
    deadline: "Oct 20, 2026",
    price: "$150.00",
    tags: ["Python", "Scraping"],
  },
  {
    id: "PROJ-123",
    title: "API Integration Module (ERP)",
    client: "Global Tech LLC",
    status: "in_progress",
    deadline: "Oct 15, 2026",
    price: "$800.00",
    tags: ["Node.js", "API"],
    progress: 75,
  },
  {
    id: "QT-890",
    title: "Data cleaning for ML model",
    client: "AI Startup",
    status: "in_review",
    deadline: "Oct 10, 2026",
    price: "$300.00",
    tags: ["Pandas", "Data"],
  },
];

export default function ExpertWorkspacePage() {
  const columns = [
    {
      id: "to_do",
      title: "To Do",
      color: "border-foreground",
      bg: "bg-secondary/10",
    },
    {
      id: "in_progress",
      title: "In Progress",
      color: "border-primary",
      bg: "bg-primary/5",
    },
    {
      id: "in_review",
      title: "In Review",
      color: "border-[#E1801E]",
      bg: "bg-[#E1801E]/10",
    },
    {
      id: "completed",
      title: "Completed",
      color: "border-green-500",
      bg: "bg-green-500/10",
    },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header */}
      <div className="shrink-0 border-b-2 border-border bg-card p-6 md:p-8 z-20 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
              <Zap className="w-8 h-8 md:w-10 md:h-10 text-primary" /> Workspace
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
              Manage your active tasks, submit deliverables, and track
              deadlines.
            </p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-right">
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Total in Escrow
              </div>
              <div className="font-heading font-black text-xl text-primary">
                $1,250.00
              </div>
            </div>
            <Link href="/client/experts">
              <NeoButton className="h-12 px-6">Find Work</NeoButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-secondary/5">
        <div className="flex h-full gap-6 min-w-max pb-4">
          {columns.map((col) => (
            <div key={col.id} className="w-80 h-full flex flex-col">
              {/* Column Header */}
              <div
                className={cn(
                  "border-2 p-3 mb-4 flex items-center justify-between",
                  col.color,
                  col.bg,
                )}
              >
                <h2 className="font-heading font-black text-sm uppercase tracking-widest">
                  {col.title}
                </h2>
                <span className="bg-background text-foreground border-2 border-foreground px-2 py-0.5 text-[0.625rem] font-black shadow-[2px_2px_0px_0px_var(--foreground)]">
                  {TASKS.filter((t) => t.status === col.id).length}
                </span>
              </div>

              {/* Column Tasks */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-12">
                {TASKS.filter((t) => t.status === col.id).map((task) => (
                  <div
                    key={task.id}
                    className="bg-card border-2 border-foreground p-4 shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[6px_6px_0px_0px_var(--primary)] hover:border-primary transition-all cursor-grab group flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-1.5 py-0.5 border-2 border-border">
                        {task.id}
                      </span>
                      <NeoButton
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </NeoButton>
                    </div>

                    <h3 className="font-bold text-sm uppercase leading-tight mb-2 group-hover:text-primary transition-colors">
                      {task.title}
                    </h3>

                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                      Client: {task.client}
                    </div>

                    {task.progress !== undefined && (
                      <div className="mb-4">
                        <div className="h-2 border-2 border-border bg-secondary/30 w-full relative overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 bg-primary border-r-2 border-border"
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                      {task.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[0.5rem] font-black uppercase tracking-widest px-1.5 py-0.5 border-2 border-border bg-background"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between border-t-2 border-border border-dashed pt-3 mt-auto">
                      <div className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-[#E1801E]">
                        <Clock className="w-3 h-3" /> {task.deadline}
                      </div>
                      <div className="font-heading font-black text-sm">
                        {task.price}
                      </div>
                    </div>

                    {/* Quick Actions (Hover) */}
                    <div className="mt-3 flex gap-2">
                      <Link href="/expert/messages" className="flex-1">
                        <NeoButton className="w-full bg-background h-8 text-[0.625rem]">
                          <MessageSquare className="w-3 h-3 mr-1" /> Chat
                        </NeoButton>
                      </Link>
                      {(task.status === "in_progress" ||
                        task.status === "to_do") && (
                        <NeoButton className="flex-1 h-8 text-[0.625rem] transition-transform">
                          <UploadCloud className="w-3 h-3 mr-1" /> Submit
                        </NeoButton>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State Drop Zone */}
                {TASKS.filter((t) => t.status === col.id).length === 0 && (
                  <div className="border-2 border-dashed border-border p-6 text-center text-muted-foreground">
                    <p className="text-[0.625rem] font-bold uppercase tracking-widest">
                      Drop tasks here
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

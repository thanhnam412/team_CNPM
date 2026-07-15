"use client";

import { useState } from "react";
import { useQuickTasks } from "@/tanstack/useQuickTasks";
import { useSubmitQuickTaskProposalMutation } from "@/tanstack/useProposals";
import { useGetMe } from "@/tanstack/useGetMe";

import { Toolbar } from "@/block-ui/expert/find-work/components/toolbar";
import { TaskCard } from "@/block-ui/expert/find-work/components/task-card";
import { TaskOverviewDrawer } from "@/block-ui/expert/find-work/components/task-overview-drawer";
import { ApplyTaskModal, ApplyTaskPayload } from "@/block-ui/expert/find-work/components/apply-task-modal";

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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const createProposalMutation = useSubmitQuickTaskProposalMutation();

  const handleCreateProposal = (payload: ApplyTaskPayload) => {
    if (!selectedTask || !me) return;
    
    createProposalMutation.mutate(
      {
        quickTaskId: selectedTask.id,
        payload: {
          proposedPrice: payload.proposedPrice,
          coverLetter: payload.coverLetter,
        },
      },
      {
        onSuccess: () => {
          setSelectedTask(null);
          setDrawerMode(null);
          setIsRequestModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filter={filter}
        onFilterChange={setFilter}
      />

      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pb-12">
          {TASKS.map((task: any) => (
            <TaskCard
              key={task.id}
              task={task}
              onSelectTask={(t) => {
                setSelectedTask(t);
                setDrawerMode("overview");
              }}
              onRequestTask={(t) => {
                setSelectedTask(t);
                setIsRequestModalOpen(true);
              }}
            />
          ))}
        </div>
      </div>

      <TaskOverviewDrawer
        isOpen={!!selectedTask && drawerMode === "overview"}
        task={selectedTask}
        onClose={() => {
          setDrawerMode(null);
          if (!isRequestModalOpen) setSelectedTask(null);
        }}
        onApplyClick={() => {
          setDrawerMode(null);
          setIsRequestModalOpen(true);
        }}
      />

      <ApplyTaskModal
        isOpen={isRequestModalOpen}
        task={selectedTask}
        isLoading={createProposalMutation.isPending}
        onClose={() => {
          setIsRequestModalOpen(false);
          if (!drawerMode) setSelectedTask(null);
        }}
        onSubmit={handleCreateProposal}
      />
    </div>
  );
}

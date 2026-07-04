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
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useExpertTasks, useExpertUpdateTaskStatusMutation } from "@/tanstack/useTasks";
import { useSubmitDeliverablesMutation } from "@/tanstack/useMilestones";
import { Task } from "@/services/taskService";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function ExpertWorkspacePage() {
  const { data: initialTasks = [], isLoading } = useExpertTasks();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [submitTask, setSubmitTask] = useState<Task | null>(null);
  const [deliverableUrl, setDeliverableUrl] = useState("");

  const updateStatusMutation = useExpertUpdateTaskStatusMutation();
  const submitDeliverableMutation = useSubmitDeliverablesMutation();

  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks as Task[]);
    }
  }, [initialTasks]);

  const columns = [
    {
      id: "todo",
      title: "To Do",
      color: "border-foreground",
      bg: "bg-secondary/10",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "border-primary",
      bg: "bg-primary/5",
    },
    {
      id: "review",
      title: "In Review",
      color: "border-[#E1801E]",
      bg: "bg-[#E1801E]/10",
    },
    {
      id: "done",
      title: "Completed",
      color: "border-green-500",
      bg: "bg-green-500/10",
    },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task) return;

    setTasks(
      tasks.map((t) =>
        t.id === draggedTaskId ? { ...t, status: status as any } : t,
      ),
    );
    updateStatusMutation.mutate({
      taskId: draggedTaskId,
      projectId: task.projectId,
      status,
    });
    setDraggedTaskId(null);
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header */}
      <NeoPageHeader
        className="z-20 relative"
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        title="Workspace"
        icon={<Zap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        description="Manage your active tasks, submit deliverables, and track deadlines."
        rightContent={
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
        }
      />

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
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <h2 className="font-heading font-black text-sm uppercase tracking-widest">
                  {col.title}
                </h2>
                <NeoBadge variant="outline">
                  {tasks.filter((t) => t.status === col.id).length}
                </NeoBadge>
              </div>

              {/* Column Tasks */}
              <div
                className="flex-1 overflow-y-auto space-y-4 p-2 pb-12"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {tasks
                  .filter((t) => t.status === col.id)
                  .map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className="bg-card border-2 border-foreground p-4 shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_0px_var(--primary)] hover:border-primary transition-all cursor-grab active:cursor-grabbing group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <NeoBadge variant="secondary" className="truncate max-w-[120px]" title={task.id}>
                          {task.id}
                        </NeoBadge>
                        {task.milestone && (
                          <NeoBadge variant="nightmare" title="Part of a Milestone">
                            Milestone
                          </NeoBadge>
                        )}
                      </div>

                      <h3 className="font-bold text-sm uppercase leading-tight mb-2 group-hover:text-primary transition-colors">
                        {task.title}
                      </h3>

                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-4">
                        Client: {task.client}
                      </div>

                      <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                        <NeoBadge variant="outline" className="text-primary border-primary shadow-[2px_2px_0px_0px_var(--primary)]">
                          {task.priority} Priority
                        </NeoBadge>
                      </div>

                      <div className="flex items-center justify-between border-t-2 border-border border-dashed pt-3 mt-auto">
                        <div className="flex items-center gap-1 text-[0.625rem] font-bold uppercase tracking-widest text-[#E1801E]">
                          <Clock className="w-3 h-3" />{" "}
                          {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="mt-3 flex gap-2">
                        <Link href="/expert/messages" className="flex-1">
                          <NeoButton
                            variant="secondary"
                            size="sm"
                            className="w-full"
                          >
                            <MessageSquare className="w-3 h-3 mr-1" /> Chat
                          </NeoButton>
                        </Link>
                        {(task.status === "in-progress" ||
                          task.status === "todo") &&
                          task.milestoneId && (
                            <NeoButton
                              size="sm"
                              className="flex-1 transition-transform"
                              onClick={() => setSubmitTask(task)}
                            >
                              <UploadCloud className="w-3 h-3 mr-1" /> Submit
                            </NeoButton>
                          )}
                      </div>
                    </div>
                  ))}

                {/* Empty State Drop Zone */}
                {tasks.filter((t) => t.status === col.id).length === 0 && (
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

      {/* Submit Deliverables Modal */}
      {submitTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-primary text-primary-foreground">
              <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
                <UploadCloud className="w-5 h-5" /> Submit Work
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Submit deliverables for milestone:{" "}
                <span className="text-foreground">
                  {submitTask.milestone?.title}
                </span>
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  File URL or Link
                </label>
                <NeoInput
                  value={deliverableUrl}
                  onChange={(e) => setDeliverableUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end gap-3">
              <NeoButton variant="outline" onClick={() => setSubmitTask(null)}>
                Cancel
              </NeoButton>
              <NeoButton
                disabled={
                  !deliverableUrl || submitDeliverableMutation.isPending
                }
                onClick={() =>
                  submitDeliverableMutation.mutate({
                    projectId: submitTask.projectId,
                    milestoneId: submitTask.milestoneId!,
                    payload: [
                      {
                        name: "Delivery Link",
                        url: deliverableUrl,
                        date: new Date().toLocaleDateString(),
                      },
                    ],
                  })
                }
              >
                {submitDeliverableMutation.isPending
                  ? "Submitting..."
                  : "Submit Deliverables"}
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

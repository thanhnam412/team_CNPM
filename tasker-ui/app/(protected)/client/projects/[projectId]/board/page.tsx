"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  MoreVertical,
  MessageSquare,
  Paperclip,
  CheckSquare,
  Trash2,
  Edit2,
  X,
  Flag,
  UserPlus,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoFormField } from "@/components/ui-custom/neo-form-field";
import { cn } from "@/lib/utils";
import {
  NeoDropdownMenu,
  NeoDropdownMenuContent,
  NeoDropdownMenuItem,
  NeoDropdownMenuTrigger,
  NeoDropdownMenuLabel,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuGroup,
} from "@/components/ui-custom/neo-dropdown-menu";
import { NeoAvatar } from "@/components/ui-custom/neo-avatar";

import {
  useTasks,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/tanstack/useTasks";
import { useMilestones } from "@/tanstack/useMilestones";
import { useTeam } from "@/tanstack/useTeam";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useParams } from "next/navigation";

type TaskStatus = "todo" | "in-progress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee: string | null;
  comments: number;
  attachments: number;
  milestoneId?: string | null;
  milestone?: { title: string } | null;
}

export default function ProjectBoardPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: initialTasks = [], isLoading } = useTasks(projectId);
  const { data: milestones = [] } = useMilestones(projectId);
  const { data: projectMembers = [] } = useTeam(projectId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const createTaskMutation = useCreateTaskMutation(projectId);
  const updateTaskMutation = useUpdateTaskMutation(projectId);
  const updateStatusMutation = useUpdateTaskStatusMutation(projectId);
  const deleteTaskMutation = useDeleteTaskMutation(projectId);

  const PROJECT_MEMBERS = projectMembers.map((m: any) => ({
    id: m.userId || m.id,
    name: m.userName || m.name || "Unknown",
    avatar: m.userAvatar || m.avatar || "U",
  }));

  const form = useForm({
    defaultValues: {
      title: "",
      priority: "medium",
      milestoneId: "",
    },
    onSubmit: async ({ value }) => {
      createTaskMutation.mutate(value, {
        onSuccess: () => {
          setIsNewTaskOpen(false);
          form.reset();
        },
      });
    },
  });

  const editForm = useForm({
    defaultValues: {
      title: "",
      priority: "medium",
      milestoneId: "",
    },
    onSubmit: async ({ value }) => {
      if (editingTask) {
        updateTaskMutation.mutate(
          { taskId: editingTask.id, data: value },
          {
            onSuccess: () => {
              setEditingTask(null);
              editForm.reset();
            },
          },
        );
      }
    },
  });

  // Sync tasks when query data changes
  useEffect(() => {
    if (initialTasks.length > 0) {
      setTasks(initialTasks as Task[]);
    }
  }, [initialTasks]);

  const columns: { id: TaskStatus; title: string; color: string }[] = [
    {
      id: "todo",
      title: "To Do",
      color: "border-muted-foreground bg-muted/10",
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "border-blue-500 bg-blue-500/10",
    },
    {
      id: "review",
      title: "Review",
      color: "border-purple-500 bg-purple-500/10",
    },
    { id: "done", title: "Done", color: "border-primary bg-primary/10" },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
    // Slightly transparent when dragging
    setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        e.target.style.opacity = "0.5";
      }
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedTaskId(null);
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "1";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    // Optimistic Update
    setTasks(tasks.map((t) => (t.id === draggedTaskId ? { ...t, status } : t)));

    // Fire mutation
    updateStatusMutation.mutate({ taskId: draggedTaskId, status });

    setDraggedTaskId(null);
  };

  return (
    <div className="p-6 h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <h2 className="text-xl font-heading font-black uppercase tracking-widest">
          Kanban Board
        </h2>
        <div className="flex gap-3">
          <NeoButton variant="outline" className="text-xs h-10">
            Filter
          </NeoButton>
          <NeoButton
            className="text-xs h-10"
            onClick={() => setIsNewTaskOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" /> New Task
          </NeoButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Loading tasks...
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className={cn(
                  "w-80 shrink-0 flex flex-col border-4 shadow-[8px_8px_0px_0px_var(--foreground)] bg-card min-h-[500px]",
                  col.color.split("")[0],
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div
                  className={cn(
                    "p-4 border-b-4 flex items-center justify-between",
                    col.color.split("")[0],
                    col.color.split("")[1],
                  )}
                >
                  <h3 className="font-heading font-black uppercase tracking-wider">
                    {col.title}
                  </h3>
                  <span className="w-6 h-6 rounded-none bg-background border-2 border-foreground flex items-center justify-center text-xs font-black">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task List */}
                <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-secondary/5">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      onDragEnd={handleDragEnd}
                      className="bg-background border-2 border-foreground p-4 cursor-grab active:cursor-grabbing shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-transform"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div
                            className={cn(
                              "text-[0.625rem] font-black uppercase tracking-widest px-2 py-0.5 border-2",
                              task.priority === "high"
                                ? "bg-red-500/20 text-red-600 border-red-500"
                                : task.priority === "medium"
                                  ? "bg-yellow-500/20 text-yellow-600 border-yellow-500"
                                  : "bg-green-500/20 text-green-600 border-green-500",
                            )}
                          >
                            {task.priority}
                          </div>
                          {task.milestone && (
                            <div
                              className="text-[0.625rem] font-bold uppercase tracking-widest px-2 py-0.5 border-2 border-border bg-secondary/20 flex items-center gap-1 text-muted-foreground"
                              title="Milestone"
                            >
                              <Flag className="w-3 h-3" />
                              {task.milestone.title}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm("Delete this task?")) {
                                deleteTaskMutation.mutate(task.id);
                              }
                            }}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              editForm.reset();
                              editForm.setFieldValue("title", task.title);
                              editForm.setFieldValue("priority", task.priority);
                              editForm.setFieldValue(
                                "milestoneId",
                                task.milestoneId || "",
                              );
                              setEditingTask(task);
                            }}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                            title="Edit task"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h4 className="font-bold text-sm leading-tight mb-4">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          {task.comments > 0 && (
                            <div className="flex items-center gap-1 text-xs font-bold">
                              <MessageSquare className="w-3 h-3" />{" "}
                              {task.comments}
                            </div>
                          )}
                          {task.attachments > 0 && (
                            <div className="flex items-center gap-1 text-xs font-bold">
                              <Paperclip className="w-3 h-3" />{" "}
                              {task.attachments}
                            </div>
                          )}
                        </div>

                        {task.assignee ? (
                          <NeoDropdownMenu>
                          <NeoDropdownMenuTrigger
                            render={
                              <button
                                className="w-6 h-6 rounded-none border-2 border-foreground bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase cursor-pointer hover:bg-primary/40 transition-colors"
                                title={task.assignee}
                              >
                                {task.assignee.charAt(0)}
                              </button>
                            }
                          />
                            <NeoDropdownMenuContent
                              align="end"
                              className="w-48"
                            >
                              <NeoDropdownMenuGroup>
                                <NeoDropdownMenuLabel>
                                  Reassign Task
                                </NeoDropdownMenuLabel>
                                <NeoDropdownMenuSeparator />
                                {PROJECT_MEMBERS.map((member) => (
                                  <NeoDropdownMenuItem
                                    key={member.id}
                                    onClick={() =>
                                      updateTaskMutation.mutate({
                                        taskId: task.id,
                                        data: { assignee: member.name },
                                      })
                                    }
                                  >
                                    <NeoAvatar
                                      name={member.name}
                                      className="w-6 h-6 mr-2 border-2 border-foreground rounded-none shadow-none text-[0.5rem]"
                                    />
                                    {member.name}
                                  </NeoDropdownMenuItem>
                                ))}
                                <NeoDropdownMenuSeparator />
                                <NeoDropdownMenuItem
                                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                  onClick={() =>
                                    updateTaskMutation.mutate({
                                      taskId: task.id,
                                      data: { assignee: null },
                                    })
                                  }
                                >
                                  Unassign
                                </NeoDropdownMenuItem>
                              </NeoDropdownMenuGroup>
                            </NeoDropdownMenuContent>
                          </NeoDropdownMenu>
                        ) : (
                          <NeoDropdownMenu>
                          <NeoDropdownMenuTrigger
                            render={
                              <button
                                className="w-6 h-6 rounded-none border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors"
                                title="Assign"
                              >
                                <UserPlus className="w-3 h-3" />
                              </button>
                            }
                          />
                            <NeoDropdownMenuContent
                              align="end"
                              className="w-48"
                            >
                              <NeoDropdownMenuGroup>
                                <NeoDropdownMenuLabel>
                                  Assign To
                                </NeoDropdownMenuLabel>
                                <NeoDropdownMenuSeparator />
                                {PROJECT_MEMBERS.map((member) => (
                                  <NeoDropdownMenuItem
                                    key={member.id}
                                    onClick={() =>
                                      updateTaskMutation.mutate({
                                        taskId: task.id,
                                        data: { assignee: member.name },
                                      })
                                    }
                                  >
                                    <NeoAvatar
                                      name={member.name}
                                      className="w-6 h-6 mr-2 border-2 border-foreground rounded-none shadow-none text-[0.5rem]"
                                    />
                                    {member.name}
                                  </NeoDropdownMenuItem>
                                ))}
                              </NeoDropdownMenuGroup>
                            </NeoDropdownMenuContent>
                          </NeoDropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Empty State / Add Task */}
                  {col.id === "todo" && (
                    <NeoButton
                      variant="ghost"
                      onClick={() => setIsNewTaskOpen(true)}
                      className="w-full border-dashed text-[0.625rem] h-10 text-muted-foreground"
                    >
                      <Plus className="w-3 h-3 mr-2" /> Add Task
                    </NeoButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW TASK MODAL */}
      {isNewTaskOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="font-heading font-black text-xl uppercase tracking-widest mb-6">
              Create New Task
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit();
              }}
            >
              <div className="space-y-6">
                <NeoFormField
                  form={form}
                  name="title"
                  label="Task Title"
                  placeholder="e.g. Set up database schema"
                  validators={{
                    onChange: z.string().min(3, "Must be at least 3 chars"),
                  }}
                />
                <NeoFormField
                  form={form}
                  name="priority"
                  label="Priority"
                  type="select"
                  options={[
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                  ]}
                />
                <NeoFormField
                  form={form}
                  name="milestoneId"
                  label="Milestone (Optional)"
                  type="select"
                  options={[
                    { label: "None", value: "" },
                    ...milestones.map((m: any) => ({
                      label: m.title,
                      value: m.id,
                    })),
                  ]}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <NeoButton
                  variant="outline"
                  type="button"
                  onClick={() => setIsNewTaskOpen(false)}
                >
                  Cancel
                </NeoButton>
                <form.Subscribe
                  selector={(s) => [s.canSubmit, s.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <NeoButton
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Creating..." : "Create Task"}
                    </NeoButton>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT TASK MODAL */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-heading font-black text-xl uppercase tracking-widest">
                Edit Task
              </h3>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => setEditingTask(null)}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </NeoButton>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editForm.handleSubmit();
              }}
            >
              <div className="space-y-6">
                <NeoFormField
                  form={editForm}
                  name="title"
                  label="Task Title"
                  placeholder="e.g. Set up database schema"
                  validators={{
                    onChange: z.string().min(3, "Must be at least 3 chars"),
                  }}
                />
                <NeoFormField
                  form={editForm}
                  name="priority"
                  label="Priority"
                  type="select"
                  options={[
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                  ]}
                />
                <NeoFormField
                  form={editForm}
                  name="milestoneId"
                  label="Milestone (Optional)"
                  type="select"
                  options={[
                    { label: "None", value: "" },
                    ...milestones.map((m: any) => ({
                      label: m.title,
                      value: m.id,
                    })),
                  ]}
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <NeoButton
                  variant="outline"
                  type="button"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </NeoButton>
                <editForm.Subscribe
                  selector={(s) => [s.canSubmit, s.isSubmitting]}
                  children={([canSubmit, isSubmitting]) => (
                    <NeoButton
                      type="submit"
                      disabled={!canSubmit || isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </NeoButton>
                  )}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

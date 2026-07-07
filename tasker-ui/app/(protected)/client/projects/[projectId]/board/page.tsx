"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";

import {
  useTasks,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} from "@/tanstack/useTasks";
import { useMilestones } from "@/tanstack/useMilestones";
import { useTeamMembers } from "@/tanstack/useTeam";
import { ProjectBoardBlock } from "@/block-ui/project/detail/board";

type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "LOW" | "MEDIUM" | "HIGH";
  assigneeId: string | null;
  comments: number;
  attachments: number;
  milestoneId?: string | null;
  milestone?: { title: string } | null;
}

export default function ProjectBoardPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: initialTasks = [], isLoading } = useTasks(projectId);
  const { data: milestones = [] } = useMilestones(projectId);
  const { data: projectMembers = [] } = useTeamMembers(projectId);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const createTaskMutation = useCreateTaskMutation(projectId);
  const updateTaskMutation = useUpdateTaskMutation(projectId);
  const updateStatusMutation = useUpdateTaskStatusMutation(projectId);
  const deleteTaskMutation = useDeleteTaskMutation(projectId);

  const PROJECT_MEMBERS = projectMembers.map((m: any) => ({
    id: m.id,
    userId: m.userId,
    name: m.user?.name || m.name || "Unknown",
    avatar: m.user?.avatar || m.avatar || "U",
  }));

  const form = useForm({
    defaultValues: {
      title: "",
      priority: "MEDIUM",
      milestoneId: "",
    },
    onSubmit: async ({ value }) => {
      createTaskMutation.mutate(value as any, {
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
      priority: "MEDIUM",
      milestoneId: "",
    },
    onSubmit: async ({ value }) => {
      if (editingTask) {
        updateTaskMutation.mutate(
          { taskId: editingTask.id, data: value as any },
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
      id: "TODO",
      title: "To Do",
      color: "border-muted-foreground bg-muted/10",
    },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      color: "border-blue-500 bg-blue-500/10",
    },
    {
      id: "REVIEW",
      title: "Review",
      color: "border-purple-500 bg-purple-500/10",
    },
    { id: "DONE", title: "Done", color: "border-primary bg-primary/10" },
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
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

    const task = tasks.find((t) => t.id === draggedTaskId);
    if (!task || task.status === status) {
      setDraggedTaskId(null);
      return;
    }

    // Optimistic Update
    setTasks(tasks.map((t) => (t.id === draggedTaskId ? { ...t, status } : t)));

    // Fire mutation
    updateStatusMutation.mutate({ taskId: draggedTaskId, status });

    setDraggedTaskId(null);
  };

  const handleDeleteTask = (id: string) => {
    deleteTaskMutation.mutate(id);
  };

  const handleEditTask = (task: Task) => {
    editForm.reset();
    editForm.setFieldValue("title", task.title);
    editForm.setFieldValue("priority", task.priority);
    editForm.setFieldValue("milestoneId", task.milestoneId || "");
    setEditingTask(task);
  };

  const handleAssignTask = (taskId: string, memberId: string | null) => {
    updateTaskMutation.mutate({
      taskId,
      data: { assigneeId: memberId },
    });
  };

  return (
    <ProjectBoardBlock
      isLoading={isLoading}
      tasks={tasks}
      projectMembers={PROJECT_MEMBERS}
      milestones={milestones}
      columns={columns}
      isNewTaskOpen={isNewTaskOpen}
      onOpenNewTask={() => setIsNewTaskOpen(true)}
      onCloseNewTask={() => setIsNewTaskOpen(false)}
      editingTask={editingTask}
      onCloseEditTask={() => setEditingTask(null)}
      form={form}
      editForm={editForm}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop as any}
      onDeleteTask={handleDeleteTask}
      onEditTask={handleEditTask}
      onAssignTask={handleAssignTask}
    />
  );
}

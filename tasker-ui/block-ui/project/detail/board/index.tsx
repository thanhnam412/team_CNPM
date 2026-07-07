"use client";

import { useState } from "react";
import { BoardHeader } from "./components/board-header";
import { KanbanColumn } from "./components/kanban-column";
import { TaskFormModal } from "./components/task-form-modal";
import { NeoConfirmModal } from "@/components/ui-custom/neo-confirm-modal";

export interface ProjectBoardBlockProps {
  isLoading: boolean;
  tasks: any[];
  projectMembers: any[];
  milestones: any[];
  columns: { id: string; title: string; color: string }[];
  isNewTaskOpen: boolean;
  onOpenNewTask: () => void;
  onCloseNewTask: () => void;
  editingTask: any | null;
  onCloseEditTask: () => void;
  form: any;
  editForm: any;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, colId: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: any) => void;
  onAssignTask: (taskId: string, memberId: string | null) => void;
}

export function ProjectBoardBlock({
  isLoading,
  tasks,
  projectMembers,
  milestones,
  columns,
  isNewTaskOpen,
  onOpenNewTask,
  onCloseNewTask,
  editingTask,
  onCloseEditTask,
  form,
  editForm,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  onDeleteTask,
  onEditTask,
  onAssignTask,
}: ProjectBoardBlockProps) {
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  return (
    <div className="p-6 h-[calc(100vh-140px)] flex flex-col">
      <BoardHeader onNewTask={onOpenNewTask} />

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center text-muted-foreground animate-pulse">
          Loading tasks...
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-4 flex-1 items-start">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);

            return (
              <KanbanColumn
                key={col.id}
                id={col.id}
                title={col.title}
                color={col.color}
                tasks={colTasks}
                projectMembers={projectMembers}
                onDragOver={onDragOver}
                onDrop={onDrop}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDeleteTask={setTaskToDelete}
                onEditTask={onEditTask}
                onAssignTask={onAssignTask}
                onNewTaskClick={onOpenNewTask}
              />
            );
          })}
        </div>
      )}

      {/* NEW TASK MODAL */}
      <TaskFormModal
        isOpen={isNewTaskOpen}
        onClose={onCloseNewTask}
        form={form}
        milestones={milestones}
        isEditing={false}
      />

      {/* EDIT TASK MODAL */}
      <TaskFormModal
        isOpen={!!editingTask}
        onClose={onCloseEditTask}
        form={editForm}
        milestones={milestones}
        isEditing={true}
      />

      <NeoConfirmModal
        isOpen={!!taskToDelete}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Delete"
        onConfirm={() => {
          if (taskToDelete) onDeleteTask(taskToDelete);
          setTaskToDelete(null);
        }}
        onCancel={() => setTaskToDelete(null)}
      />
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Plus,
  MoreVertical,
  MessageSquare,
  Paperclip,
  CheckSquare,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";

type TaskStatus = "todo" | "in-progress" | "review" | "done";

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: "low" | "medium" | "high";
  assignee: string | null;
  comments: number;
  attachments: number;
}

const INITIAL_TASKS: Task[] = [
  {
    id: "t-1",
    title: "Setup AWS RDS Database",
    status: "done",
    priority: "high",
    assignee: "A",
    comments: 2,
    attachments: 0,
  },
  {
    id: "t-2",
    title: "Clean and preprocess historical dataset",
    status: "review",
    priority: "high",
    assignee: "A",
    comments: 5,
    attachments: 2,
  },
  {
    id: "t-3",
    title: "Train baseline XGBoost model",
    status: "in-progress",
    priority: "medium",
    assignee: "A",
    comments: 0,
    attachments: 0,
  },
  {
    id: "t-4",
    title: "Create API endpoints with FastAPI",
    status: "todo",
    priority: "medium",
    assignee: null,
    comments: 0,
    attachments: 0,
  },
  {
    id: "t-5",
    title: "Write unit tests for data pipeline",
    status: "todo",
    priority: "low",
    assignee: "Client",
    comments: 1,
    attachments: 0,
  },
];

export default function ProjectBoardPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

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

    setTasks(tasks.map((t) => (t.id === draggedTaskId ? { ...t, status } : t)));
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
          <NeoButton className="text-xs h-10">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </NeoButton>
        </div>
      </div>

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
                      <button className="text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-4 h-4" />
                      </button>
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
                            <Paperclip className="w-3 h-3" /> {task.attachments}
                          </div>
                        )}
                      </div>

                      {task.assignee ? (
                        <div
                          className="w-6 h-6 rounded-none border-2 border-foreground bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase"
                          title={task.assignee}
                        >
                          {task.assignee.charAt(0)}
                        </div>
                      ) : (
                        <div
                          className="w-6 h-6 rounded-none border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors"
                          title="Assign"
                        >
                          <Plus className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Empty State / Add Task */}
                {col.id === "todo" && (
                  <NeoButton
                    variant="ghost"
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
    </div>
  );
}

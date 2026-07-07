import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { KanbanTaskCard } from "./kanban-task-card";

export interface KanbanColumnProps {
  id: string;
  title: string;
  color: string;
  tasks: any[];
  projectMembers: any[];
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, colId: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (task: any) => void;
  onAssignTask: (taskId: string, memberId: string | null) => void;
  onNewTaskClick: () => void;
}

export function KanbanColumn({
  id,
  title,
  color,
  tasks,
  projectMembers,
  onDragOver,
  onDrop,
  onDragStart,
  onDragEnd,
  onDeleteTask,
  onEditTask,
  onAssignTask,
  onNewTaskClick,
}: KanbanColumnProps) {
  const colorPrefixes = color.split(" ");
  const borderColor = colorPrefixes[0];
  const bgColor = colorPrefixes[1];

  return (
    <div
      className={cn(
        "w-80 shrink-0 flex flex-col border-4 shadow-[8px_8px_0px_0px_var(--foreground)] bg-card min-h-[500px]",
        borderColor,
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      {/* Column Header */}
      <div
        className={cn(
          "p-4 border-b-4 flex items-center justify-between",
          borderColor,
          bgColor,
        )}
      >
        <h3 className="font-heading font-black uppercase tracking-wider">
          {title}
        </h3>
        <span className="w-6 h-6 rounded-none bg-background border-2 border-foreground flex items-center justify-center text-xs font-black">
          {tasks.length}
        </span>
      </div>

      {/* Task List */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-secondary/5">
        {tasks.map((task) => (
          <KanbanTaskCard
            key={task.id}
            task={task}
            projectMembers={projectMembers}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
            onAssign={onAssignTask}
          />
        ))}

        {/* Empty State / Add Task */}
        {id === "TODO" && (
          <NeoButton
            variant="ghost"
            onClick={onNewTaskClick}
            className="w-full border-dashed text-[0.625rem] h-10 text-muted-foreground"
          >
            <Plus className="w-3 h-3 mr-2" /> Add Task
          </NeoButton>
        )}
      </div>
    </div>
  );
}

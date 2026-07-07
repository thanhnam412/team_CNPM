import {
  MessageSquare,
  Paperclip,
  Trash2,
  Edit2,
  Flag,
  UserPlus,
} from "lucide-react";
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

export interface KanbanTaskCardProps {
  task: any;
  projectMembers: any[];
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDragEnd: (e: React.DragEvent) => void;
  onDelete: (id: string) => void;
  onEdit: (task: any) => void;
  onAssign: (taskId: string, memberId: string | null) => void;
}

export function KanbanTaskCard({
  task,
  projectMembers,
  onDragStart,
  onDragEnd,
  onDelete,
  onEdit,
  onAssign,
}: KanbanTaskCardProps) {
  const assignedMember = projectMembers.find((m) => m.id === task.assigneeId);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnd={onDragEnd}
      className="bg-background border-2 border-foreground p-4 cursor-grab active:cursor-grabbing shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px] transition-transform"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={cn(
              "text-[0.625rem] font-black uppercase tracking-widest px-2 py-0.5 border-2",
              task.priority === "HIGH"
                ? "bg-red-500/20 text-red-600 border-red-500"
                : task.priority === "MEDIUM"
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
              onDelete(task.id);
            }}
            className="text-muted-foreground hover:text-destructive transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
            title="Edit task"
          >
            <Edit2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h4 className="font-bold text-sm leading-tight mb-4">{task.title}</h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-3 text-muted-foreground">
          {task.comments > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold">
              <MessageSquare className="w-3 h-3" /> {task.comments}
            </div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1 text-xs font-bold">
              <Paperclip className="w-3 h-3" /> {task.attachments}
            </div>
          )}
        </div>

        <NeoDropdownMenu>
          <NeoDropdownMenuTrigger
            render={
              assignedMember ? (
                <button
                  className="w-6 h-6 rounded-none border-2 border-foreground bg-primary/20 flex items-center justify-center text-[0.625rem] font-black uppercase cursor-pointer hover:bg-primary/40 transition-colors"
                  title={assignedMember.name}
                >
                  {assignedMember.name.charAt(0)}
                </button>
              ) : (
                <button
                  className="w-6 h-6 rounded-none border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground cursor-pointer transition-colors"
                  title="Assign"
                >
                  <UserPlus className="w-3 h-3" />
                </button>
              )
            }
          />
          <NeoDropdownMenuContent align="end" className="w-48">
            <NeoDropdownMenuGroup>
              <NeoDropdownMenuLabel>Assign To</NeoDropdownMenuLabel>
              <NeoDropdownMenuSeparator />
              {projectMembers.map((member) => (
                <NeoDropdownMenuItem
                  key={member.userId || member.id}
                  onClick={() => onAssign(task.id, member.userId)}
                >
                  <NeoAvatar
                    name={member.name}
                    className="w-6 h-6 mr-2 border-2 border-foreground rounded-none shadow-none text-[0.5rem]"
                  />
                  {member.name}
                </NeoDropdownMenuItem>
              ))}
              {assignedMember && (
                <>
                  <NeoDropdownMenuSeparator />
                  <NeoDropdownMenuItem
                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => onAssign(task.id, null)}
                  >
                    Unassign
                  </NeoDropdownMenuItem>
                </>
              )}
            </NeoDropdownMenuGroup>
          </NeoDropdownMenuContent>
        </NeoDropdownMenu>
      </div>
    </div>
  );
}

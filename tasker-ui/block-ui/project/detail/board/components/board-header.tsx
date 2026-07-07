import { Plus } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface BoardHeaderProps {
  onNewTask: () => void;
}

export function BoardHeader({ onNewTask }: BoardHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6 shrink-0">
      <h2 className="text-xl font-heading font-black uppercase tracking-widest">
        Kanban Board
      </h2>
      <div className="flex gap-3">
        <NeoButton variant="outline" className="text-xs h-10">
          Filter
        </NeoButton>
        <NeoButton className="text-xs h-10" onClick={onNewTask}>
          <Plus className="w-4 h-4 mr-2" /> New Task
        </NeoButton>
      </div>
    </div>
  );
}

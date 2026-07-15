import { Clock, TerminalSquare, Handshake } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoBadge } from "@/components/ui-custom/neo-badge";

export interface TaskCardProps {
  task: any; 
  onSelectTask: (task: any) => void;
  onRequestTask: (task: any) => void;
}

export function TaskCard({ task, onSelectTask, onRequestTask }: TaskCardProps) {
  return (
    <NeoCard
      variant="interactive"
      className="flex flex-col md:flex-row items-stretch group cursor-pointer"
      onClick={() => onSelectTask(task)}
    >
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <NeoBadge
              variant="secondary"
              className="bg-secondary/20 text-muted-foreground border-border flex items-center"
            >
              Client ID: {task.clientId.substring(0, 8)}
            </NeoBadge>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-destructive flex items-center gap-1">
              <Clock className="w-3 h-3" /> Due:{" "}
              {task.deadline
                ? new Date(task.deadline).toLocaleDateString()
                : "Flexible"}
            </span>
          </div>
          <h3 className="font-heading font-black text-2xl uppercase tracking-wide mb-3 group-hover:text-primary transition-colors">
            {task.title}
          </h3>

          <div className="relative border-2 border-foreground bg-secondary/10 shadow-[2px_2px_0px_0px_var(--foreground)] p-1 mt-4">
            <div className="bg-foreground flex items-center gap-2 px-3 py-1.5 border-b-2 border-foreground mb-1">
              <div className="w-2 h-2 rounded-full bg-destructive" />
              <div className="w-2 h-2 rounded-full bg-warning" />
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[0.5rem] font-mono text-background/50 ml-2 uppercase font-bold tracking-widest flex items-center gap-1">
                <TerminalSquare className="w-3 h-3" />
                task_description.txt
              </span>
            </div>
            <div className="p-3 font-mono text-xs leading-relaxed text-foreground min-h-[80px]">
              {task.description}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-muted-foreground">
          <span className="text-[0.625rem] font-black uppercase tracking-widest">
            {task.proposals?.length || 0}
          </span>
          <span className="text-[0.625rem] font-bold uppercase tracking-widest">
            Proposals Submitted
          </span>
        </div>
      </div>

      <div className="md:w-48 shrink-0 border-t-4 md:border-t-0 md:border-l-4 border-foreground bg-muted-foreground flex flex-col items-center justify-center gap-4 p-6">
        <div className="text-center">
          <div className="text-[0.5rem] font-bold uppercase tracking-widest text-background/50 mb-0.5">
            Bounty
          </div>
          <div className="font-heading font-black text-2xl text-warning">
            {formatCurrency(task.budget)}
          </div>
        </div>
        <NeoButton
          onClick={(e) => {
            e.stopPropagation();
            onRequestTask(task);
          }}
          variant="secondary"
          className="w-full h-12 text-xs"
        >
          Request <Handshake className="w-4 h-4 ml-1" />
        </NeoButton>
      </div>
    </NeoCard>
  );
}

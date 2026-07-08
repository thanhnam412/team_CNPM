import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoBadge as Badge } from "@/components/ui-custom/neo-badge";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface ActionRequiredWidgetProps {
  pendingActions: any[];
}

export function ActionRequiredWidget({ pendingActions }: ActionRequiredWidgetProps) {
  return (
    <NeoCard className="lg:col-span-2 bg-warning/10 border-warning shadow-[4px_4px_0px_0px_var(--color-warning)] p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <div className="bg-warning text-warning-foreground p-1.5 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] animate-pulse">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="font-heading font-black uppercase tracking-widest text-lg text-warning">
          Action Required
        </h3>
      </div>

      <p className="text-sm font-bold text-foreground mb-6">
        You have {pendingActions.length} deliverables waiting for your approval.
        Escrow funds will be automatically released in 48 hours if no action is
        taken.
      </p>

      <div className="space-y-3 flex-1">
        {pendingActions.map((item) => (
          <div
            key={item.id}
            className="bg-card border-2 border-foreground p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-[1px] transition-transform cursor-pointer"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">{item.type}</Badge>
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                  {item.id}
                </span>
              </div>
              <div className="font-bold text-sm uppercase">{item.task}</div>
              <div className="text-xs font-bold text-muted-foreground">
                Submitted by {item.expert}
              </div>
            </div>
            <Link
              href={
                item.type === "Quick Task"
                  ? `/client/quick-tasks/${item.id}`
                  : `/client/projects/${item.projectId}/milestones`
              }
            >
              <NeoButton className="h-8 px-4 text-xs shrink-0">Review</NeoButton>
            </Link>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}

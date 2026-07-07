import { ExternalLink, DollarSign, Clock, FileText } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { formatCurrency } from "@/lib/utils";

export interface ContextSidebarProps {
  activeConversation: any;
}

export function ContextSidebar({ activeConversation }: ContextSidebarProps) {
  if (!activeConversation) return null;

  return (
    <div className="hidden lg:flex flex-col w-80 shrink-0 border-l-2 border-border bg-card animate-in slide-in-from-right-10 duration-200">
      <div className="p-4 border-b-2 border-border bg-secondary/10">
        <h3 className="font-heading font-black text-sm uppercase tracking-widest flex items-center gap-2">
          <ExternalLink className="w-4 h-4" /> Context Info
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Task/Project Summary */}
        <div className="space-y-4">
          <div>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block mb-1">
              {activeConversation.contextType === "quick_task"
                ? "Quick Task"
                : "Project"}
            </span>
            <h4 className="font-bold text-sm leading-tight hover:text-primary cursor-pointer transition-colors">
              {activeConversation.contextName}
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 border-2 border-border bg-background">
              <DollarSign className="w-4 h-4 text-primary mb-1" />
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block">
                Budget
              </span>
              <span className="font-heading font-black text-sm">
                {activeConversation.details?.budget
                  ? formatCurrency(activeConversation.details.budget)
                  : "$0.00"}
              </span>
            </div>
            <div className="p-3 border-2 border-border bg-background">
              <Clock className="w-4 h-4 text-[#E1801E] mb-1" />
              <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground block">
                Deadline
              </span>
              <span className="font-heading font-black text-sm truncate">
                {activeConversation.details?.deadline || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Shared Files List */}
        <div>
          <h3 className="font-heading font-black text-sm uppercase tracking-widest mb-3 flex items-center justify-between border-b-2 border-border pb-2">
            Shared Files
            <span className="bg-secondary text-foreground text-[0.625rem] px-1.5 py-0.5">
              1
            </span>
          </h3>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 border-2 border-border hover:bg-secondary/20 cursor-pointer transition-colors">
              <div className="w-8 h-8 border-2 border-border bg-background flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-[0.625rem] uppercase tracking-widest truncate text-foreground">
                  requirements_v2.pdf
                </div>
                <div className="text-[0.5rem] font-bold uppercase tracking-widest text-muted-foreground">
                  Today • 2.4 MB
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="font-heading font-black text-sm uppercase tracking-widest mb-3 border-b-2 border-border pb-2">
            Actions
          </h3>
          <div className="space-y-2">
            <NeoButton variant="outline" className="w-full h-10 text-[0.625rem]">
              Request Deliverable
            </NeoButton>
            <NeoButton variant="outline" className="w-full h-10 text-[0.625rem]">
              View Full Details
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
}

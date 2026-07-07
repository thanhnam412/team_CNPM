import { Lock } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";

export function ActiveEscrow() {
  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] p-6">
      <h3 className="uppercase tracking-widest font-black text-sm mb-6 flex items-center gap-2 border-b-2 border-border pb-4">
        <Lock className="w-4 h-4 text-[#E1801E]" /> Active Escrow Contracts
      </h3>

      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 border-2 border-border bg-secondary/20 hover:border-primary/50 transition-colors"
          >
            <div>
              <h4 className="font-bold text-sm uppercase tracking-wide mb-1">
                {i === 1
                  ? "Label dataset with bounding boxes"
                  : "API Integration for Payment Gateway"}
              </h4>
              <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                Expert: {i === 1 ? "DataCorp" : "AlexN"} • Milestone: Phase 1
              </p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
              <span className="text-xl font-heading font-black text-[#E1801E] tracking-wider">
                {i === 1 ? "$1,200" : "$1,300"}
              </span>
              <NeoButton variant="outline" className="text-xs h-8">
                View Task
              </NeoButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

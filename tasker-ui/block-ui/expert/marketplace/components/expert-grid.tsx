import { NeoButton } from "@/components/ui-custom/neo-button";
import { ExpertCard } from "./expert-card";

export interface ExpertGridProps {
  experts: any[];
  savedExperts: Record<string, boolean>;
  onToggleSave: (id: string) => void;
  onInvite: (expert: any) => void;
}

export function ExpertGrid({
  experts,
  savedExperts,
  onToggleSave,
  onInvite,
}: ExpertGridProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative z-10">
      <div className="max-w-7xl mx-auto pb-24">
        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading font-black uppercase tracking-widest text-lg">
            Showing {experts.length} Experts
          </h2>
          <div className="flex gap-2">
            <NeoButton variant="outline" className="h-8 px-3 text-[0.625rem]">
              Saved ({Object.values(savedExperts).filter(Boolean).length})
            </NeoButton>
          </div>
        </div>

        {/* Grid of Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {experts.map((expert) => (
            <ExpertCard
              key={expert.id}
              expert={expert}
              isSaved={!!savedExperts[expert.id]}
              onToggleSave={onToggleSave}
              onInvite={onInvite}
            />
          ))}
        </div>

        {/* Pagination Mock */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <NeoButton variant="outline" disabled className="text-xs h-10 px-6">
              Previous
            </NeoButton>
            <NeoButton
              variant="outline"
              className="bg-primary/10 text-xs h-10 w-10 p-0"
            >
              1
            </NeoButton>
            <NeoButton variant="outline" className="text-xs h-10 w-10 p-0">
              2
            </NeoButton>
            <NeoButton variant="outline" className="text-xs h-10 w-10 p-0">
              3
            </NeoButton>
            <NeoButton variant="outline" className="text-xs h-10 px-6">
              Next
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
  );
}

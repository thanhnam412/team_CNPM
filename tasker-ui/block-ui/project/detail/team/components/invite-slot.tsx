import { Plus } from "lucide-react";

export interface InviteSlotProps {
  onClick: () => void;
}

export function InviteSlot({ onClick }: InviteSlotProps) {
  return (
    <div
      onClick={onClick}
      className="border-4 border-dashed border-border bg-secondary/5 flex flex-col items-center justify-center text-center p-6 min-h-[300px] hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer group"
    >
      <div className="w-16 h-16 rounded-full border-4 border-dashed border-border flex items-center justify-center text-muted-foreground group-hover:border-primary group-hover:text-primary mb-4 transition-colors">
        <Plus className="w-8 h-8" />
      </div>
      <h3 className="font-heading font-black text-lg uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
        Add Team Member
      </h3>
      <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest mt-2 max-w-[200px]">
        Invite internal colleagues or hire new experts from the marketplace.
      </p>
    </div>
  );
}

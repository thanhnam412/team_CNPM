import { MessageSquareX, X } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { MilestoneDto } from "@/types/project.dto";

export interface RevisionModalProps {
  milestone: MilestoneDto | null;
  feedback: string;
  onFeedbackChange: (val: string) => void;
  onClose: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function RevisionModal({
  milestone,
  feedback,
  onFeedbackChange,
  onClose,
  onSubmit,
  isSubmitting,
}: RevisionModalProps) {
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-destructive text-destructive-foreground">
          <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
            <MessageSquareX className="w-5 h-5" /> Request Revision
          </h2>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-transparent h-8 w-8 hover:bg-black/20 text-current"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Milestone
            </div>
            <div className="font-bold text-lg">{milestone.title}</div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest block">
              Feedback / Requested Changes *
            </label>
            <NeoTextarea
              value={feedback}
              onChange={(e) => onFeedbackChange(e.target.value)}
              placeholder="Detail what needs to be changed or improved..."
              className="min-h-[120px]"
            />
          </div>
        </div>

        <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end gap-3">
          <NeoButton variant="outline" onClick={onClose}>
            Cancel
          </NeoButton>
          <NeoButton
            variant="destructive"
            disabled={!feedback.trim() || isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}

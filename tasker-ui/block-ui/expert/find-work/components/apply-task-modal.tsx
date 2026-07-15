import { useState } from "react";
import {
  Handshake,
  X,
  FileSignature,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";

export interface ApplyTaskPayload {
  coverLetter: string;
  proposedPrice: string;
}

export interface ApplyTaskModalProps {
  isOpen: boolean;
  task: any;
  isLoading: boolean;
  onClose: () => void;
  onSubmit: (payload: ApplyTaskPayload) => void;
}

export function ApplyTaskModal({
  isOpen,
  task,
  isLoading,
  onClose,
  onSubmit,
}: ApplyTaskModalProps) {
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPrice, setProposedPrice] = useState("");

  if (!isOpen || !task) return null;

  const handleSubmit = () => {
    onSubmit({
      coverLetter,
      proposedPrice,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-card border-4 border-foreground shadow-[12px_12px_0px_0px_var(--foreground)] w-full max-w-3xl animate-in zoom-in-95 duration-200 my-8">
        <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30">
          <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
            <Handshake className="w-6 h-6 text-warning" /> Request to Work
          </h2>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="border-transparent h-8 w-8"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          <div className="bg-foreground text-background p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                Applying for Task
              </div>
              <div className="font-heading font-black text-xl uppercase">
                {task.title}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-background/60 mb-1">
                Bounty
              </div>
              <div className="font-heading font-black text-2xl text-warning">
                {formatCurrency(task.budget || 0)}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
              Cover Letter / Approach
            </label>
            <NeoTextarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Briefly explain how you plan to solve this task..."
              className="min-h-[120px]"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground block">
                Proposed Price ($)
              </label>
              {Number(proposedPrice) > Number(task.budget) && (
                <span className="text-[0.625rem] font-bold text-destructive bg-destructive/10 px-2 py-0.5 border border-destructive uppercase tracking-widest">
                  {formatCurrency(Number(proposedPrice) - Number(task.budget))}{" "}
                  Over Budget
                </span>
              )}
            </div>
            <NeoInput
              type="number"
              value={proposedPrice}
              onChange={(e) => setProposedPrice(e.target.value)}
              placeholder={String(formatCurrency(task.budget) || "")}
              className="mb-3"
            />
            {Number(proposedPrice) > 0 && (
              <div className="bg-secondary/20 border-2 border-border p-3 space-y-2">
                <div className="flex justify-between text-xs font-semibold text-muted-foreground">
                  <span>Platform Fee (1%)</span>
                  <span>-{formatCurrency(Number(proposedPrice) * 0.01)}</span>
                </div>
                <div className="flex justify-between font-bold text-sm border-t-2 border-border pt-2">
                  <span>You'll Receive</span>
                  <span className="text-primary">
                    {formatCurrency(Number(proposedPrice) * 0.99)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex justify-end gap-4">
        <NeoButton variant="outline" onClick={onClose} className="h-14 px-8">
          Cancel
        </NeoButton>
        <NeoButton
          disabled={isLoading || !coverLetter || !proposedPrice}
          onClick={handleSubmit}
          className="h-14 px-10 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Submitting..." : "Submit Request"}
        </NeoButton>
      </div>
    </div>
  );
}

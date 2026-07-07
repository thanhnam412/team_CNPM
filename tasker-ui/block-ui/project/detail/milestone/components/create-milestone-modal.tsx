import { Plus, X } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";

export interface CreateMilestoneFormState {
  title: string;
  amount: string;
  dueDate: string;
}

export interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: CreateMilestoneFormState;
  onFormChange: (form: CreateMilestoneFormState) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export function CreateMilestoneModal({
  isOpen,
  onClose,
  form,
  onFormChange,
  onSubmit,
  isSubmitting,
}: CreateMilestoneModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-primary text-primary-foreground">
          <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Milestone
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

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest block">
              Milestone Title *
            </label>
            <NeoInput
              value={form.title}
              onChange={(e) =>
                onFormChange({ ...form, title: e.target.value })
              }
              placeholder="e.g. Design System Implementation"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest block">
                Amount ($) *
              </label>
              <NeoInput
                type="number"
                value={form.amount}
                onChange={(e) =>
                  onFormChange({ ...form, amount: e.target.value })
                }
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest block">
                Due Date *
              </label>
              <NeoInput
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  onFormChange({ ...form, dueDate: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end gap-3">
          <NeoButton variant="outline" onClick={onClose}>
            Cancel
          </NeoButton>
          <NeoButton
            disabled={
              !form.title || !form.amount || !form.dueDate || isSubmitting
            }
            onClick={onSubmit}
          >
            {isSubmitting ? "Creating..." : "Create Milestone"}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}

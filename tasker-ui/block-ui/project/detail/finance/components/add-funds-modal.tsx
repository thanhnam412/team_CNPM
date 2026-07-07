import { z } from "zod";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoFormField } from "@/components/ui-custom/neo-form-field";

export interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: any; // using @tanstack/react-form instance
}

export function AddFundsModal({ isOpen, onClose, form }: AddFundsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 animate-in fade-in zoom-in duration-200">
        <h3 className="font-heading font-black text-xl uppercase tracking-widest mb-2">
          Add Funds to Project
        </h3>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-6">
          Increase your project's working budget
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="space-y-6">
            <NeoFormField
              form={form}
              name="amount"
              label="Amount ($)"
              type="number"
              placeholder="e.g. 500"
              validators={{ onChange: z.number().min(1, "Minimum $1") }}
            />
          </div>
          <div className="flex justify-end gap-3 mt-8 border-t-2 border-border pt-6">
            <NeoButton variant="outline" type="button" onClick={onClose}>
              Cancel
            </NeoButton>
            <form.Subscribe
              selector={(s: any) => [s.canSubmit, s.isSubmitting]}
              children={([canSubmit, isSubmitting]: any) => (
                <NeoButton type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? "Processing..." : "Confirm Payment"}
                </NeoButton>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

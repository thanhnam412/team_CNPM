import { X } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoFormField } from "@/components/ui-custom/neo-form-field";
import { z } from "zod";

export interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: any;
  milestones: any[];
  isEditing: boolean;
}

export function TaskFormModal({
  isOpen,
  onClose,
  form,
  milestones,
  isEditing,
}: TaskFormModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-heading font-black text-xl uppercase tracking-widest">
            {isEditing ? "Edit Task" : "Create New Task"}
          </h3>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="w-4 h-4" />
          </NeoButton>
        </div>
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
              name="title"
              label="Task Title"
              placeholder="e.g. Set up database schema"
              validators={{
                onChange: z.string().min(3, "Must be at least 3 chars"),
              }}
            />
            <NeoFormField
              form={form}
              name="priority"
              label="Priority"
              type="select"
              options={[
                { label: "High", value: "HIGH" },
                { label: "Medium", value: "MEDIUM" },
                { label: "Low", value: "LOW" },
              ]}
            />
            <NeoFormField
              form={form}
              name="milestoneId"
              label="Milestone (Optional)"
              type="select"
              options={[
                { label: "None", value: "" },
                ...milestones.map((m: any) => ({
                  label: m.title,
                  value: m.id,
                })),
              ]}
            />
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <NeoButton variant="outline" type="button" onClick={onClose}>
              Cancel
            </NeoButton>
            <form.Subscribe
              selector={(s: any) => [s.canSubmit, s.isSubmitting]}
              children={([canSubmit, isSubmitting]: any) => (
                <NeoButton type="submit" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Saving..."
                      : "Creating..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Task"}
                </NeoButton>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}

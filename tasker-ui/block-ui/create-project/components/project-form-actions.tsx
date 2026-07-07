import { NeoButton } from "@/components/ui-custom/neo-button";
import { ReactFormExtendedApi } from "@tanstack/react-form";
import { CreateProjectFormValues } from "../index";

export interface ProjectFormActionsProps {
  form: ReactFormExtendedApi<CreateProjectFormValues, any, any, any, any, any, any, any, any, any, any, any>;
  onCancel: () => void;
}

export function ProjectFormActions({ form, onCancel }: ProjectFormActionsProps) {
  return (
    <div className="shrink-0 border-t-2 border-border bg-card p-4 px-6 flex items-center justify-end z-10">
      <div className="w-full max-w-3xl mx-auto flex justify-between items-center">
        <NeoButton
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-xs h-12 px-6"
        >
          Cancel
        </NeoButton>

        <form.Subscribe
          selector={(state: any) => ({
            canSubmit: state.canSubmit,
            isSubmitting: state.isSubmitting,
          })}
          children={({ canSubmit, isSubmitting }: { canSubmit: boolean, isSubmitting: boolean }) => (
            <NeoButton
              type="submit"
              disabled={!canSubmit || isSubmitting}
              onClick={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              size="lg"
              className="px-8 h-12 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Space"}
            </NeoButton>
          )}
        />
      </div>
    </div>
  );
}

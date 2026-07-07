import { useState } from "react";
import { X, Trash2, Settings } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { NeoConfirmModal } from "@/components/ui-custom/neo-confirm-modal";

export interface EditFormState {
  title: string;
  description: string;
  budget: string;
}

export interface ProjectSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  editForm: EditFormState;
  onEditFormChange: (form: EditFormState) => void;
  onSave: () => void;
  onDelete: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function ProjectSettingsModal({
  isOpen,
  onClose,
  editForm,
  onEditFormChange,
  onSave,
  onDelete,
  isSaving,
  isDeleting,
}: ProjectSettingsModalProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <>
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-secondary">
          <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
            <Settings className="w-5 h-5" /> Project Settings
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
              Project Title
            </label>
            <NeoInput
              value={editForm.title}
              onChange={(e) =>
                onEditFormChange({ ...editForm, title: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest block">
              Description
            </label>
            <NeoTextarea
              value={editForm.description}
              onChange={(e) =>
                onEditFormChange({ ...editForm, description: e.target.value })
              }
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest block">
              Total Budget ($)
            </label>
            <NeoInput
              type="number"
              value={editForm.budget}
              onChange={(e) =>
                onEditFormChange({ ...editForm, budget: e.target.value })
              }
            />
          </div>
        </div>

        <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-between items-center gap-3">
          <NeoButton
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
            onClick={() => setIsConfirmOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4 mr-2" />{" "}
            {isDeleting ? "Deleting..." : "Delete Project"}
          </NeoButton>
          <div className="flex gap-2">
            <NeoButton variant="outline" onClick={onClose}>
              Cancel
            </NeoButton>
            <NeoButton onClick={onSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </NeoButton>
          </div>
        </div>
      </div>
    </div>
    <NeoConfirmModal
        isOpen={isConfirmOpen}
        title="Delete Project"
        description="Are you sure you want to completely delete this project? This action cannot be undone."
        confirmText="Delete Project"
        onConfirm={() => {
          onDelete();
        }}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />
    </>
  );
}

import { X, AlertTriangle } from "lucide-react";
import { NeoButton } from "./neo-button";

export interface NeoConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isDanger?: boolean;
}

export function NeoConfirmModal({
  isOpen,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
  isDanger = true,
}: NeoConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-md animate-in zoom-in-95 duration-200">
        <div className={`border-b-4 border-foreground p-4 flex justify-between items-center ${isDanger ? 'bg-destructive/10' : 'bg-primary'}`}>
          <h2 className={`font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2 ${isDanger ? 'text-destructive' : 'text-primary-foreground'}`}>
            <AlertTriangle className="w-5 h-5" /> {title}
          </h2>
          <NeoButton
            variant="ghost"
            size="icon"
            onClick={onCancel}
            disabled={isLoading}
            className="border-transparent h-8 w-8 hover:bg-black/10 text-current"
          >
            <X className="w-5 h-5" />
          </NeoButton>
        </div>

        <div className="p-6">
          <p className="font-bold text-sm leading-relaxed">{description}</p>
        </div>

        <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end items-center gap-3">
          <NeoButton variant="outline" onClick={onCancel} disabled={isLoading}>
            {cancelText}
          </NeoButton>
          <NeoButton
            variant="default"
            className={`${isDanger ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' : 'bg-primary text-primary-foreground hover:bg-primary/90'} border-foreground shadow-[4px_4px_0px_0px_var(--foreground)] hover:shadow-[6px_6px_0px_0px_var(--foreground)]`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </NeoButton>
        </div>
      </div>
    </div>
  );
}

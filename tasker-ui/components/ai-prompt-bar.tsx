import { ArrowUp } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";

interface AiPromptBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function AiPromptBar({
  value,
  onChange,
  placeholder = "Message AI Tasker...",
}: AiPromptBarProps) {
  return (
    <div className="w-full max-w-3xl pointer-events-auto bg-card border-2 border-border p-2 flex gap-2 items-center shadow-[2px_2px_0px_0px_var(--border)] focus-within:border-primary focus-within:shadow-[2px_2px_0px_0px_var(--primary)] focus-within:-translate-x-[2px] focus-within:-translate-y-[2px] transition-all">
      <NeoInput
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 border-0 focus-visible:ring-0 focus-visible:border-b-0 focus-visible:ring-offset-0 px-2 h-12 tracking-wide bg-transparent shadow-none text-md! font-semibold"
      />
      <NeoButton size="icon" className="shrink-0" disabled={!value.trim()}>
        <ArrowUp className="w-5 h-5" />
      </NeoButton>
    </div>
  );
}

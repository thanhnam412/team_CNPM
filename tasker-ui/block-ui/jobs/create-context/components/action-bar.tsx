import { NeoButton } from "@/components/ui-custom/neo-button";

export interface ActionBarProps {
  onContinue: () => void;
}

export function ActionBar({ onContinue }: ActionBarProps) {
  return (
    <div className="shrink-0 border-t-2 border-border bg-card p-4 px-6 flex items-center justify-end z-10">
      <div className="w-full max-w-3xl mx-auto flex justify-end">
        <NeoButton size="lg" onClick={onContinue} className="px-8 h-12">
          Tiếp tục
        </NeoButton>
      </div>
    </div>
  );
}

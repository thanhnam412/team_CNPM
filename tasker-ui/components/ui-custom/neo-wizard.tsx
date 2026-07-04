import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NeoButton } from "./neo-button";

interface WizardHeaderProps {
  icon: any;
  title: string;
  subtitle: string;
  steps: { num: number; label: string }[];
  currentStep: number;
}

export function WizardHeader({
  icon: Icon,
  title,
  subtitle,
  steps,
  currentStep,
}: WizardHeaderProps) {
  return (
    <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0 relative z-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase flex items-center gap-3">
          <Icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
          {title}
        </h1>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2">
          {subtitle}
        </p>

        {/* Blocky Progress Bar */}
        <div className="flex items-center mt-8 gap-2">
          {steps.map((s) => (
            <div key={s.num} className="flex-1 flex flex-col gap-2">
              <div
                className={cn(
                  "h-4 border-2 transition-all duration-300",
                  currentStep > s.num
                    ? "bg-primary border-foreground"
                    : currentStep === s.num
                    ? "bg-primary border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]"
                    : "bg-secondary border-border"
                )}
              />
              <span
                className={cn(
                  "text-[0.625rem] font-black uppercase tracking-widest",
                  currentStep >= s.num
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                STEP {s.num}: {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const WizardStepContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
    {children}
  </div>
);

export const WizardCard = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "bg-secondary/10 border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]",
      className
    )}
  >
    {children}
  </div>
);

export const WizardSectionTitle = ({
  icon: Icon,
  title,
}: {
  icon: any;
  title: string;
}) => (
  <h3 className="font-heading font-black text-lg uppercase tracking-widest flex items-center gap-2 mb-6">
    <Icon className="w-5 h-5 text-primary" /> {title}
  </h3>
);

export const WizardBackButton = ({ onClick }: { onClick: () => void }) => (
  <NeoButton
    type="button"
    variant="outline"
    onClick={onClick}
    className="h-14 px-8"
  >
    <ArrowLeft className="w-5 h-5 mr-2" /> Back
  </NeoButton>
);

export const WizardNextButton = ({
  onClick,
  label,
  disabled,
}: {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}) => (
  <NeoButton
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="h-14 px-8"
  >
    {label} <ArrowRight className="w-5 h-5 ml-2" />
  </NeoButton>
);

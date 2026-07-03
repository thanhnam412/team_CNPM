import * as React from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const NeoTooltipProvider = TooltipProvider;
const NeoTooltip = Tooltip;
const NeoTooltipTrigger = TooltipTrigger;

const NeoTooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipContent>,
  React.ComponentPropsWithoutRef<typeof TooltipContent>
>(({ className, ...props }, ref) => (
  <TooltipContent
    ref={ref}
    className={cn(
      "border-2 border-foreground rounded-none shadow-[4px_4px_0px_0px_var(--foreground)] bg-primary text-primary-foreground font-bold tracking-widest uppercase text-xs px-3 py-2",
      className,
    )}
    {...props}
  />
));
NeoTooltipContent.displayName = TooltipContent.displayName;

export { NeoTooltip, NeoTooltipTrigger, NeoTooltipContent, NeoTooltipProvider };

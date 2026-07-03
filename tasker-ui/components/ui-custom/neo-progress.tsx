import * as React from "react";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const NeoProgressTrack = React.forwardRef<
  React.ElementRef<typeof ProgressTrack>,
  React.ComponentPropsWithoutRef<typeof ProgressTrack>
>(({ className, ...props }, ref) => (
  <ProgressTrack
    ref={ref}
    className={cn(
      "h-6 rounded-none border-2 border-foreground bg-background shadow-[2px_2px_0px_0px_var(--foreground)] overflow-hidden",
      className,
    )}
    {...props}
  />
));
NeoProgressTrack.displayName = "NeoProgressTrack";

const NeoProgressIndicator = React.forwardRef<
  React.ElementRef<typeof ProgressIndicator>,
  React.ComponentPropsWithoutRef<typeof ProgressIndicator>
>(({ className, ...props }, ref) => (
  <ProgressIndicator
    ref={ref}
    className={cn(
      "h-full bg-primary border-r-2 border-foreground transition-all duration-500",
      className,
    )}
    {...props}
  />
));
NeoProgressIndicator.displayName = "NeoProgressIndicator";

export {
  Progress as NeoProgress,
  NeoProgressTrack,
  NeoProgressIndicator,
  ProgressLabel as NeoProgressLabel,
  ProgressValue as NeoProgressValue,
};

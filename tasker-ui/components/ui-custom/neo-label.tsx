import * as React from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const NeoLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => (
  <Label
    ref={ref}
    className={cn(
      "font-black tracking-widest uppercase text-xs text-foreground/80",
      className,
    )}
    {...props}
  />
));
NeoLabel.displayName = "NeoLabel";

export { NeoLabel };

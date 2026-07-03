import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const NeoCheckbox = React.forwardRef<
  React.ElementRef<typeof Checkbox>,
  React.ComponentPropsWithoutRef<typeof Checkbox>
>(({ className, ...props }, ref) => (
  <Checkbox
    ref={ref}
    className={cn(
      "rounded-none border-2 border-foreground bg-background shadow-[2px_2px_0px_0px_var(--foreground)] focus-visible:ring-0 focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] focus-visible:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground data-[state=checked]:border-foreground transition-all size-6 [&_svg]:size-4",
      className,
    )}
    {...props}
  />
));
NeoCheckbox.displayName = "NeoCheckbox";

export { NeoCheckbox };

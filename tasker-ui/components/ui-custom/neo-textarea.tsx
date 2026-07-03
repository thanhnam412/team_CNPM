import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const neoTextareaVariants = cva(
  "rounded-none font-semibold bg-background transition-all p-4 placeholder:text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] focus-visible:shadow-[4px_4px_0px_0px_var(--primary)] focus-visible:border-primary",
        destructive:
          "border-2 border-destructive shadow-[4px_4px_0px_0px_var(--destructive)] focus-visible:border-destructive",
        success:
          "border-2 border-green-500 shadow-[4px_4px_0px_0px_#22c55e] focus-visible:border-green-500",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface NeoTextareaProps
  extends
    React.ComponentProps<typeof Textarea>,
    VariantProps<typeof neoTextareaVariants> {}

const NeoTextarea = React.forwardRef<HTMLTextAreaElement, NeoTextareaProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Textarea
        ref={ref}
        className={cn(neoTextareaVariants({ variant }), className)}
        {...props}
      />
    );
  },
);
NeoTextarea.displayName = "NeoTextarea";

export { NeoTextarea, neoTextareaVariants };

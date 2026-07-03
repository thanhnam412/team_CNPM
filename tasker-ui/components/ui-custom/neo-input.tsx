import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const neoInputVariants = cva(
  "rounded-none font-bold bg-background transition-all px-4 placeholder:text-muted-foreground",
  {
    variants: {
      variant: {
        default:
          "border-2 border-border shadow-[2px_2px_0px_0px_var(--border)] focus-visible:shadow-[2px_2px_0px_0px_var(--primary)] focus-visible:border-primary",
        destructive:
          "border-2 border-destructive shadow-[2px_2px_0px_0px_var(--destructive)] focus-visible:border-destructive",
        success:
          "border-2 border-green-500 shadow-[2px_2px_0px_0px_#22c55e] focus-visible:border-green-500",
      },
      size: {
        default: "h-12 text-sm",
        sm: "h-10 text-xs",
        lg: "h-14 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface NeoInputProps
  extends
    React.ComponentProps<typeof Input>,
    VariantProps<typeof neoInputVariants> {}

const NeoInput = React.forwardRef<HTMLInputElement, NeoInputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        className={cn(neoInputVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
NeoInput.displayName = "NeoInput";

export { NeoInput, neoInputVariants };

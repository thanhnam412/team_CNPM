import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neoBadgeVariants = cva(
  "inline-flex w-fit items-center justify-center border-2 uppercase font-black tracking-widest px-2 py-0.5 rounded-none transition-colors shadow-[2px_2px_0px_0px_var(--foreground)]",
  {
    variants: {
      variant: {
        default: "border-foreground bg-primary text-primary-foreground",
        secondary:
          "border-border bg-secondary text-secondary-foreground shadow-[2px_2px_0px_0px_var(--border)]",
        outline: "border-foreground bg-transparent text-foreground",
        destructive:
          "border-destructive bg-destructive/10 text-destructive shadow-[2px_2px_0px_0px_var(--destructive)]",
        warning:
          "border-[#E1801E] bg-[#E1801E]/10 text-[#E1801E] shadow-[2px_2px_0px_0px_#E1801E]",
        success:
          "border-green-600 bg-green-500/10 text-green-700 shadow-[2px_2px_0px_0px_#16a34a]", // #16a34a is Tailwind's green-600
        nightmare:
          "border-purple-600 bg-purple-500/10 text-purple-700 shadow-[2px_2px_0px_0px_#9333ea]",
        info: "border-blue-500 bg-blue-500/10 text-blue-600 shadow-[2px_2px_0px_0px_#3b82f6]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface NeoBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof neoBadgeVariants> {}

function NeoBadge({ className, variant, ...props }: NeoBadgeProps) {
  return (
    <div
      className={cn(neoBadgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { NeoBadge, neoBadgeVariants };

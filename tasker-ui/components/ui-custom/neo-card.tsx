import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const neoCardVariants = cva("rounded-none transition-all", {
  variants: {
    variant: {
      default:
        "border-2 border-border bg-card shadow-[4px_4px_0px_0px_var(--border)]",
      secondary:
        "border-2 border-border bg-secondary/10 shadow-[4px_4px_0px_0px_var(--border)]",
      interactive:
        "border-2 border-border bg-card shadow-[4px_4px_0px_0px_var(--border)] hover:-translate-x-1 hover:-translate-y-1 hover:border-foreground hover:shadow-[6px_6px_0px_0px_var(--foreground)] cursor-pointer active:translate-x-0 active:translate-y-0 active:shadow-[2px_2px_0px_0px_var(--foreground)]",
      heavy:
        "border-4 border-foreground bg-card shadow-[6px_6px_0px_0px_var(--foreground)]",
      outline:
        "border-2 border-foreground bg-transparent shadow-[4px_4px_0px_0px_var(--foreground)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface NeoCardProps
  extends
    React.ComponentProps<typeof Card>,
    VariantProps<typeof neoCardVariants> {}

const NeoCard = React.forwardRef<HTMLDivElement, NeoCardProps>(
  ({ className, variant, ...props }, ref) => (
    <Card
      ref={ref}
      className={cn(neoCardVariants({ variant }), className)}
      {...props}
    />
  ),
);
NeoCard.displayName = "NeoCard";

// We can simply export the other standard Shadcn card components to be used inside NeoCard
export {
  NeoCard,
  CardHeader as NeoCardHeader,
  CardFooter as NeoCardFooter,
  CardTitle as NeoCardTitle,
  CardAction as NeoCardAction,
  CardDescription as NeoCardDescription,
  CardContent as NeoCardContent,
};

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const neoButtonVariants = cva(
  "inline-flex items-center justify-center rounded-none border-2 uppercase font-black tracking-widest transition-all",
  {
    variants: {
      variant: {
        default: "border-foreground bg-primary text-primary-foreground",
        secondary: "border-foreground bg-secondary text-foreground",
        outline: "border-foreground bg-transparent text-foreground hover:bg-secondary/20",
        destructive: "border-foreground bg-destructive text-destructive-foreground",
        ghost: "border-transparent bg-transparent text-foreground hover:border-foreground hover:bg-secondary/20",
        link: "border-transparent text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 text-sm",
        sm: "h-8 px-3 text-[0.625rem]",
        lg: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface NeoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof neoButtonVariants> {
  asChild?: boolean;
}

const getShadowClasses = (variant: NeoButtonProps["variant"], size: NeoButtonProps["size"]) => {
  if (variant === "link") return "shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0";

  const isSmall = size === "sm" || size === "icon";
  const isLarge = size === "lg";
  const isGhost = variant === "ghost";
  const isOutline = variant === "outline";

  if (isSmall) {
    if (isGhost) return "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-x-0 active:translate-y-0 active:shadow-none";
    if (isOutline) return "shadow-[1px_1px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none";
    return "shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[3px_3px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]";
  }

  if (isLarge) {
    if (isGhost) return "hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[2px_2px_0px_0px_var(--foreground)]";
    if (isOutline) return "shadow-[3px_3px_0px_0px_var(--foreground)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[5px_5px_0px_0px_var(--foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--foreground)]";
    return "shadow-[6px_6px_0px_0px_var(--foreground)] hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-[9px_9px_0px_0px_var(--foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_var(--foreground)]";
  }

  // Default size
  if (isGhost) return "hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[2px_2px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]";
  if (isOutline) return "shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-[4px_4px_0px_0px_var(--foreground)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_var(--foreground)]";
  return "shadow-[4px_4px_0px_0px_var(--foreground)] hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_var(--foreground)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_var(--foreground)]";
};

const NeoButton = React.forwardRef<HTMLButtonElement, NeoButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(neoButtonVariants({ variant, size }), getShadowClasses(variant, size), className)}
        ref={ref}
        {...props}
      />
    );
  },
);
NeoButton.displayName = "NeoButton";

export { NeoButton, neoButtonVariants };

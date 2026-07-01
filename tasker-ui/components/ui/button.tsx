"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-sm border border-transparent bg-clip-padding text-xs font-semibold tracking-widest whitespace-nowrap uppercase transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        default: "bg-primary-container text-on-primary hover:bg-primary",
        outline: "border-outline-variant bg-transparent text-on-surface hover:bg-surface-container-low hover:text-primary",
        secondary: "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim",
        ghost: "hover:bg-surface-container-low hover:text-on-surface",
        destructive: "bg-error-container text-on-error-container hover:bg-error/10",
        link: "text-primary underline underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 gap-1.5 px-6",
        xs: "h-7 gap-1 px-3",
        sm: "h-9 gap-1 px-4",
        lg: "h-11 gap-1.5 px-8",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-9",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { loading?: boolean };

function Button({ className, variant = "default", size = "default", loading = false, disabled, children, ...props }: ButtonProps) {
  return (
    <motion.button
      data-slot="button"
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      <span className={loading ? "opacity-70" : undefined}>{children}</span>
    </motion.button>
  );
}

export { Button, buttonVariants };

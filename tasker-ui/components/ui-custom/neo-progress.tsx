import * as React from "react";
import { cn } from "@/lib/utils";

interface NeoProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  variant?: "default" | "secondary" | "destructive" | "warning";
}

export function NeoProgress({ value, variant = "default", className, ...props }: NeoProgressProps) {
  const percentage = Math.max(0, Math.min(100, value));

  const variantColors = {
    default: "bg-primary",
    secondary: "bg-secondary",
    destructive: "bg-destructive",
    warning: "bg-warning",
  };

  return (
    <div
      className={cn("h-4 border-2 border-border bg-secondary/30 w-full relative overflow-hidden", className)}
      {...props}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 border-r-2 border-border transition-all duration-500",
          variantColors[variant]
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

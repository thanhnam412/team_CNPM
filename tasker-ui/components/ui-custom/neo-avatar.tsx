import * as React from "react";
import { cn } from "@/lib/utils";

interface NeoAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  size?: "sm" | "default" | "lg";
}

export function NeoAvatar({ name = "U", size = "default", className, ...props }: NeoAvatarProps) {
  const initial = name ? name.charAt(0).toUpperCase() : "U";

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    default: "w-10 h-10 text-base",
    lg: "w-14 h-14 text-xl",
  };

  return (
    <div
      className={cn(
        "border-2 border-foreground bg-primary flex items-center justify-center font-heading font-black text-primary-foreground shrink-0 shadow-[2px_2px_0px_0px_var(--foreground)] uppercase",
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {initial}
    </div>
  );
}

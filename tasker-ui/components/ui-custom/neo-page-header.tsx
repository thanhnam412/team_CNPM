import React from "react";
import { cn } from "@/lib/utils";

export interface NeoPageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  rightContent?: React.ReactNode;
  
  /**
   * Defines the visual style of the header block.
   */
  variant?: "default" | "solid" | "tinted" | "transparent";
  
  /**
   * The heading tag to use for the title.
   */
  headingTag?: "h1" | "h2" | "h3";
  
  /**
   * Additional classes for the outer container.
   */
  className?: string;
  
  /**
   * Additional classes for the inner container.
   */
  containerClassName?: string;
}

export function NeoPageHeader({
  title,
  description,
  icon,
  rightContent,
  variant = "default",
  headingTag = "h1",
  className,
  containerClassName,
}: NeoPageHeaderProps) {
  
  const Heading = headingTag;

  // Compute container classes based on variant
  const outerClasses = cn(
    "shrink-0",
    variant === "default" && "bg-card border-b-2 border-border",
    variant === "solid" && "bg-primary text-primary-foreground border-b-4 border-foreground z-20 relative",
    variant === "tinted" && "bg-[#E1801E]/10 border-b-2 border-[#E1801E]",
    variant === "transparent" && "bg-transparent border-b-2 border-border",
    className
  );

  return (
    <div className={outerClasses}>
      <div className={cn(
        "flex flex-col md:flex-row items-start md:items-center justify-between gap-4",
        variant === "solid" ? "p-6 md:p-8 max-w-3xl mx-auto w-full" : "px-6 py-6",
        containerClassName
      )}>
        <div className={variant === "solid" ? "text-white" : ""}>
          <Heading className={cn(
            "font-heading font-black tracking-widest uppercase flex items-center gap-3",
            headingTag === "h1" ? "text-3xl md:text-4xl" : "text-3xl"
          )}>
            {icon && <span className={cn(variant === "solid" && "fill-white")}>{icon}</span>}
            {title}
          </Heading>
          
          {description && (
            <p className={cn(
              "text-xs uppercase tracking-widest mt-2",
              variant === "solid" ? "font-bold opacity-90" : "font-semibold text-muted-foreground"
            )}>
              {description}
            </p>
          )}
        </div>
        
        {rightContent && (
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            {rightContent}
          </div>
        )}
      </div>
    </div>
  );
}

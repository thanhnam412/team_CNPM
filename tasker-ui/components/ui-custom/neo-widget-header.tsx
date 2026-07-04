import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface NeoWidgetHeaderProps {
  title: React.ReactNode;
  icon?: React.ReactNode;
  href?: string;
  linkText?: string;
  rightContent?: React.ReactNode;
  className?: string;
}

export function NeoWidgetHeader({
  title,
  icon,
  href,
  linkText,
  rightContent,
  className,
}: NeoWidgetHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {rightContent ? (
        rightContent
      ) : href && linkText ? (
        <Link
          href={href}
          className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center shrink-0"
        >
          {linkText} <ChevronRight className="w-3 h-3 ml-1" />
        </Link>
      ) : null}
    </div>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { ChevronRight, ZapIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ROUTE_LABELS: Record<string, string> = {
  client: "Client",
  expert: "Expert",
  projects: "Projects",
  "quick-tasks": "Quick Tasks",
  experts: "Find Experts",
  finance: "Finance",
  messages: "Messages",
  settings: "Settings",
  workspace: "Workspace",
  earnings: "Earnings",
  "find-work": "Find Work",
  tasks: "Tasks",
  milestones: "Milestones",
  new: "New",
  create: "Create",
  dashboard: "Dashboard",
};

function formatSegment(segment: string): string {
  return ROUTE_LABELS[segment] ?? segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const baseRoute = segments[0] || "client";
  const trailSegments = segments.slice(1);
  const isExpert = baseRoute === "expert";

  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center gap-0 sticky top-0 z-10",
        "border-b-2 border-foreground",
        "bg-card",
        "transition-[width,height] ease-linear",
        "group-has-data-[collapsible=icon]/sidebar-wrapper:h-12",
      )}
    >
      {/* Sidebar trigger — Neo style */}
      <div
        className={cn(
          "flex items-center justify-center h-full px-3 shrink-0",
          "border-r-2 border-foreground",
          "hover:bg-primary hover:text-primary-foreground",
          "transition-colors cursor-pointer group/trigger",
        )}
      >
        <SidebarTrigger className="[&>svg]:w-4 [&>svg]:h-4" />
      </div>

      {/* Breadcrumb */}
      <nav className="flex items-center h-full flex-1 overflow-x-auto px-4 gap-0 min-w-0">
        {/* Brand anchor */}
        <Link
          href={`/${baseRoute}`}
          className={cn(
            "flex items-center gap-2 shrink-0 h-full px-3",
            "font-black uppercase tracking-widest text-[0.625rem]",
            "border-r-2 border-border",
            "hover:bg-secondary/30 transition-colors",
          )}
        >
          <ZapIcon className="w-3 h-3 text-primary fill-primary" />
          <span className="text-primary">
            {isExpert ? "Expert" : "Client"}
          </span>
        </Link>

        {/* Trail segments */}
        {trailSegments.map((segment, index) => {
          const isLast = index === trailSegments.length - 1;
          const href = `/${baseRoute}/${trailSegments.slice(0, index + 1).join("/")}`;
          const label = formatSegment(segment);

          return (
            <React.Fragment key={`${segment}-${index}`}>
              {/* Separator */}
              <span
                className={cn(
                  "shrink-0 flex items-center justify-center h-full px-1",
                  "text-border border-r border-border",
                )}
                aria-hidden
              >
                <ChevronRight className="w-3 h-3 text-muted-foreground" />
              </span>

              {/* Segment */}
              {isLast ? (
                <span
                  className={cn(
                    "shrink-0 flex items-center h-full px-3",
                    "font-black uppercase tracking-widest text-[0.625rem]",
                    "bg-foreground text-background",
                  )}
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className={cn(
                    "shrink-0 flex items-center h-full px-3",
                    "font-bold uppercase tracking-widest text-[0.625rem]",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-secondary/30 transition-colors",
                  )}
                >
                  {label}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </header>
  );
}

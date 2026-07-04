"use client";

import { usePathname } from "next/navigation";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
  return (
    ROUTE_LABELS[segment] ??
    segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function DashboardHeader() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const baseRoute = segments[0] || "client";
  const trailSegments = segments.slice(1);
  const isExpert = baseRoute === "expert";

  const { toggleSidebar } = useSidebar();

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
      <SidebarTrigger
        className={cn(
          "flex items-center justify-center h-full w-14 rounded-none px-3 shrink-0",
          "border-y-0 border-l-0 border-r-2 border-foreground",
          "bg-transparent text-foreground shadow-none",
          "hover:bg-primary hover:text-primary-foreground hover:shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0 active:shadow-none",
          "transition-colors cursor-pointer outline-none",
          "[&>svg]:w-5 [&>svg]:h-5"
        )}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center h-full flex-1 overflow-x-auto min-w-0">
        {/* Brand anchor */}
        <Link
          href={`/${baseRoute}`}
          className={cn(
            "flex items-center gap-2 shrink-0 h-full px-4",
            "font-black uppercase tracking-widest text-[0.625rem]",
            "border-r-2 border-foreground",
            "hover:bg-primary hover:text-primary-foreground transition-colors",
          )}
        >
          <ZapIcon className="w-3 h-3 text-current fill-current" />
          <span>{isExpert ? "Expert Workspace" : "Client Workspace"}</span>
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
                className="shrink-0 flex items-center justify-center h-full px-2 text-foreground"
                aria-hidden
              >
                <ChevronRight className="w-4 h-4" strokeWidth={3} />
              </span>

              {/* Segment */}
              {isLast ? (
                <span
                  className={cn(
                    "shrink-0 flex items-center h-6 px-3 rounded-none",
                    "font-black uppercase tracking-widest text-[0.625rem]",
                    "bg-foreground text-background border-2 border-foreground",
                    "shadow-[2px_2px_0px_0px_var(--primary)]",
                  )}
                >
                  {label}
                </span>
              ) : (
                <Link
                  href={href}
                  className={cn(
                    "shrink-0 flex items-center h-6 px-3 rounded-none",
                    "font-bold uppercase tracking-widest text-[0.625rem]",
                    "bg-secondary text-secondary-foreground border-2 border-foreground",
                    "hover:bg-primary hover:text-primary-foreground",
                    "shadow-[2px_2px_0px_0px_var(--foreground)]",
                    "transition-all active:translate-x-[2px] active:translate-y-[2px] active:shadow-none",
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

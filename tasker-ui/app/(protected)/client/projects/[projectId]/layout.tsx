"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Target,
  KanbanSquare,
  Store,
  Wallet,
  Activity,
  Settings,
} from "lucide-react";

export default function ProjectSpaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId as string;
  const basePath = `/client/projects/${projectId}`;

  const tabs = [
    { name: "Overview", href: basePath, icon: LayoutDashboard },
    { name: "Team", href: `${basePath}/team`, icon: Users },
    { name: "Milestones", href: `${basePath}/milestones`, icon: Target },
    { name: "Board", href: `${basePath}/board`, icon: KanbanSquare },
    { name: "Marketplace", href: `${basePath}/marketplace`, icon: Store },
    { name: "Finance", href: `${basePath}/finance`, icon: Wallet },
    { name: "Activity", href: `${basePath}/activity`, icon: Activity },
    { name: "Settings", href: `${basePath}/settings`, icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Project Sub-header */}
      <div className="shrink-0 border-b-2 border-border bg-card">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-heading font-black tracking-widest uppercase text-foreground">
              Project Workspace
            </h1>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
              ID: {projectId}
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            // Exact match for Overview since it's the base path
            const isExactMatch =
              tab.name === "Overview" ? pathname === tab.href : isActive;

            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 border-x-2 border-t-2 border-transparent border-b-0 uppercase font-bold tracking-widest text-xs transition-colors whitespace-nowrap",
                  isExactMatch
                    ? "border-border bg-background shadow-[0px_-2px_0px_0px_var(--primary)_inset] text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-border",
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area for the sub-page */}
      <div className="flex-1 overflow-y-auto bg-background relative">
        {children}
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Zap, Layers } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function FindWorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const tabs = [
    { name: "Quick Tasks", href: "/expert/find-work/tasks", icon: Zap },
    { name: "Milestones", href: "/expert/find-work/milestones", icon: Layers },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b-2 border-border bg-card">
        <NeoPageHeader
          variant="transparent"
          className="border-b-0"
          title="Find Work"
          description="Browse available tasks and project milestones"
        />

        {/* Navigation Tabs */}
        <div className="px-6 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 px-6 py-4 border-x-2 border-t-2 border-transparent border-b-0 uppercase font-black tracking-widest text-sm transition-colors whitespace-nowrap",
                  isActive
                    ? "border-border bg-background shadow-[0px_-4px_0px_0px_var(--primary)_inset] text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground hover:border-border",
                )}
              >
                <Icon className="w-5 h-5" />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-background relative">
        {children}
      </div>
    </div>
  );
}

import Link from "next/link";
import { cn } from "@/lib/utils";

export interface TabItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

export interface ProjectDetailTabsProps {
  tabs: TabItem[];
  pathname: string;
}

export function ProjectDetailTabs({ tabs, pathname }: ProjectDetailTabsProps) {
  return (
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
  );
}

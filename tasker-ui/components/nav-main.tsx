"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

function NavItem({ item }: { item: NavItem }) {
  const pathname = usePathname();

  const isActive =
    pathname === item.url || pathname.startsWith(item.url + "/");
  const hasChildren = Boolean(item.items?.length);

  // Controlled open state — initialised once, then user can toggle
  const [open, setOpen] = useState(isActive);

  // Keep open when route changes to a child of this item
  useEffect(() => {
    if (isActive) setOpen(true);
  }, [isActive]);

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/collapsible"
      render={<SidebarMenuItem />}
    >
      <CollapsibleTrigger
        render={
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "rounded-none h-10 px-3 font-black uppercase tracking-widest text-[0.625rem]",
              "border-2 border-transparent",
              "transition-all duration-100",
              "hover:border-foreground hover:bg-secondary/40",
              "hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
              "hover:-translate-x-[1px] hover:-translate-y-[1px]",
              isActive && [
                "border-foreground bg-primary text-primary-foreground",
                "shadow-[3px_3px_0px_0px_var(--foreground)]",
                "-translate-x-[1px] -translate-y-[1px]",
                "hover:shadow-[4px_4px_0px_0px_var(--foreground)]",
                "hover:-translate-x-[2px] hover:-translate-y-[2px]",
              ],
            )}
          />
        }
      >
        <span
          className={cn(
            "flex items-center justify-center shrink-0",
            "[&>svg]:w-4 [&>svg]:h-4",
            isActive ? "text-primary-foreground" : "text-foreground",
          )}
        >
          {item.icon}
        </span>
        <span className="flex-1">{item.title}</span>
        {hasChildren && (
          <ChevronRightIcon
            className={cn(
              "ml-auto w-3 h-3 transition-transform duration-200",
              open && "rotate-90",
              isActive ? "text-primary-foreground" : "text-muted-foreground",
            )}
          />
        )}
      </CollapsibleTrigger>

      {hasChildren && (
        <CollapsibleContent>
          <SidebarMenuSub className="ml-4 mt-0.5 gap-0.5 border-l-2 border-border pl-2">
            {item.items?.map((subItem) => {
              const isSubActive = pathname === subItem.url;
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    render={<a href={subItem.url} />}
                    className={cn(
                      "rounded-none h-8 px-3",
                      "font-bold uppercase tracking-widest text-[0.5rem]",
                      "border-2 border-transparent",
                      "transition-all duration-100",
                      "hover:border-foreground hover:bg-secondary/30",
                      "hover:shadow-[2px_2px_0px_0px_var(--foreground)]",
                      "hover:-translate-x-[1px] hover:-translate-y-[1px]",
                      isSubActive && [
                        "border-foreground bg-secondary text-foreground",
                        "shadow-[2px_2px_0px_0px_var(--foreground)]",
                        "-translate-x-[1px] -translate-y-[1px]",
                      ],
                    )}
                  >
                    <span className="w-1 h-1 rounded-full bg-current shrink-0" />
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      )}
    </Collapsible>
  );
}

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="uppercase tracking-[0.2em] text-[0.5rem] font-black text-muted-foreground/60 px-2 mb-1">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

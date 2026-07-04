"use client";

import * as React from "react";

import {
  NeoDropdownMenu,
  NeoDropdownMenuContent,
  NeoDropdownMenuGroup,
  NeoDropdownMenuItem,
  NeoDropdownMenuLabel,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuShortcut,
  NeoDropdownMenuTrigger,
} from "@/components/ui-custom/neo-dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronsUpDownIcon, PlusIcon, ZapIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ReactNode;
    plan: string;
  }[];
}) {
  const { isMobile, state } = useSidebar();
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);
  if (!activeTeam) {
    return null;
  }

  const isCollapsed = state === "collapsed";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <NeoDropdownMenu>
          <NeoDropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className={cn(
                  "rounded-none h-12",
                  "border-2 border-transparent",
                  "font-black uppercase tracking-widest",
                  "transition-all duration-100",
                  "hover:border-foreground hover:bg-primary hover:text-primary-foreground",
                  "hover:shadow-[3px_3px_0px_0px_var(--foreground)]",
                  "hover:-translate-x-[1px] hover:-translate-y-[1px]",
                  "data-open:border-foreground data-open:bg-primary data-open:text-primary-foreground",
                  "data-open:shadow-[3px_3px_0px_0px_var(--foreground)]",
                )}
              />
            }
          >
            {/* Logo box */}
            <div
              className={cn(
                "flex aspect-square size-8 items-center justify-center shrink-0",
                "border-2 border-foreground bg-primary text-primary-foreground",
                "shadow-[2px_2px_0px_0px_var(--foreground)]",
                "[&>svg]:w-4 [&>svg]:h-4",
              )}
            >
              <ZapIcon className="fill-primary-foreground" />
            </div>

            <div className="grid flex-1 text-left leading-tight min-w-0">
              <span className="truncate font-black uppercase tracking-widest text-[0.625rem]">
                {activeTeam.name}
              </span>
              <span className="truncate text-[0.5rem] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary-foreground/70">
                {activeTeam.plan}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto w-4 h-4 shrink-0" />
          </NeoDropdownMenuTrigger>

          <NeoDropdownMenuContent
            className="w-fit min-w-52"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={8}
          >
            <NeoDropdownMenuGroup>
              <NeoDropdownMenuLabel className="text-[0.5rem] uppercase tracking-widest font-black text-muted-foreground">
                Workspaces
              </NeoDropdownMenuLabel>
              {teams.map((team, index) => (
                <NeoDropdownMenuItem
                  key={team.name}
                  onClick={() => setActiveTeam(team)}
                  className="gap-3 py-2"
                >
                  <div className="flex size-6 items-center justify-center border-2 border-foreground bg-primary text-primary-foreground shadow-[1px_1px_0px_0px_var(--foreground)] shrink-0 [&>svg]:w-3 [&>svg]:h-3">
                    <ZapIcon className="fill-primary-foreground" />
                  </div>
                  <span className="font-bold uppercase tracking-widest text-[0.625rem] flex-1">
                    {team.name}
                  </span>
                  <NeoDropdownMenuShortcut>
                    ⌘{index + 1}
                  </NeoDropdownMenuShortcut>
                </NeoDropdownMenuItem>
              ))}
            </NeoDropdownMenuGroup>
            <NeoDropdownMenuSeparator />
            <NeoDropdownMenuGroup>
              <NeoDropdownMenuItem
                className="gap-3 py-2 cursor-pointer"
                onClick={() => {
                  const currentUrl = window.location.pathname;
                  if (currentUrl.startsWith("/expert")) {
                    window.location.href = "/client";
                  } else {
                    window.location.href = "/expert";
                  }
                }}
              >
                <div className="flex size-6 items-center justify-center border-2 border-foreground bg-primary/20 text-primary shrink-0 [&>svg]:w-3 [&>svg]:h-3">
                  <ZapIcon className="fill-primary" />
                </div>
                <span className="font-bold uppercase tracking-widest text-[0.625rem] flex-1">
                  Switch Workspace Role
                </span>
              </NeoDropdownMenuItem>
            </NeoDropdownMenuGroup>
            <NeoDropdownMenuSeparator />
            <NeoDropdownMenuGroup>
              <NeoDropdownMenuItem className="gap-3 py-2">
                <div className="flex size-6 items-center justify-center border-2 border-border bg-transparent shrink-0">
                  <PlusIcon className="w-3 h-3" />
                </div>
                <span className="font-bold uppercase tracking-widest text-[0.625rem] text-muted-foreground">
                  Add Workspace
                </span>
              </NeoDropdownMenuItem>
            </NeoDropdownMenuGroup>
          </NeoDropdownMenuContent>
        </NeoDropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  NeoDropdownMenu,
  NeoDropdownMenuContent,
  NeoDropdownMenuGroup,
  NeoDropdownMenuItem,
  NeoDropdownMenuLabel,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuTrigger,
} from "@/components/ui-custom/neo-dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  SparklesIcon,
  BadgeCheckIcon,
  CreditCardIcon,
  BellIcon,
  LogOutIcon,
  RepeatIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { userService } from "@/services/userService";
import { useState } from "react";

export function NavUser({
  user,
}: {
  user: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    image?: string;
    currentRole?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const [isSwitching, setIsSwitching] = useState(false);

  const displayName = user.name || "User";
  const displayAvatar = user.avatar || user.image || "";

  const handleSwitchRole = async () => {
    if (!user.id) return;
    setIsSwitching(true);
    const targetRole = user.currentRole === "EXPERT" ? "CLIENT" : "EXPERT";
    try {
      await userService.switchRole(user.id, targetRole);

      window.location.href = targetRole === "EXPERT" ? "/expert" : "/client";
    } catch (e) {
      console.error("Failed to switch role", e);
      setIsSwitching(false);
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

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
                  "hover:border-foreground hover:bg-secondary/40",
                  "hover:shadow-[3px_3px_0px_0px_var(--foreground)]",
                  "hover:-translate-x-[1px] hover:-translate-y-[1px]",
                  "aria-expanded:border-foreground aria-expanded:bg-secondary/60",
                  "aria-expanded:shadow-[2px_2px_0px_0px_var(--foreground)]",
                )}
              />
            }
          >
            {/* Neo avatar box */}
            <div className="relative shrink-0">
              <Avatar className="rounded-none w-8 h-8 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                <AvatarImage
                  src={displayAvatar}
                  alt={displayName}
                  className="rounded-none"
                />
                <AvatarFallback className="rounded-none bg-primary text-primary-foreground font-black text-[0.625rem] uppercase">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* Online dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-sidebar" />
            </div>

            <div className="grid flex-1 text-left leading-tight min-w-0">
              <span className="truncate font-black uppercase tracking-widest text-[0.625rem]">
                {displayName}
              </span>
              <span className="truncate text-[0.5rem] font-medium text-muted-foreground">
                {user.email}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto w-4 h-4 shrink-0 text-muted-foreground" />
          </NeoDropdownMenuTrigger>

          <NeoDropdownMenuContent
            className="w-fit min-w-60"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={8}
          >
            {/* User info header */}
            <NeoDropdownMenuGroup>
              <NeoDropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 px-3 py-3 border-b-2 border-border">
                  <Avatar className="rounded-none w-10 h-10 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                    <AvatarImage
                      src={displayAvatar}
                      alt={displayName}
                      className="rounded-none"
                    />
                    <AvatarFallback className="rounded-none bg-primary text-primary-foreground font-black text-xs uppercase">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-left leading-tight">
                    <span className="font-black uppercase tracking-widest text-[0.625rem] text-foreground">
                      {displayName}
                    </span>
                    <span className="text-[0.5rem] font-medium text-muted-foreground">
                      {user.email}
                    </span>
                  </div>
                </div>
              </NeoDropdownMenuLabel>
            </NeoDropdownMenuGroup>

            <NeoDropdownMenuGroup>
              <NeoDropdownMenuItem>
                <SparklesIcon className="w-4 h-4" />
                Upgrade to Pro
              </NeoDropdownMenuItem>
              <NeoDropdownMenuItem
                onClick={handleSwitchRole}
                disabled={isSwitching}
              >
                <RepeatIcon className="w-4 h-4" />
                {isSwitching
                  ? "Switching..."
                  : `Switch to ${user.currentRole === "EXPERT" ? "Client" : "Expert"}`}
              </NeoDropdownMenuItem>
            </NeoDropdownMenuGroup>

            <NeoDropdownMenuSeparator />

            <NeoDropdownMenuGroup>
              <NeoDropdownMenuItem>
                <BadgeCheckIcon className="w-4 h-4" />
                Account
              </NeoDropdownMenuItem>
              <NeoDropdownMenuItem>
                <CreditCardIcon className="w-4 h-4" />
                Billing
              </NeoDropdownMenuItem>
              <NeoDropdownMenuItem>
                <BellIcon className="w-4 h-4" />
                Notifications
              </NeoDropdownMenuItem>
            </NeoDropdownMenuGroup>

            <NeoDropdownMenuSeparator />

            <NeoDropdownMenuItem className="text-destructive hover:text-destructive focus:text-destructive">
              <LogOutIcon className="w-4 h-4" />
              Log out
            </NeoDropdownMenuItem>
          </NeoDropdownMenuContent>
        </NeoDropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

"use client";

import {
  NeoDropdownMenu,
  NeoDropdownMenuContent,
  NeoDropdownMenuItem,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuTrigger,
} from "@/components/ui-custom/neo-dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MoreHorizontalIcon,
  FolderIcon,
  ArrowRightIcon,
  Trash2Icon,
} from "lucide-react";

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: React.ReactNode;
  }[];
}) {
  const { isMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton render={<a href={item.url} />}>
              {item.icon}
              <span>{item.name}</span>
            </SidebarMenuButton>
            <NeoDropdownMenu>
              <NeoDropdownMenuTrigger
                render={
                  <SidebarMenuAction
                    showOnHover
                    className="aria-expanded:bg-muted"
                  />
                }
              >
                <MoreHorizontalIcon />
                <span className="sr-only">More</span>
              </NeoDropdownMenuTrigger>
              <NeoDropdownMenuContent
                className="w-fit"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <NeoDropdownMenuItem>
                  <FolderIcon />
                  <span>View Project</span>
                </NeoDropdownMenuItem>
                <NeoDropdownMenuItem>
                  <ArrowRightIcon />
                  <span>Share Project</span>
                </NeoDropdownMenuItem>
                <NeoDropdownMenuSeparator />
                <NeoDropdownMenuItem variant="destructive">
                  <Trash2Icon />
                  <span>Delete Project</span>
                </NeoDropdownMenuItem>
              </NeoDropdownMenuContent>
            </NeoDropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontalIcon className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

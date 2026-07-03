"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  MessageSquareIcon,
  Settings2Icon,
  WalletIcon,
  TargetIcon,
  SearchIcon,
  UsersIcon,
  FolderKanbanIcon,
  ZapIcon
} from "lucide-react";

const sharedData = {
  user: {
    name: "Admin User",
    email: "admin@aitasker.com",
    avatar: "https://i.pravatar.cc/150?u=admin",
  },
  teams: [
    {
      name: "AITasker Core",
      logo: <ZapIcon />,
      plan: "Enterprise",
    }
  ],
};

const clientNavMain = [
  {
    title: "Command Center",
    url: "/client",
    icon: <LayoutDashboardIcon />,
    isActive: true,
  },
  {
    title: "Projects",
    url: "/client/projects",
    icon: <FolderKanbanIcon />,
    items: [
      {
        title: "All Projects",
        url: "/client/projects",
      },
      {
        title: "Create New Project",
        url: "/client/projects/new",
      },
    ],
  },
  {
    title: "Quick Tasks",
    url: "/client/quick-tasks",
    icon: <TargetIcon />,
    items: [
      {
        title: "Browse Tasks",
        url: "/client/quick-tasks",
      },
      {
        title: "Post a Task",
        url: "/client/quick-tasks/create",
      },
    ]
  },
  {
    title: "Find Experts",
    url: "/client/experts",
    icon: <UsersIcon />,
  },
  {
    title: "Finance",
    url: "/client/finance",
    icon: <WalletIcon />,
  },
  {
    title: "Messages",
    url: "/client/messages",
    icon: <MessageSquareIcon />,
  },
  {
    title: "Settings",
    url: "/client/settings",
    icon: <Settings2Icon />,
  },
];

const expertNavMain = [
  {
    title: "Command Center",
    url: "/expert",
    icon: <LayoutDashboardIcon />,
    isActive: true,
  },
  {
    title: "Find Work",
    url: "/expert/find-work/tasks",
    icon: <SearchIcon />,
    items: [
      {
        title: "Quick Tasks",
        url: "/expert/find-work/tasks",
      },
      {
        title: "Project Milestones",
        url: "/expert/find-work/milestones",
      },
    ],
  },
  {
    title: "My Workspace",
    url: "/expert/workspace",
    icon: <BriefcaseIcon />,
  },
  {
    title: "Earnings",
    url: "/expert/earnings",
    icon: <WalletIcon />,
  },
  {
    title: "Messages",
    url: "/expert/messages",
    icon: <MessageSquareIcon />,
  },
  {
    title: "Settings",
    url: "/expert/settings",
    icon: <Settings2Icon />,
  },
];

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  isExpert?: boolean;
}

export function AppSidebar({ isExpert = false, ...props }: AppSidebarProps) {
  const pathname = usePathname();
  
  // Auto-detect role based on pathname if not explicitly provided
  const isExpertRoute = isExpert || pathname.startsWith("/expert");
  
  const navMain = isExpertRoute ? expertNavMain : clientNavMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={sharedData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* We can hide NavProjects or use it for recent items later if needed */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sharedData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

"use client";

import { usePathname, useParams } from "next/navigation";
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
import { ProjectDetailLayoutBlock } from "@/block-ui/project/detail/layout";

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
  ];

  return (
    <ProjectDetailLayoutBlock
      projectId={projectId}
      tabs={tabs}
      pathname={pathname}
    >
      {children}
    </ProjectDetailLayoutBlock>
  );
}

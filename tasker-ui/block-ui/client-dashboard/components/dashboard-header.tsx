import Link from "next/link";
import { Zap } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";

export interface DashboardHeaderProps {
  userName: string;
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <NeoPageHeader
      containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
      icon={<Zap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
      title={`Welcome back, ${userName}`}
      description="Here's what's happening across your projects today."
      rightContent={
        <Link href="/client/projects/create">
          <NeoButton className="h-12 px-6">New Project</NeoButton>
        </Link>
      }
    />
  );
}

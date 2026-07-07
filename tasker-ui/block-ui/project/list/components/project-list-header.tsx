import Link from "next/link";
import { Plus } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";

export function ProjectListHeader() {
  return (
    <NeoPageHeader
      title="Projects"
      description="Manage your large-scale AI initiatives"
      rightContent={
        <Link href="/client/projects/new" className="w-full sm:w-auto">
          <NeoButton className="h-12 px-6 w-full md:w-auto">
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </NeoButton>
        </Link>
      }
    />
  );
}

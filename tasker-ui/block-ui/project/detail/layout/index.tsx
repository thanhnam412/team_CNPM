import { ProjectDetailHeader } from "./components/project-detail-header";
import { ProjectDetailTabs, TabItem } from "./components/project-detail-tabs";

export interface ProjectDetailLayoutBlockProps {
  projectId: string;
  tabs: TabItem[];
  pathname: string;
  children: React.ReactNode;
}

export function ProjectDetailLayoutBlock({
  projectId,
  tabs,
  pathname,
  children,
}: ProjectDetailLayoutBlockProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      {/* Project Sub-header */}
      <div className="shrink-0 border-b-2 border-border bg-card">
        <ProjectDetailHeader projectId={projectId} />
        <ProjectDetailTabs tabs={tabs} pathname={pathname} />
      </div>

      {/* Main Content Area for the sub-page */}
      <div className="flex-1 overflow-y-auto bg-background relative">
        {children}
      </div>
    </div>
  );
}

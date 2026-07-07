export interface ProjectDetailHeaderProps {
  projectId: string;
}

export function ProjectDetailHeader({ projectId }: ProjectDetailHeaderProps) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-heading font-black tracking-widest uppercase text-foreground">
          Project Workspace
        </h1>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
          ID: {projectId}
        </p>
      </div>
    </div>
  );
}

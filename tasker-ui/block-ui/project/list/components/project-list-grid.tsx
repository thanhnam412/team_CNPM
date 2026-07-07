import { ProjectCard } from "./project-card";

export interface ProjectListGridProps {
  projects: any[];
  isLoading: boolean;
}

export function ProjectListGrid({ projects, isLoading }: ProjectListGridProps) {
  if (isLoading) {
    return (
      <div className="text-center p-12 text-muted-foreground uppercase tracking-widest font-bold text-xs animate-pulse">
        Loading projects...
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center p-12 text-muted-foreground uppercase tracking-widest font-bold text-xs bg-secondary/10 border-2 border-dashed border-border mt-8">
        No projects found.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto grid grid-cols-1 gap-6 pb-12 mt-6">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}

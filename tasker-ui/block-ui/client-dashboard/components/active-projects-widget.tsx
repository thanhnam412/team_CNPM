import Link from "next/link";
import { Briefcase, AlertTriangle } from "lucide-react";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoWidgetHeader } from "@/components/ui-custom/neo-widget-header";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoProgress } from "@/components/ui-custom/neo-progress";

export interface ActiveProjectsWidgetProps {
  projects: any[];
}

export function ActiveProjectsWidget({ projects }: ActiveProjectsWidgetProps) {
  return (
    <NeoCard className="p-6">
      <NeoWidgetHeader
        title="Active Projects"
        icon={<Briefcase className="w-5 h-5 text-primary" />}
        href="/client/projects"
        linkText="View All"
      />

      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <Link
                  href={`/client/projects/${project.id}`}
                  className="font-bold uppercase hover:text-primary transition-colors block truncate max-w-[200px] md:max-w-[300px]"
                >
                  {project.name}
                </Link>
                <div
                  className={`text-[0.625rem] font-bold uppercase tracking-widest mt-1 flex items-center gap-1 ${
                    project.status === "At Risk"
                      ? "text-warning"
                      : "text-muted-foreground"
                  }`}
                >
                  {project.status === "At Risk" && (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                  {project.deadlineInfo}
                </div>
              </div>
              <NeoBadge
                variant={project.status === "At Risk" ? "warning" : "success"}
              >
                {project.status}
              </NeoBadge>
            </div>
            <NeoProgress
              value={project.progress}
              variant={project.status === "At Risk" ? "warning" : "default"}
            />
            <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
              <span>Progress: {project.progress}%</span>
              <span>Escrow: {project.escrow}</span>
            </div>
          </div>
        ))}
      </div>
    </NeoCard>
  );
}

"use client";

import { ProjectListHeader } from "./components/project-list-header";
import { ProjectListToolbar } from "./components/project-list-toolbar";
import { ProjectListGrid } from "./components/project-list-grid";

export interface ProjectListBlockProps {
  projects: any[];
  isLoading: boolean;
  filter: string;
  onFilterChange: (val: string) => void;
}

export function ProjectListBlock({
  projects,
  isLoading,
  filter,
  onFilterChange,
}: ProjectListBlockProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <ProjectListHeader />
      <ProjectListToolbar filter={filter} onFilterChange={onFilterChange} />
      <div className="flex-1 overflow-y-auto bg-background p-6">
        <ProjectListGrid projects={projects} isLoading={isLoading} />
      </div>
    </div>
  );
}

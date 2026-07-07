"use client";

import { useState } from "react";
import { useProjects } from "@/tanstack/useProjects";
import { ProjectListBlock } from "@/block-ui/project/list";

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all");

  const { data: projects = [], isLoading } = useProjects();

  // Apply filtering logic locally if needed, or pass it to API
  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "open" && project.status === "ACTIVE") return true;
    if (filter === "review" && project.status === "Review") return true;
    if (filter === "completed" && project.status === "Completed") return true;
    if (filter === "progress" && project.status === "In Progress") return true;
    return false;
  });

  return (
    <ProjectListBlock
      projects={filteredProjects}
      isLoading={isLoading}
      filter={filter}
      onFilterChange={setFilter}
    />
  );
}

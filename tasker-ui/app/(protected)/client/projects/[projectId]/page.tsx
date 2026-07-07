"use client";

import { useState } from "react";
import { formatCurrency, parseDecimalInput } from "@/lib/utils";
import { CheckCircle2, Clock, Users, ArrowUpRight } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useProject,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/tanstack/useProjects";
import { ProjectOverviewBlock } from "@/block-ui/project/detail/overview";

export default function ProjectOverviewPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    budget: "",
  });

  const { data: project, isLoading } = useProject(projectId);
  const updateProjectMutation = useUpdateProjectMutation();
  const deleteProjectMutation = useDeleteProjectMutation();

  const stats = [
    {
      title: "Completion",
      value: `0%`,
      icon: CheckCircle2,
      desc: "Based on completed tasks",
    },
    {
      title: "Active Tasks",
      value: "0",
      icon: Clock,
      desc: "Open or in-progress",
    },
    {
      title: "Team Members",
      value: "0",
      icon: Users,
      desc: `0 Experts included`,
    },
    {
      title: "Budget Used",
      value: project?.spent !== undefined ? formatCurrency(project.spent) : "$0.00",
      icon: ArrowUpRight,
      desc: `Out of ${project?.budget !== undefined ? formatCurrency(project.budget) : "$0.00"}`,
    },
  ];

  if (isLoading) {
    return (
      <div className="p-6 pb-24 text-center text-muted-foreground animate-pulse">
        Loading project...
      </div>
    );
  }

  return (
    <ProjectOverviewBlock
      projectTitle={project?.title || "Project Overview"}
      stats={stats}
      isSettingsOpen={isSettingsOpen}
      onOpenSettings={() => {
        setEditForm({
          title: project?.title || "",
          description: project?.description || "",
          budget: parseDecimalInput(project?.budget || 0),
        });
        setIsSettingsOpen(true);
      }}
      onCloseSettings={() => setIsSettingsOpen(false)}
      editForm={editForm}
      onEditFormChange={setEditForm}
      onSaveSettings={() => {
        updateProjectMutation.mutate(
          {
            id: projectId,
            data: {
              title: editForm.title,
              description: editForm.description,
              budget: parseFloat(editForm.budget) || 0,
            },
          },
          {
            onSuccess: () => setIsSettingsOpen(false),
          },
        );
      }}
      onDeleteProject={() => {
        deleteProjectMutation.mutate(projectId, {
          onSuccess: () => router.push("/client/projects"),
          onError: (error: any) => {
            const message = error?.response?.data?.message || error.message || "Failed to delete project";
            toast.error(message);
          }
        });
      }}
      isSaving={updateProjectMutation.isPending}
      isDeleting={deleteProjectMutation.isPending}
    />
  );
}

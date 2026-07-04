"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Clock, Users, Settings, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { useProject, useUpdateProjectMutation, useDeleteProjectMutation } from "@/tanstack/useProjects";

export default function ProjectOverviewPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editForm, setEditForm] = useState({ title: "", description: "", budget: "" });

  const { data: project, isLoading } = useProject(projectId);

  const updateProjectMutation = useUpdateProjectMutation(projectId);
  const deleteProjectMutation = useDeleteProjectMutation(projectId);
  const stats = [
    { title: "Completion", value: `${project?.stats?.completion || 0}%`, icon: CheckCircle2, desc: "Based on completed tasks" },
    {
      title: "Active Tasks",
      value: project?.stats?.activeTasks?.toString() || "0",
      icon: Clock,
      desc: "Open or in-progress",
    },
    {
      title: "Team Members",
      value: project?.stats?.totalMembers?.toString() || "0",
      icon: Users,
      desc: `${project?.stats?.expertMembers || 0} Experts included`,
    },
    {
      title: "Budget Used",
      value: project?.spent || "$0",
      icon: ArrowUpRight,
      desc: `Out of ${project?.budget || "$0"}`,
    },
  ];

  if (isLoading) {
    return <div className="p-6 pb-24 text-center text-muted-foreground">Loading project...</div>;
  }

  return (
    <div className="p-6 pb-24 max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="uppercase tracking-widest font-bold text-xs text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-heading font-black tracking-wider mb-2">
                {stat.value}
              </div>
              <p className="text-xs uppercase font-semibold text-muted-foreground">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-widest flex items-center gap-2">
          {project?.title || "Project Overview"}
        </h2>
        <NeoButton
          variant="outline"
          className="h-10 text-xs"
          onClick={() => {
            setEditForm({
              title: project?.title || "",
              description: project?.description || "",
              budget: project?.budget?.toString().replace(/[^0-9.]/g, "") || "0",
            });
            setIsSettingsOpen(true);
          }}
        >
          <Settings className="w-4 h-4 mr-2" /> Settings
        </NeoButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] min-h-[300px]">
          <h3 className="uppercase tracking-widest font-black text-sm mb-6 border-b-2 border-border pb-4">
            Burndown Chart
          </h3>
          <div className="flex items-center justify-center h-48 bg-secondary/30 border-2 border-dashed border-border">
            <span className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">
              [Chart Placeholder]
            </span>
          </div>
        </div>

        <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
          <h3 className="uppercase tracking-widest font-black text-sm mb-6 border-b-2 border-border pb-4">
            Upcoming Milestones
          </h3>
          <div className="space-y-4">
            {project?.milestones && project.milestones.length > 0 ? (
              project.milestones.map((m: any, i: number) => (
                <div key={m.id || i} className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full border-2 border-border bg-primary/20 flex items-center justify-center shrink-0">
                    <span className="font-bold text-xs">{i + 1}</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-wide">
                      {m.title}
                    </h4>
                    <p className="text-xs text-muted-foreground font-semibold">
                      {m.dueDate ? `Due ${new Date(m.dueDate).toLocaleDateString()}` : "No due date"}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                No upcoming milestones.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-secondary">
              <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
                <Settings className="w-5 h-5" /> Project Settings
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => setIsSettingsOpen(false)}
                className="border-transparent h-8 w-8 hover:bg-black/20 text-current"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  Project Title
                </label>
                <NeoInput
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  Description
                </label>
                <NeoTextarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  Total Budget ($)
                </label>
                <NeoInput
                  type="number"
                  value={editForm.budget}
                  onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                />
              </div>
            </div>

            <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-between items-center gap-3">
              <NeoButton
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => {
                  if (confirm("Are you sure you want to completely delete this project? This action cannot be undone.")) {
                    deleteProjectMutation.mutate(undefined, {
                      onSuccess: () => router.push("/client/projects")
                    });
                  }
                }}
                disabled={deleteProjectMutation.isPending}
              >
                <Trash2 className="w-4 h-4 mr-2" /> {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
              </NeoButton>
              <div className="flex gap-2">
                <NeoButton
                  variant="outline"
                  onClick={() => setIsSettingsOpen(false)}
                >
                  Cancel
                </NeoButton>
                <NeoButton
                  onClick={() => updateProjectMutation.mutate({
                    title: editForm.title,
                    description: editForm.description,
                    budget: parseFloat(editForm.budget) || 0
                  }, {
                    onSuccess: () => setIsSettingsOpen(false)
                  })}
                  disabled={updateProjectMutation.isPending}
                >
                  {updateProjectMutation.isPending ? "Saving..." : "Save Changes"}
                </NeoButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

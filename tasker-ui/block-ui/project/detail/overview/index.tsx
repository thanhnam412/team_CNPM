"use client";

import { Settings } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { OverviewStats, StatItem } from "./components/overview-stats";
import { OverviewChart } from "./components/overview-chart";
import { OverviewMilestones } from "./components/overview-milestones";
import {
  ProjectSettingsModal,
  EditFormState,
} from "./components/project-settings-modal";

export interface ProjectOverviewBlockProps {
  projectTitle: string;
  stats: StatItem[];
  isSettingsOpen: boolean;
  onOpenSettings: () => void;
  onCloseSettings: () => void;
  editForm: EditFormState;
  onEditFormChange: (form: EditFormState) => void;
  onSaveSettings: () => void;
  onDeleteProject: () => void;
  isSaving: boolean;
  isDeleting: boolean;
}

export function ProjectOverviewBlock({
  projectTitle,
  stats,
  isSettingsOpen,
  onOpenSettings,
  onCloseSettings,
  editForm,
  onEditFormChange,
  onSaveSettings,
  onDeleteProject,
  isSaving,
  isDeleting,
}: ProjectOverviewBlockProps) {
  return (
    <div className="p-6 pb-24 max-w-6xl mx-auto space-y-8">
      <OverviewStats stats={stats} />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-heading font-black uppercase tracking-widest flex items-center gap-2">
          {projectTitle}
        </h2>
        <NeoButton
          variant="outline"
          className="h-10 text-xs"
          onClick={onOpenSettings}
        >
          <Settings className="w-4 h-4 mr-2" /> Settings
        </NeoButton>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewChart />
        <OverviewMilestones />
      </div>

      <ProjectSettingsModal
        isOpen={isSettingsOpen}
        onClose={onCloseSettings}
        editForm={editForm}
        onEditFormChange={onEditFormChange}
        onSave={onSaveSettings}
        onDelete={onDeleteProject}
        isSaving={isSaving}
        isDeleting={isDeleting}
      />
    </div>
  );
}

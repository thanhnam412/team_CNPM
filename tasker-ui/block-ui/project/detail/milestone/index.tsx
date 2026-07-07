"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoConfirmModal } from "@/components/ui-custom/neo-confirm-modal";
import { MilestoneHeader } from "./components/milestone-header";
import { MilestoneCard } from "./components/milestone-card";
import { RevisionModal } from "./components/revision-modal";
import {
  CreateMilestoneModal,
  CreateMilestoneFormState,
} from "./components/create-milestone-modal";
import { MilestoneDto } from "@/types/project.dto";

export interface ProjectMilestonesBlockProps {
  milestones: MilestoneDto[];
  isLoading: boolean;
  totalBudget: string;
  totalPaid: string;
  // Revision State
  revisionMilestone: MilestoneDto | null;
  revisionFeedback: string;
  onRevisionFeedbackChange: (val: string) => void;
  onOpenRevision: (milestone: MilestoneDto) => void;
  onCloseRevision: () => void;
  onSubmitRevision: () => void;
  isSubmittingRevision: boolean;
  // Create State
  isCreatingMilestone: boolean;
  createForm: CreateMilestoneFormState;
  onCreateFormChange: (form: CreateMilestoneFormState) => void;
  onOpenCreate: () => void;
  onCloseCreate: () => void;
  onSubmitCreate: () => void;
  isSubmittingCreate: boolean;
  // Actions
  onDeleteMilestone: (id: string) => void;
  onApproveMilestone: (id: string) => void;
  isApproving: boolean;
}

export function ProjectMilestonesBlock({
  milestones,
  isLoading,
  totalBudget,
  totalPaid,
  revisionMilestone,
  revisionFeedback,
  onRevisionFeedbackChange,
  onOpenRevision,
  onCloseRevision,
  onSubmitRevision,
  isSubmittingRevision,
  isCreatingMilestone,
  createForm,
  onCreateFormChange,
  onOpenCreate,
  onCloseCreate,
  onSubmitCreate,
  isSubmittingCreate,
  onDeleteMilestone,
  onApproveMilestone,
  isApproving,
}: ProjectMilestonesBlockProps) {
  const [milestoneToDelete, setMilestoneToDelete] = useState<string | null>(null);
  const [milestoneToApprove, setMilestoneToApprove] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <MilestoneHeader totalBudget={totalBudget} totalPaid={totalPaid} />

      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <MilestoneCard
            key={m.id}
            milestone={m}
            index={idx}
            onDelete={setMilestoneToDelete}
            onApprove={setMilestoneToApprove}
            onRequestRevision={onOpenRevision}
            isApproving={isApproving}
          />
        ))}

        {isLoading && (
          <div className="text-center p-8 text-muted-foreground animate-pulse">
            Loading milestones...
          </div>
        )}
        {!isLoading && milestones.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No milestones found.
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <NeoButton
          variant="outline"
          className="border-dashed h-12 px-8 text-muted-foreground"
          onClick={onOpenCreate}
        >
          <Plus className="w-4 h-4 mr-2" /> Request New Milestone
        </NeoButton>
      </div>

      <RevisionModal
        milestone={revisionMilestone}
        feedback={revisionFeedback}
        onFeedbackChange={onRevisionFeedbackChange}
        onClose={onCloseRevision}
        onSubmit={onSubmitRevision}
        isSubmitting={isSubmittingRevision}
      />

      <CreateMilestoneModal
        isOpen={isCreatingMilestone}
        onClose={onCloseCreate}
        form={createForm}
        onFormChange={onCreateFormChange}
        onSubmit={onSubmitCreate}
        isSubmitting={isSubmittingCreate}
      />

      <NeoConfirmModal
        isOpen={!!milestoneToDelete}
        title="Delete Milestone"
        description="Are you sure you want to completely delete this milestone?"
        confirmText="Delete"
        onConfirm={() => {
          if (milestoneToDelete) onDeleteMilestone(milestoneToDelete);
          setMilestoneToDelete(null);
        }}
        onCancel={() => setMilestoneToDelete(null)}
      />

      <NeoConfirmModal
        isOpen={!!milestoneToApprove}
        title="Approve Milestone"
        description="Are you sure you want to approve this milestone and release funds to the expert?"
        confirmText="Approve & Pay"
        onConfirm={() => {
          if (milestoneToApprove) onApproveMilestone(milestoneToApprove);
          setMilestoneToApprove(null);
        }}
        onCancel={() => setMilestoneToApprove(null)}
        isLoading={isApproving}
      />
    </div>
  );
}

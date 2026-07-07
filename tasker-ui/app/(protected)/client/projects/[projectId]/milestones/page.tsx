"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useMilestones,
  useDeleteMilestoneMutation,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
  usePayMilestoneMutation,
} from "@/tanstack/useMilestones";
import { MilestoneDto } from "@/types/project.dto";
import { ProjectMilestonesBlock } from "@/block-ui/project/detail/milestone";

export default function ProjectMilestonesPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: milestones = [], isLoading } = useMilestones(projectId);

  const [revisionMilestone, setRevisionMilestone] =
    useState<MilestoneDto | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  const requestRevisionMutation = useUpdateMilestoneMutation();
  const payMilestoneMutation = usePayMilestoneMutation();
  const deleteMilestoneMutation = useDeleteMilestoneMutation();

  const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    amount: "",
    dueDate: "",
  });

  const createMilestoneMutation = useCreateMilestoneMutation();

  const handleRequestRevision = () => {
    if (revisionMilestone) {
      requestRevisionMutation.mutate(
        {
          projectId,
          milestoneId: revisionMilestone.id,
          data: { status: "ACTIVE" },
        },
        {
          onSuccess: () => {
            setRevisionMilestone(null);
            setRevisionFeedback("");
          },
        },
      );
    }
  };

  const handleCreateMilestone = () => {
    createMilestoneMutation.mutate(
      {
        projectId,
        data: {
          title: newMilestone.title,
          budget: newMilestone.amount,
          endDate: newMilestone.dueDate,
        },
      },
      {
        onSuccess: () => {
          setIsCreatingMilestone(false);
          setNewMilestone({ title: "", amount: "", dueDate: "" });
        },
      },
    );
  };

  const handleDeleteMilestone = (id: string) => {
    deleteMilestoneMutation.mutate({
      projectId,
      milestoneId: id,
    });
  };

  const handleApproveMilestone = (id: string) => {
    payMilestoneMutation.mutate({
      projectId,
      milestoneId: id,
    });
  };

  return (
    <ProjectMilestonesBlock
      milestones={milestones}
      isLoading={isLoading}
      totalBudget="$10,000" // Hardcoded in original file
      totalPaid="$2,000" // Hardcoded in original file
      revisionMilestone={revisionMilestone}
      revisionFeedback={revisionFeedback}
      onRevisionFeedbackChange={setRevisionFeedback}
      onOpenRevision={setRevisionMilestone}
      onCloseRevision={() => {
        setRevisionMilestone(null);
        setRevisionFeedback("");
      }}
      onSubmitRevision={handleRequestRevision}
      isSubmittingRevision={requestRevisionMutation.isPending}
      isCreatingMilestone={isCreatingMilestone}
      createForm={newMilestone}
      onCreateFormChange={setNewMilestone}
      onOpenCreate={() => setIsCreatingMilestone(true)}
      onCloseCreate={() => setIsCreatingMilestone(false)}
      onSubmitCreate={handleCreateMilestone}
      isSubmittingCreate={createMilestoneMutation.isPending}
      onDeleteMilestone={handleDeleteMilestone}
      onApproveMilestone={handleApproveMilestone}
      isApproving={payMilestoneMutation.isPending}
    />
  );
}

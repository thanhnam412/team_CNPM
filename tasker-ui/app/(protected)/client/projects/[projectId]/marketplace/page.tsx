"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectMarketplace } from "@/tanstack/useProjects";
import { useUpdateProposalStatusMutation, useAcceptProposalMutation } from "@/tanstack/useProposals";
import { ProjectMarketplaceBlock } from "@/block-ui/project/detail/marketplace";

export default function ProjectMarketplacePage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { data, isLoading } = useProjectMarketplace(projectId);
  const outsourcedTasks = Array.isArray(data) ? data : [];

  const updateProposalMutation = useUpdateProposalStatusMutation();
  const acceptProposalMutation = useAcceptProposalMutation();

  const handleBrowseExperts = () => {
    router.push("/client/experts");
  };

  const handlePostNewTask = () => {
    router.push("/client/quick-tasks/create");
  };

  const handleViewTask = (taskId: string) => {
    router.push(`/client/projects/${projectId}/milestones`);
  };

  const handleReviewWork = (taskId: string) => {
    // Note: Assuming milestones review happens in board or milestone tab
    router.push(`/client/projects/${projectId}/board`);
  };

  const handleMessageExpert = (proposalId: string) => {
    router.push("/client/messages");
  };

  const handleAcceptBid = (proposalId: string) => {
    acceptProposalMutation.mutate({ proposalId });
  };

  const handleRejectBid = (proposalId: string) => {
    updateProposalMutation.mutate({ proposalId, status: "REJECTED" });
  };

  const handleViewProfile = (expertId: string) => {
    router.push(`/client/experts/${expertId}`);
  };

  return (
    <ProjectMarketplaceBlock
      outsourcedTasks={outsourcedTasks}
      isLoading={isLoading}
      onBrowseExperts={handleBrowseExperts}
      onPostNewTask={handlePostNewTask}
      onViewTask={handleViewTask}
      onReviewWork={handleReviewWork}
      onMessageExpert={handleMessageExpert}
      onAcceptBid={handleAcceptBid}
      onRejectBid={handleRejectBid}
      onViewProfile={handleViewProfile}
      isAccepting={acceptProposalMutation.isPending}
    />
  );
}

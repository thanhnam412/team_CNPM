"use client";

import { Store } from "lucide-react";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { OutsourcedTaskCard } from "./components/outsourced-task-card";

export interface ProjectMarketplaceBlockProps {
  outsourcedTasks: any[];
  isLoading: boolean;
  onBrowseExperts: () => void;
  onPostNewTask: () => void;
  onViewTask: (taskId: string) => void;
  onReviewWork: (taskId: string) => void;
  onMessageExpert: (proposalId: string) => void;
  onAcceptBid: (proposalId: string) => void;
  onViewProfile?: (expertId: string) => void;
  isAccepting?: boolean;
}

export function ProjectMarketplaceBlock({
  outsourcedTasks,
  isLoading,
  onBrowseExperts,
  onPostNewTask,
  onViewTask,
  onReviewWork,
  onMessageExpert,
  onAcceptBid,
  onViewProfile,
  isAccepting,
}: ProjectMarketplaceBlockProps) {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <NeoPageHeader
        variant="transparent"
        className="mb-2"
        containerClassName="!px-0 !pt-0 !pb-6"
        headingTag="h2"
        title="Marketplace Hub"
        icon={<Store className="w-8 h-8 text-primary" />}
        description="Manage outsourced tasks, review proposals, and hire experts"
        rightContent={
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <NeoButton
              variant="outline"
              className="w-full sm:w-auto h-12 px-6"
              onClick={onBrowseExperts}
            >
              Browse Experts
            </NeoButton>
            <NeoButton
              className="w-full sm:w-auto h-12 px-6"
              onClick={onPostNewTask}
            >
              Post New Task
            </NeoButton>
          </div>
        }
      />

      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center p-8 text-muted-foreground uppercase text-xs font-bold animate-pulse">
            Loading marketplace tasks...
          </div>
        ) : outsourcedTasks.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground uppercase text-xs font-bold">
            No outsourced tasks yet. Post a new task!
          </div>
        ) : (
          outsourcedTasks.map((task: any) => (
            <OutsourcedTaskCard
              key={task.id}
              task={task}
              onViewTask={onViewTask}
              onReviewWork={onReviewWork}
              onMessageExpert={onMessageExpert}
              onAcceptBid={onAcceptBid}
              onViewProfile={onViewProfile}
              isAccepting={isAccepting}
            />
          ))
        )}
      </div>
    </div>
  );
}

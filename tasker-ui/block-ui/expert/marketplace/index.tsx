"use client";

import { MarketplaceHeader } from "./components/marketplace-header";
import { ExpertGrid } from "./components/expert-grid";
import { InviteModal } from "@/block-ui/expert/profile/components/invite-modal";
import { formatCurrency } from "@/lib/utils";

export interface ExpertMarketplaceBlockProps {
  experts: any[];
  savedExperts: Record<string, boolean>;
  onToggleSave: (id: string) => void;
  selectedExpert: any | null;
  isInviteOpen: boolean;
  inviteContext: string;
  inviteMessage: string;
  isInvitePending: boolean;
  projects: any[];
  quickTasks: any[];
  onOpenInvite: (expert: any) => void;
  onCloseInvite: () => void;
  onContextChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onSendInvite: () => void;
}

export function ExpertMarketplaceBlock({
  experts,
  savedExperts,
  onToggleSave,
  selectedExpert,
  isInviteOpen,
  inviteContext,
  inviteMessage,
  isInvitePending,
  projects,
  quickTasks,
  onOpenInvite,
  onCloseInvite,
  onContextChange,
  onMessageChange,
  onSendInvite,
}: ExpertMarketplaceBlockProps) {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <MarketplaceHeader />
      
      <ExpertGrid
        experts={experts}
        savedExperts={savedExperts}
        onToggleSave={onToggleSave}
        onInvite={onOpenInvite}
      />

      <InviteModal
        expert={selectedExpert}
        formattedRate={selectedExpert?.rate ? `${formatCurrency(selectedExpert.rate)}/hr` : "TBD"}
        isInviteOpen={isInviteOpen}
        inviteContext={inviteContext}
        inviteMessage={inviteMessage}
        quickTasks={quickTasks}
        projects={projects}
        isPending={isInvitePending}
        onContextChange={onContextChange}
        onMessageChange={onMessageChange}
        onClose={onCloseInvite}
        onSendInvite={onSendInvite}
      />
    </div>
  );
}

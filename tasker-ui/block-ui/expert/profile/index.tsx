"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { formatCurrency } from "@/lib/utils";

import { IdentitySidebar } from "./components/identity-sidebar";
import { DeepDiveContent } from "./components/deep-dive-content";
import { InviteModal } from "./components/invite-modal";

export interface ExpertProfileBlockProps {
  expert: any;
  projects: any[];
  quickTasks: any[];
  isSaved: boolean;
  isInviteOpen: boolean;
  inviteContext: string;
  inviteMessage: string;
  isInvitePending: boolean;
  onToggleSave: () => void;
  onOpenInvite: () => void;
  onContextChange: (val: string) => void;
  onMessageChange: (val: string) => void;
  onCloseInvite: () => void;
  onSendInvite: () => void;
}

export function ExpertProfileBlock({
  expert,
  projects,
  quickTasks,
  isSaved,
  isInviteOpen,
  inviteContext,
  inviteMessage,
  isInvitePending,
  onToggleSave,
  onOpenInvite,
  onContextChange,
  onMessageChange,
  onCloseInvite,
  onSendInvite,
}: ExpertProfileBlockProps) {
  // Safe parsing for presentation
  const parseSkills = (skillsData: any) => {
    let parsed = skillsData;
    if (typeof skillsData === "string") {
      try {
        parsed = JSON.parse(skillsData);
      } catch (e) {
        return { core: [], secondary: [] };
      }
    }
    if (Array.isArray(parsed)) {
      return { core: parsed, secondary: [] };
    }
    return { core: parsed?.core || [], secondary: parsed?.secondary || [] };
  };

  const parseShowcase = (showcaseData: any) => {
    let parsed = showcaseData;
    if (typeof showcaseData === "string") {
      try {
        parsed = JSON.parse(showcaseData);
      } catch (e) {
        return [];
      }
    }
    return Array.isArray(parsed) ? parsed : [];
  };

  const parsedSkills = parseSkills(expert.skills);
  const parsedShowcase = parseShowcase(expert.showcase);
  const formattedRate = expert.rate ? `${formatCurrency(expert.rate)}/hr` : "TBD";

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Top Nav Bar */}
      <div className="p-4 border-b-2 border-border bg-card sticky top-0 z-30 flex items-center justify-between">
        <Link href="/client/experts">
          <NeoButton
            variant="ghost"
            className="border-transparent text-[0.625rem]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </NeoButton>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 w-full max-w-7xl mx-auto">
        <IdentitySidebar
          expert={expert}
          formattedRate={formattedRate}
          isSaved={isSaved}
          onToggleSave={onToggleSave}
          onOpenInvite={onOpenInvite}
        />
        
        <DeepDiveContent
          expert={expert}
          parsedSkills={parsedSkills}
          parsedShowcase={parsedShowcase}
          reviews={expert.reviews || []}
          workHistory={expert.workHistory || []}
        />
      </div>

      <InviteModal
        expert={expert}
        formattedRate={formattedRate}
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

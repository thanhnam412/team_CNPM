"use client";

import { useState } from "react";
import { TeamHeader } from "./components/team-header";
import { TeamMemberCard } from "./components/team-member-card";
import { InviteSlot } from "./components/invite-slot";
import { NeoConfirmModal } from "@/components/ui-custom/neo-confirm-modal";

export interface ProjectTeamBlockProps {
  team: any[];
  isLoading: boolean;
  onUpdateRole: (memberId: string, role: string) => void;
  isUpdatingRole: boolean;
  onRemoveMember: (memberId: string) => void;
  isRemoving: boolean;
  onMessageAll: () => void;
  onInviteMember: () => void;
}

export function ProjectTeamBlock({
  team,
  isLoading,
  onUpdateRole,
  isUpdatingRole,
  onRemoveMember,
  isRemoving,
  onMessageAll,
  onInviteMember,
}: ProjectTeamBlockProps) {
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <TeamHeader
        onMessageAll={onMessageAll}
        onInviteMember={onInviteMember}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full text-center p-8 text-muted-foreground animate-pulse">
            Loading team...
          </div>
        )}

        {!isLoading &&
          team.map((member) => (
            <TeamMemberCard
              key={member.id}
              member={member}
              onUpdateRole={onUpdateRole}
              isUpdatingRole={isUpdatingRole}
              onRemoveMember={setMemberToRemove}
              isRemoving={isRemoving}
            />
          ))}

        {!isLoading && <InviteSlot onClick={onInviteMember} />}
      </div>

      <NeoConfirmModal
        isOpen={!!memberToRemove}
        title="Remove Member"
        description="Are you sure you want to remove this member from the project?"
        confirmText="Remove"
        onConfirm={() => {
          if (memberToRemove) onRemoveMember(memberToRemove);
          setMemberToRemove(null);
        }}
        onCancel={() => setMemberToRemove(null)}
        isLoading={isRemoving}
      />
    </div>
  );
}

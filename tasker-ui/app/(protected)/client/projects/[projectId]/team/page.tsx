"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useTeamMembers,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from "@/tanstack/useTeam";
import { useExperts } from "@/tanstack/useExperts";
import { useGetMe } from "@/tanstack/useGetMe";
import { useProjects } from "@/tanstack/useProjects";
import { useClientQuickTasks } from "@/tanstack/useQuickTasks";
import { useCreateInvitationMutation } from "@/tanstack/useInvitations";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";
import { ProjectTeamBlock } from "@/block-ui/project/detail/team";
import {
  NeoDrawer,
  NeoDrawerContent,
  NeoDrawerHeader,
  NeoDrawerTitle,
} from "@/components/ui-custom/neo-drawer";
import { ExpertCard } from "@/block-ui/expert/marketplace/components/expert-card";
import { InviteModal } from "@/block-ui/expert/profile/components/invite-modal";

export default function ProjectTeamPage() {
  const { projectId } = useParams() as { projectId: string };

  const { data: team = [], isLoading } = useTeamMembers(projectId);
  const updateRoleMutation = useUpdateMemberRoleMutation(projectId);
  const removeMemberMutation = useRemoveMemberMutation(projectId);
  
  const { data: experts = [] } = useExperts();
  const { data: me } = useGetMe();
  const { data: projects } = useProjects();
  const { data: quickTasks } = useClientQuickTasks(me?.id || "");
  const createInvite = useCreateInvitationMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteContext, setInviteContext] = useState(`proj_${projectId}`);
  const [inviteMessage, setInviteMessage] = useState("");
  const [savedExperts, setSavedExperts] = useState<Record<string, boolean>>({});

  const handleUpdateRole = (memberId: string, role: string) => {
    updateRoleMutation.mutate({ memberId, role });
  };

  const handleRemoveMember = (memberId: string) => {
    removeMemberMutation.mutate(memberId);
  };

  const handleMessageAll = () => {
    console.log("Message All clicked - to be implemented");
  };

  const handleInviteMember = () => {
    setIsDrawerOpen(true);
  };
  
  const handleOpenInviteModal = (expert: any) => {
    setSelectedExpert(expert);
    setInviteContext(`proj_${projectId}`);
    setInviteMessage(
      `Hi ${expert.name},\n\nI reviewed your profile and I'd like to invite you to collaborate with us on this project. Let me know if you are available.`
    );
    setIsInviteOpen(true);
  };

  const handleSendInvite = () => {
    if (!me?.id || !selectedExpert?.id) return;

    let pId = undefined;
    let qtId = undefined;

    if (inviteContext.startsWith("proj_")) {
      pId = inviteContext.replace("proj_", "");
    } else if (inviteContext.startsWith("qt_")) {
      qtId = inviteContext.replace("qt_", "");
    }

    createInvite.mutate(
      {
        clientId: me.id,
        expertId: selectedExpert.id,
        projectId: pId,
        quickTaskId: qtId,
        message: inviteMessage,
      },
      {
        onSuccess: () => {
          setIsInviteOpen(false);
          toast.success("Invitation sent successfully!");
        },
        onError: (err: any) => {
          toast.error(
            "Failed to send invitation: " +
              (err.response?.data?.message || err.message)
          );
        },
      }
    );
  };

  return (
    <>
      <ProjectTeamBlock
        team={team}
        isLoading={isLoading}
        onUpdateRole={handleUpdateRole}
        isUpdatingRole={updateRoleMutation.isPending}
        onRemoveMember={handleRemoveMember}
        isRemoving={removeMemberMutation.isPending}
        onMessageAll={handleMessageAll}
        onInviteMember={handleInviteMember}
      />

      <NeoDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <NeoDrawerContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-background p-0 border-l-4 border-foreground">
          <NeoDrawerHeader className="p-6 border-b-4 border-foreground bg-secondary/30 sticky top-0 z-10">
            <NeoDrawerTitle className="font-heading font-black text-2xl uppercase tracking-widest">
              Invite Experts
            </NeoDrawerTitle>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-2">
              Browse the marketplace and invite experts directly to this project.
            </p>
          </NeoDrawerHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6">
              {experts.map((expert: any) => (
                <ExpertCard
                  key={expert.id}
                  expert={expert}
                  isSaved={!!savedExperts[expert.id]}
                  onToggleSave={(id) => setSavedExperts((prev) => ({ ...prev, [id]: !prev[id] }))}
                  onInvite={handleOpenInviteModal}
                />
              ))}
            </div>
          </div>
        </NeoDrawerContent>
      </NeoDrawer>

      <InviteModal
        expert={selectedExpert}
        formattedRate={selectedExpert?.rate ? `${formatCurrency(selectedExpert.rate)}/hr` : "TBD"}
        isInviteOpen={isInviteOpen}
        inviteContext={inviteContext}
        inviteMessage={inviteMessage}
        quickTasks={quickTasks || []}
        projects={projects || []}
        isPending={createInvite.isPending}
        onContextChange={setInviteContext}
        onMessageChange={setInviteMessage}
        onClose={() => setIsInviteOpen(false)}
        onSendInvite={handleSendInvite}
      />
    </>
  );
}

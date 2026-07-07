"use client";

import { useState } from "react";
import { useExperts } from "@/tanstack/useExperts";
import { useGetMe } from "@/tanstack/useGetMe";
import { useProjects } from "@/tanstack/useProjects";
import { useClientQuickTasks } from "@/tanstack/useQuickTasks";
import { useCreateInvitationMutation } from "@/tanstack/useInvitations";
import { toast } from "sonner";
import { ExpertMarketplaceBlock } from "@/block-ui/expert/marketplace";

export default function ExpertMarketplacePage() {
  const { data: experts = [], isLoading } = useExperts();
  const { data: me } = useGetMe();
  const { data: projects } = useProjects();
  const { data: quickTasks } = useClientQuickTasks(me?.id || "");
  const createInvite = useCreateInvitationMutation();

  const [savedExperts, setSavedExperts] = useState<Record<string, boolean>>({});

  // Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<any | null>(null);
  const [inviteContext, setInviteContext] = useState("none");
  const [inviteMessage, setInviteMessage] = useState("");

  const openInviteModal = (expert: any) => {
    setSelectedExpert(expert);
    setInviteMessage(
      `Hi ${expert.name},\n\nI reviewed your profile and I'd like to invite you to collaborate with us. Let me know if you are available.`
    );
    setInviteContext("none");
    setIsInviteOpen(true);
  };

  const closeInviteModal = () => {
    setIsInviteOpen(false);
  };

  const toggleSave = (id: string) => {
    setSavedExperts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSendInvite = () => {
    if (!me?.id || !selectedExpert?.id) return;

    let projectId = undefined;
    let quickTaskId = undefined;

    if (inviteContext.startsWith("proj_")) {
      projectId = inviteContext.replace("proj_", "");
    } else if (inviteContext.startsWith("qt_")) {
      quickTaskId = inviteContext.replace("qt_", "");
    }

    createInvite.mutate(
      {
        clientId: me.id,
        expertId: selectedExpert.id,
        projectId,
        quickTaskId,
        message: inviteMessage,
      },
      {
        onSuccess: () => {
          setIsInviteOpen(false);
          toast.success(
            "Invitation sent successfully! The expert will see it in their Inbox."
          );
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

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <h2 className="font-heading font-black text-2xl uppercase animate-pulse">
          Loading Marketplace...
        </h2>
      </div>
    );
  }

  return (
    <ExpertMarketplaceBlock
      experts={experts}
      savedExperts={savedExperts}
      onToggleSave={toggleSave}
      selectedExpert={selectedExpert}
      isInviteOpen={isInviteOpen}
      inviteContext={inviteContext}
      inviteMessage={inviteMessage}
      isInvitePending={createInvite.isPending}
      projects={projects || []}
      quickTasks={quickTasks || []}
      onOpenInvite={openInviteModal}
      onCloseInvite={closeInviteModal}
      onContextChange={setInviteContext}
      onMessageChange={setInviteMessage}
      onSendInvite={handleSendInvite}
    />
  );
}

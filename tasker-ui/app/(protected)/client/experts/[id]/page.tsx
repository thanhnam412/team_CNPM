"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useExpert } from "@/tanstack/useExperts";
import { useGetMe } from "@/tanstack/useGetMe";
import { useProjects } from "@/tanstack/useProjects";
import { toast } from "sonner";
import { useClientQuickTasks } from "@/tanstack/useQuickTasks";
import { useCreateInvitationMutation } from "@/tanstack/useInvitations";

import { NeoButton } from "@/components/ui-custom/neo-button";
import { ExpertProfileBlock } from "@/block-ui/expert/profile";

export default function ExpertProfilePage() {
  const params = useParams();
  const expertId = params.id as string;

  const { data: expert, isLoading } = useExpert(expertId);
  const { data: me } = useGetMe();
  const { data: projects } = useProjects();
  const { data: quickTasks } = useClientQuickTasks(me?.id || "");
  const createInvite = useCreateInvitationMutation();

  const [isSaved, setIsSaved] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteContext, setInviteContext] = useState("none");
  const [inviteMessage, setInviteMessage] = useState("");

  const handleOpenInvite = () => {
    if (!inviteMessage && expert) {
      setInviteMessage(
        `Hi ${expert.name},\n\nI reviewed your profile and I'd like to invite you to collaborate with us. Let me know if you are available.`,
      );
    }
    setInviteContext("none");
    setIsInviteOpen(true);
  };

  const handleSendInvite = () => {
    if (!me?.id || !expert?.id) return;

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
        expertId: expert.id,
        projectId,
        quickTaskId,
        message: inviteMessage,
      },
      {
        onSuccess: () => {
          setIsInviteOpen(false);
          toast.success(
            "Invitation sent successfully! The expert will see it in their Inbox.",
          );
        },
        onError: (err: any) => {
          toast.error(
            "Failed to send invitation: " +
              (err.response?.data?.message || err.message),
          );
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <h2 className="font-heading font-black text-2xl uppercase animate-pulse">
          Loading Profile...
        </h2>
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-background gap-4">
        <h2 className="font-heading font-black text-2xl uppercase">
          Expert not found
        </h2>
        <Link href="/client/experts">
          <NeoButton variant="outline">Back to Marketplace</NeoButton>
        </Link>
      </div>
    );
  }

  return (
    <ExpertProfileBlock
      expert={expert}
      projects={projects || []}
      quickTasks={quickTasks || []}
      isSaved={isSaved}
      isInviteOpen={isInviteOpen}
      inviteContext={inviteContext}
      inviteMessage={inviteMessage}
      isInvitePending={createInvite.isPending}
      onToggleSave={() => setIsSaved(!isSaved)}
      onOpenInvite={handleOpenInvite}
      onContextChange={setInviteContext}
      onMessageChange={setInviteMessage}
      onCloseInvite={() => setIsInviteOpen(false)}
      onSendInvite={handleSendInvite}
    />
  );
}

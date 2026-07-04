"use client";

import { useState } from "react";
import {
  Mailbox,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  DollarSign
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { formatCurrency } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useExpertInvitations, useUpdateInvitationStatusMutation } from "@/tanstack/useInvitations";

export default function InvitationsPage() {
  const { data: session } = useSession();
  const expertId = session?.user?.id;

  const { data: invitations = [], isLoading } = useExpertInvitations(expertId);
  const updateStatusMutation = useUpdateInvitationStatusMutation();

  const handleAction = (id: string, action: "accept" | "decline") => {
    if (confirm(`Are you sure you want to ${action} this invitation?`)) {
      updateStatusMutation.mutate({ 
        id, 
        status: action === "accept" ? "ACCEPTED" : "REJECTED" 
      }, {
        onSuccess: () => {
          if (action === "accept") {
            alert("Invitation accepted! You have been added to the project.");
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      <NeoPageHeader
        title="My Invitations"
        description="Review and respond to exclusive milestone invitations from clients."
        icon={<Mailbox className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
      />

      <div className="flex-1 overflow-y-auto bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6 pb-24">
          {isLoading ? (
            <div className="text-center p-12 text-muted-foreground">Loading...</div>
          ) : invitations.length === 0 ? (
            <div className="text-center p-12 border-4 border-dashed border-border bg-secondary/10">
              <Mailbox className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-heading font-black text-xl uppercase mb-2">No pending invitations</h3>
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Keep your profile updated to attract more clients.
              </p>
            </div>
          ) : (
            invitations.map((inv) => (
              <NeoCard key={inv.id} className="flex flex-col md:flex-row gap-6 p-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 border-primary bg-primary/10 text-primary">
                      New Invitation
                    </span>
                    <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1 mb-1">
                      <Briefcase className="w-3 h-3" /> {inv.clientName} • {inv.projectTitle}
                    </div>
                    <h3 className="font-heading font-black text-xl uppercase">
                      {inv.milestoneTitle || inv.message?.substring(0, 50) || "Direct Invitation"}
                    </h3>
                  </div>

                  <div className="bg-secondary/10 border-2 border-border p-4 text-sm font-medium italic">
                    "{inv.message}"
                  </div>
                </div>

                <div className="md:w-64 shrink-0 flex flex-col justify-between border-t-2 md:border-t-0 md:border-l-2 border-border pt-4 md:pt-0 md:pl-6">
                  <div className="mb-6">
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1 flex items-center gap-1">
                      <DollarSign className="w-3 h-3" /> Offer Price
                    </div>
                    <div className="font-heading font-black text-3xl text-primary">
                      {formatCurrency(inv.offerPrice)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <NeoButton 
                      className="w-full"
                      disabled={updateStatusMutation.isPending || inv.status !== "PENDING"}
                      onClick={() => handleAction(inv.id, "accept")}
                    >
                      {inv.status === "ACCEPTED" ? "Accepted" : "Accept Invite"} <CheckCircle2 className="w-4 h-4 ml-2" />
                    </NeoButton>
                    <NeoButton 
                      variant="outline" 
                      className="w-full border-destructive text-destructive hover:bg-destructive/10"
                      disabled={updateStatusMutation.isPending || inv.status !== "PENDING"}
                      onClick={() => handleAction(inv.id, "decline")}
                    >
                      {inv.status === "REJECTED" ? "Declined" : "Decline"} <XCircle className="w-4 h-4 ml-2" />
                    </NeoButton>
                  </div>
                </div>
              </NeoCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

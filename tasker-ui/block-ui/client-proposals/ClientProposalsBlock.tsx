"use client";

import { useGetMe } from "@/tanstack/useGetMe";
import { useClientProposals, useAcceptProposalMutation, useUpdateProposalStatusMutation } from "@/tanstack/useProposals";
import { Loader2, Briefcase, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoBadge as Badge } from "@/components/ui-custom/neo-badge";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";

export const ClientProposalsBlock = () => {
  const { data: me } = useGetMe();
  const { data: proposals, isLoading, isError } = useClientProposals(me?.id as string);
  const acceptMutation = useAcceptProposalMutation();
  const updateStatusMutation = useUpdateProposalStatusMutation();



  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" /> Pending
          </Badge>
        );
      case "ACCEPTED":
        return (
          <Badge variant="success">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Accepted
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" /> Rejected
          </Badge>
        );
      case "WITHDRAWN":
        return <Badge variant="secondary">Withdrawn</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <NeoPageHeader
        className="z-20 relative"
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        title="Received Proposals"
        icon={<Briefcase className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        description="Review proposals sent by experts for your active projects and quick tasks."
      />

      <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6 pb-24">
          <div className="grid gap-6">
            {isLoading ? (
              <div className="flex h-[50vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : isError || !proposals ? (
              <div className="flex h-[50vh] items-center justify-center text-destructive font-bold">
                Failed to load proposals.
              </div>
            ) : proposals.length === 0 ? (
              <NeoCard className="p-12 text-center text-muted-foreground font-bold uppercase tracking-widest border-dashed">
                You haven't received any proposals yet.
              </NeoCard>
            ) : (
              proposals.map((proposal: any) => (
                <NeoCard
                  key={proposal.id}
                  className="p-6 transition-transform hover:-translate-y-1"
                >
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">
                              {proposal.quickTaskId ? "Quick Task" : "Milestone"}
                            </Badge>
                            <span className="text-xs text-muted-foreground font-bold tracking-widest uppercase">
                              {new Date(proposal.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold uppercase">
                            {proposal.quickTaskTitle ||
                              proposal.milestoneTitle ||
                              "Unknown Task"}
                          </h3>
                          {proposal.projectTitle && (
                            <div className="text-sm text-muted-foreground mt-1">
                              Project: {proposal.projectTitle}
                            </div>
                          )}
                        </div>
                        <div className="hidden md:block">
                          {getStatusBadge(proposal.status)}
                        </div>
                      </div>

                      <div className="text-sm bg-secondary/20 p-4 border-l-4 border-primary">
                        <p className="line-clamp-3 italic text-muted-foreground">
                          "{proposal.coverLetter}"
                        </p>
                      </div>
                      <div className="text-sm font-bold mt-2">
                        Expert: {proposal.expertId.substring(0, 8)}...
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-end md:items-end justify-between md:justify-start gap-4 min-w-[200px] border-t-2 md:border-t-0 md:border-l-2 border-border pt-4 md:pt-0 md:pl-6">
                      <div className="text-left md:text-right w-full">
                        <div className="text-[0.625rem] text-muted-foreground uppercase font-bold tracking-widest">
                          Proposed Price
                        </div>
                        <div className="text-2xl font-black text-primary">
                          {formatCurrency(Number(proposal.proposedPrice))}
                        </div>
                      </div>
                      <div className="text-right w-full">
                        <div className="text-[0.625rem] text-muted-foreground uppercase font-bold tracking-widest">
                          Estimated Time
                        </div>
                        <div className="text-lg font-bold">
                          {proposal.estimatedDays} Days
                        </div>
                      </div>
                      <div className="md:hidden mt-2">
                        {getStatusBadge(proposal.status)}
                      </div>

                      {proposal.status === "PENDING" && (
                        <div className="w-full mt-auto pt-4 flex flex-col gap-2">
                          <NeoButton
                            className="w-full h-8 text-[0.625rem]"
                            disabled={acceptMutation.isPending}
                            onClick={() => {
                              toast("Accept this proposal?", {
                                action: {
                                  label: "Confirm & Hire",
                                  onClick: () => acceptMutation.mutate({ proposalId: proposal.id }),
                                },
                              });
                            }}
                          >
                            Accept & Hire
                          </NeoButton>
                          <NeoButton
                            variant="outline"
                            className="w-full h-8 text-[0.625rem] border-destructive text-destructive"
                            disabled={updateStatusMutation.isPending}
                            onClick={() => {
                              toast("Reject this proposal?", {
                                action: {
                                  label: "Yes, Reject",
                                  onClick: () => updateStatusMutation.mutate({ proposalId: proposal.id, status: "REJECTED" }),
                                },
                              });
                            }}
                          >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Reject
                          </NeoButton>
                        </div>
                      )}
                    </div>
                  </div>
                </NeoCard>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

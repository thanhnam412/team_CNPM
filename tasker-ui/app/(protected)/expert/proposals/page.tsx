"use client";

import { useGetMe } from "@/tanstack/useGetMe";
import { useExpertProposals } from "@/tanstack/useExpertProposals";
import {
  Loader2,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Clock,
  Briefcase,
  AlertTriangle,
} from "lucide-react";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoBadge as Badge } from "@/components/ui-custom/neo-badge";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { useUpdateProposalStatusMutation } from "@/tanstack/useProposals";
import { toast } from "sonner";

export default function ExpertProposalsPage() {
  const { data: me } = useGetMe();
  const { data: proposals, isLoading, isError } = useExpertProposals(me?.id);
  const updateStatusMutation = useUpdateProposalStatusMutation();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !proposals) {
    return (
      <div className="flex h-[50vh] items-center justify-center text-destructive">
        Failed to load proposals.
      </div>
    );
  }

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
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background relative overflow-hidden">
      <NeoPageHeader
        className="z-20 relative"
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        title="Sent Proposals"
        icon={<Briefcase className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        description="Track the status of your bids and applications. Manage your active proposals or cancel pending ones."
      />

      <div className="flex-1 overflow-y-auto p-6 bg-secondary/5">
        <div className="max-w-7xl mx-auto space-y-6 pb-24">

      <div className="grid gap-6">
        {proposals.length === 0 ? (
          <NeoCard className="p-12 text-center text-muted-foreground font-bold uppercase tracking-widest border-dashed">
            You haven't sent any proposals yet. Start finding work!
          </NeoCard>
        ) : (
          proposals.map((proposal) => (
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
                    <div className="w-full mt-auto pt-4">
                      <NeoButton 
                        variant="destructive"
                        className="w-full"
                        disabled={updateStatusMutation.isPending}
                        onClick={() => {
                          toast("Are you sure you want to cancel this proposal?", {
                            action: {
                              label: "Yes, Cancel",
                              onClick: () => updateStatusMutation.mutate({ proposalId: proposal.id, status: "WITHDRAWN" }),
                            },
                            cancel: {
                              label: "Keep it",
                              onClick: () => {},
                            },
                          });
                        }}
                      >
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Cancel Proposal
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
}

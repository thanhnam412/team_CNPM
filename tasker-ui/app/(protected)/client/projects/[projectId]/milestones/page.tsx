"use client";

import { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Clock,
  Upload,
  Download,
  FileText,
  AlertTriangle,
  ArrowRight,
  X,
  MessageSquareX,
  Trash2,
  Users
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import { NeoInput } from "@/components/ui-custom/neo-input";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoProgress } from "@/components/ui-custom/neo-progress";
import {
  NeoDrawer,
  NeoDrawerContent,
  NeoDrawerHeader,
  NeoDrawerTitle,
} from "@/components/ui-custom/neo-drawer";
import { NeoAvatar } from "@/components/ui-custom/neo-avatar";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";
import {
  useMilestones,
  useRequestRevisionMutation,
  useApproveMilestoneMutation,
  useDeleteMilestoneMutation,
  useCreateMilestoneMutation,
  useAcceptBidMutation,
} from "@/tanstack/useMilestones";

interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: "pending" | "active" | "review" | "paid";
  dueDate: string;
  progress?: number;
  deliverables: { name: string; url: string; date?: string }[];
  feedback?: { date: string; text: string; by: "client" | "expert" }[];
  bids?: { id: string; expertName: string; amount: string; coverLetter: string; avatar: string }[];
}

export default function ProjectMilestonesPage() {
  const { projectId } = useParams() as { projectId: string };
  const { data: milestones = [], isLoading } = useMilestones(projectId);

  const [revisionMilestone, setRevisionMilestone] = useState<Milestone | null>(null);
  const [revisionFeedback, setRevisionFeedback] = useState("");

  const requestRevisionMutation = useRequestRevisionMutation(projectId);
  const approveMilestoneMutation = useApproveMilestoneMutation(projectId);
  const deleteMilestoneMutation = useDeleteMilestoneMutation(projectId);

  const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState({ title: "", amount: "", dueDate: "" });

  const createMilestoneMutation = useCreateMilestoneMutation(projectId);
  
  const [viewingBidsMilestone, setViewingBidsMilestone] = useState<Milestone | null>(null);

  const acceptBidMutation = useAcceptBidMutation(projectId);

  const handleAcceptBid = (bidId: string) => {
    if (confirm("Are you sure you want to accept this bid? This will lock the funds in escrow.")) {
      acceptBidMutation.mutate(bidId, {
        onSuccess: () => {
          alert("Bid accepted! The expert has been added to the project members and the milestone is now active.");
          setViewingBidsMilestone(null);
        }
      });
    }
  };

  const handleRequestRevision = () => {
    if (revisionMilestone) {
      requestRevisionMutation.mutate({ id: revisionMilestone.id, feedback: revisionFeedback }, {
        onSuccess: () => {
          setRevisionMilestone(null);
          setRevisionFeedback("");
        }
      });
    }
  };

  const handleCreateMilestone = () => {
    createMilestoneMutation.mutate(newMilestone, {
      onSuccess: () => {
        setIsCreatingMilestone(false);
        setNewMilestone({ title: "", amount: "", dueDate: "" });
      }
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-border pb-6">
        <div>
          <h2 className="text-2xl font-heading font-black uppercase tracking-widest">
            Milestones & Payments
          </h2>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            Manage project phases and deliverables
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Total Budget
            </div>
            <div className="font-heading font-black text-xl text-primary">
              $10,000
            </div>
          </div>
          <div className="w-px bg-border h-10" />
          <div className="text-right">
            <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Paid
            </div>
            <div className="font-heading font-black text-xl text-green-600">
              $2,000
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className={cn(
              "bg-card border-4 shadow-[6px_6px_0px_0px_var(--foreground)] p-6 transition-all",
              m.status === "review"
                ? "border-purple-500 shadow-[6px_6px_0px_0px_var(--purple)]"
                : m.status === "active"
                  ? "border-blue-500 shadow-[6px_6px_0px_0px_var(--blue)]"
                  : m.status === "paid"
                    ? "border-foreground bg-secondary/10 opacity-75"
                    : "border-border",
            )}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading font-black text-lg uppercase tracking-wide">
                    {idx + 1}. {m.title}
                  </span>
                  {m.status === "paid" && (
                    <NeoBadge variant="success">
                      Paid
                    </NeoBadge>
                  )}
                  {m.status === "review" && (
                    <NeoBadge variant="nightmare" className="animate-pulse">
                      Needs Review
                    </NeoBadge>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {m.dueDate}
                  </span>
                  <span className="w-1 h-1 bg-border rounded-full" />
                  <span className="text-foreground font-black">{m.amount}</span>
                  {(m.status === "pending" || m.status === "active") && (
                    <>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <button 
                        onClick={() => {
                          if (confirm("Delete this milestone?")) {
                            deleteMilestoneMutation.mutate(m.id);
                          }
                        }}
                        className="text-muted-foreground hover:text-destructive flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>
                    </>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-secondary/10 border-2 border-border p-3 max-w-sm">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">Task Progress</span>
                    <span className="text-[0.625rem] font-black uppercase tracking-widest">{m.progress || 0}%</span>
                  </div>
                  <NeoProgress value={m.progress || 0} />
                </div>
              </div>

              {/* Action Area */}
              <div className="md:w-64 shrink-0 flex flex-col items-end gap-3 justify-center border-t-2 md:border-t-0 md:border-l-2 border-border pt-4 md:pt-0 md:pl-6">
                {m.status === "review" && (
                  <>
                    <NeoButton 
                      className="w-full h-12"
                      onClick={() => {
                        if (confirm("Are you sure you want to approve this milestone and release funds?")) {
                          approveMilestoneMutation.mutate(m.id);
                        }
                      }}
                      disabled={approveMilestoneMutation.isPending}
                    >
                      {approveMilestoneMutation.isPending ? "Approving..." : "Approve & Pay"} <CheckCircle2 className="w-4 h-4 ml-2" />
                    </NeoButton>
                    <NeoButton 
                      variant="outline" 
                      className="w-full h-10 border-destructive text-destructive hover:bg-destructive/10"
                      onClick={() => setRevisionMilestone(m)}
                    >
                      Request Revision
                    </NeoButton>
                  </>
                )}
                {m.status === "active" && (
                  <NeoButton
                    variant="outline"
                    className="w-full h-12 cursor-not-allowed opacity-50"
                  >
                    Awaiting Delivery
                  </NeoButton>
                )}
                {m.status === "paid" && (
                  <NeoButton
                    variant="ghost"
                    className="w-full h-10 border-transparent text-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Settled
                  </NeoButton>
                )}
                {(m.status === "pending" || m.status === "active") && m.bids && m.bids.length > 0 && (
                  <NeoButton
                    className="w-full h-12"
                    onClick={() => setViewingBidsMilestone(m)}
                  >
                    View Bids ({m.bids.length}) <Users className="w-4 h-4 ml-2" />
                  </NeoButton>
                )}
              </div>
            </div>

            {/* Deliverables Section */}
            {(m.deliverables.length > 0 || m.status === "active" || m.status === "review") && (
              <div className="mt-6 pt-6 border-t-2 border-border border-dashed">
                <h4 className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Deliverables
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {m.deliverables.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border-2 border-border bg-background hover:border-foreground transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 bg-secondary/20 flex items-center justify-center shrink-0 border border-border">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">
                            {doc.name}
                          </div>
                          {doc.date && (
                            <div className="text-[0.625rem] font-semibold text-muted-foreground">
                              {doc.date}
                            </div>
                          )}
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                    </div>
                  ))}

                  {m.status === "active" && m.deliverables.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border bg-secondary/5 text-muted-foreground">
                      <Clock className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-center">
                        Expert has not submitted files yet.
                      </span>
                    </div>
                  )}

                  {m.status === "review" && m.deliverables.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border bg-secondary/5 text-muted-foreground">
                      <FileText className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-center">
                        No files submitted. Review based on completed tasks.
                      </span>
                    </div>
                  )}
                </div>

                {/* Feedback Thread */}
                {m.status === "review" && (
                  <div className="mt-4 bg-secondary/10 border-2 border-border p-4">
                    <h5 className="text-[0.625rem] font-black uppercase tracking-widest text-foreground mb-3 flex items-center gap-2">
                      <MessageSquareX className="w-3 h-3" /> Revision History
                    </h5>
                    <div className="space-y-3">
                      <div className="border-l-2 border-warning pl-3">
                        <div className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          Oct 12, 2023 - You (Client)
                        </div>
                        <p className="text-xs font-mono text-foreground">
                          "The logo looks great, but can we make the blue slightly darker to match our brand guidelines?"
                        </p>
                      </div>
                      <div className="border-l-2 border-primary pl-3">
                        <div className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                          Oct 14, 2023 - Expert
                        </div>
                        <p className="text-xs font-mono text-foreground">
                          "Updated the files with the exact hex code you provided. Please check the new upload."
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="text-center p-8 text-muted-foreground">
            Loading milestones...
          </div>
        )}
        {!isLoading && milestones.length === 0 && (
          <div className="text-center p-8 text-muted-foreground">
            No milestones found.
          </div>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <NeoButton
          variant="outline"
          className="border-dashed h-12 px-8 text-muted-foreground"
          onClick={() => setIsCreatingMilestone(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Request New Milestone
        </NeoButton>
      </div>

      {/* Request Revision Modal */}
      {revisionMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-destructive text-destructive-foreground">
              <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
                <MessageSquareX className="w-5 h-5" /> Request Revision
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => {
                  setRevisionMilestone(null);
                  setRevisionFeedback("");
                }}
                className="border-transparent h-8 w-8 hover:bg-black/20 text-current"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 space-y-6">
              <div className="space-y-1">
                <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                  Milestone
                </div>
                <div className="font-bold text-lg">{revisionMilestone.title}</div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  Feedback / Requested Changes *
                </label>
                <NeoTextarea
                  value={revisionFeedback}
                  onChange={(e) => setRevisionFeedback(e.target.value)}
                  placeholder="Detail what needs to be changed or improved..."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end gap-3">
              <NeoButton
                variant="outline"
                onClick={() => {
                  setRevisionMilestone(null);
                  setRevisionFeedback("");
                }}
              >
                Cancel
              </NeoButton>
              <NeoButton
                variant="destructive"
                disabled={!revisionFeedback.trim() || requestRevisionMutation.isPending}
                onClick={handleRequestRevision}
              >
                {requestRevisionMutation.isPending ? "Submitting..." : "Submit Feedback"}
              </NeoButton>
            </div>
          </div>
        </div>
      )}

      {/* Create Milestone Modal */}
      {isCreatingMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-lg animate-in zoom-in-95 duration-200">
            <div className="border-b-4 border-foreground p-4 flex justify-between items-center bg-primary text-primary-foreground">
              <h2 className="font-heading font-black text-xl uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-5 h-5" /> New Milestone
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => setIsCreatingMilestone(false)}
                className="border-transparent h-8 w-8 hover:bg-black/20 text-current"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest block">
                  Milestone Title *
                </label>
                <NeoInput
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
                  placeholder="e.g. Design System Implementation"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest block">
                    Amount ($) *
                  </label>
                  <NeoInput
                    type="number"
                    value={newMilestone.amount}
                    onChange={(e) => setNewMilestone({ ...newMilestone, amount: e.target.value })}
                    placeholder="500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest block">
                    Due Date *
                  </label>
                  <NeoInput
                    type="date"
                    value={newMilestone.dueDate}
                    onChange={(e) => setNewMilestone({ ...newMilestone, dueDate: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="border-t-4 border-foreground p-4 bg-secondary/30 flex justify-end gap-3">
              <NeoButton
                variant="outline"
                onClick={() => setIsCreatingMilestone(false)}
              >
                Cancel
              </NeoButton>
              <NeoButton
                disabled={!newMilestone.title || !newMilestone.amount || !newMilestone.dueDate || createMilestoneMutation.isPending}
                onClick={handleCreateMilestone}
              >
                {createMilestoneMutation.isPending ? "Creating..." : "Create Milestone"}
              </NeoButton>
            </div>
          </div>
        </div>
      )}
      {/* View Bids Drawer */}
      <NeoDrawer
        open={!!viewingBidsMilestone}
        onOpenChange={(open) => {
          if (!open) setViewingBidsMilestone(null);
        }}
      >
        <NeoDrawerContent side="right">
          <NeoDrawerHeader className="flex flex-row justify-between items-center space-y-0">
            <NeoDrawerTitle className="flex items-center gap-3">
              <Users className="w-6 h-6 text-primary" /> Bids for {viewingBidsMilestone?.title}
            </NeoDrawerTitle>
            <NeoButton
              variant="ghost"
              size="icon"
              onClick={() => setViewingBidsMilestone(null)}
              className="border-transparent h-8 w-8 shrink-0"
            >
              <X className="w-5 h-5" />
            </NeoButton>
          </NeoDrawerHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {viewingBidsMilestone?.bids?.map((bid) => (
              <div key={bid.id} className="border-4 border-foreground bg-card p-4 shadow-[4px_4px_0px_0px_var(--foreground)]">
                <div className="flex items-center gap-4 mb-4">
                  <NeoAvatar name={bid.expertName} className="w-12 h-12 border-2 border-foreground rounded-none shadow-none text-2xl" />
                  <div className="flex-1">
                    <div className="font-heading font-black text-lg uppercase tracking-wide">
                      {bid.expertName}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      Expert
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                      Bid Amount
                    </div>
                    <div className="font-heading font-black text-xl text-primary">
                      {bid.amount}
                    </div>
                  </div>
                </div>

                <div className="bg-secondary/10 border-2 border-border p-4 mb-4 text-sm font-medium leading-relaxed">
                  <div className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-2">Cover Letter</div>
                  {bid.coverLetter}
                </div>

                <NeoButton 
                  className="w-full h-12"
                  onClick={() => handleAcceptBid(bid.id)}
                  disabled={acceptBidMutation.isPending}
                >
                  {acceptBidMutation.isPending ? "Accepting..." : "Accept Bid & Lock Funds"} <CheckCircle2 className="w-4 h-4 ml-2" />
                </NeoButton>
              </div>
            ))}
            {viewingBidsMilestone?.bids?.length === 0 && (
              <div className="text-center p-8 text-muted-foreground font-bold">
                No bids yet for this milestone.
              </div>
            )}
          </div>
        </NeoDrawerContent>
      </NeoDrawer>

    </div>
  );
}

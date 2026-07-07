import { formatCurrency } from "@/lib/utils";
import {
  CheckCircle2,
  Clock,
  Download,
  FileText,
  MessageSquareX,
  Trash2,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { cn } from "@/lib/utils";
import { MilestoneDto } from "@/types/project.dto";

export interface MilestoneCardProps {
  milestone: MilestoneDto;
  index: number;
  onDelete: (id: string) => void;
  onApprove: (id: string) => void;
  onRequestRevision: (milestone: MilestoneDto) => void;
  isApproving: boolean;
}

export function MilestoneCard({
  milestone,
  index,
  onDelete,
  onApprove,
  onRequestRevision,
  isApproving,
}: MilestoneCardProps) {
  const m = milestone;

  return (
    <div
      className={cn(
        "bg-card border-4 shadow-[6px_6px_0px_0px_var(--foreground)] p-6 transition-all",
        m.status === "REVIEW"
          ? "border-purple-500 shadow-[6px_6px_0px_0px_var(--purple)]"
          : m.status === "ACTIVE"
            ? "border-blue-500 shadow-[6px_6px_0px_0px_var(--blue)]"
            : m.status === "PAID"
              ? "border-foreground bg-secondary/10 opacity-75"
              : "border-border",
      )}
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-heading font-black text-lg uppercase tracking-wide">
              {index + 1}. {m.title}
            </span>
            {m.status === "PAID" && <NeoBadge variant="success">Paid</NeoBadge>}
            {m.status === "REVIEW" && (
              <NeoBadge variant="nightmare" className="animate-pulse">
                Needs Review
              </NeoBadge>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Due:{" "}
              {m.endDate ? new Date(m.endDate).toLocaleDateString() : "TBD"}
            </span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span className="text-foreground font-black">
              {m.budget ? formatCurrency(m.budget) : "$0.00"}
            </span>
            {(m.status === "PENDING" || m.status === "ACTIVE") && (
              <>
                <span className="w-1 h-1 bg-border rounded-full" />
                <button
                  onClick={() => onDelete(m.id)}
                  className="text-muted-foreground hover:text-destructive flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Delete
                </button>
              </>
            )}
          </div>
        </div>

        {/* Action Area */}
        <div className="md:w-64 shrink-0 flex flex-col items-end gap-3 justify-center border-t-2 md:border-t-0 md:border-l-2 border-border pt-4 md:pt-0 md:pl-6">
          {m.status === "REVIEW" && (
            <>
              <NeoButton
                className="w-full h-12"
                onClick={() => onApprove(m.id)}
                disabled={isApproving}
              >
                {isApproving ? "Approving..." : "Approve & Pay"}{" "}
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </NeoButton>
              <NeoButton
                variant="outline"
                className="w-full h-10 border-destructive text-destructive hover:bg-destructive/10"
                onClick={() => onRequestRevision(m)}
              >
                Request Revision
              </NeoButton>
            </>
          )}
          {m.status === "ACTIVE" && (
            <NeoButton
              variant="outline"
              className="w-full h-12 cursor-not-allowed opacity-50"
            >
              Awaiting Delivery
            </NeoButton>
          )}
          {m.status === "PAID" && (
            <NeoButton
              variant="ghost"
              className="w-full h-10 border-transparent text-green-600"
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Settled
            </NeoButton>
          )}
        </div>
      </div>

      {/* Deliverables Section */}
      {((m as any).deliverables?.length > 0 ||
        m.status === "ACTIVE" ||
        m.status === "REVIEW") && (
        <div className="mt-6 pt-6 border-t-2 border-border border-dashed">
          <h4 className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
            <FileText className="w-3 h-3" /> Deliverables
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(m as any).deliverables?.map((doc: any, i: number) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 border-2 border-border bg-background hover:border-foreground transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-8 h-8 bg-secondary/20 flex items-center justify-center shrink-0 border border-border">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate">{doc.name}</div>
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

            {m.status === "ACTIVE" && !(m as any).deliverables?.length && (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border bg-secondary/5 text-muted-foreground">
                <Clock className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-center">
                  Expert has not submitted files yet.
                </span>
              </div>
            )}

            {m.status === "REVIEW" && !(m as any).deliverables?.length && (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border bg-secondary/5 text-muted-foreground">
                <FileText className="w-6 h-6 mb-2 opacity-50" />
                <span className="text-[0.625rem] font-bold uppercase tracking-widest text-center">
                  No files submitted. Review based on completed tasks.
                </span>
              </div>
            )}
          </div>

          {/* Feedback Thread */}
          {m.status === "REVIEW" && (
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
                    "The logo looks great, but can we make the blue slightly
                    darker to match our brand guidelines?"
                  </p>
                </div>
                <div className="border-l-2 border-primary pl-3">
                  <div className="text-[0.5rem] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                    Oct 14, 2023 - Expert
                  </div>
                  <p className="text-xs font-mono text-foreground">
                    "Updated the files with the exact hex code you provided.
                    Please check the new upload."
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

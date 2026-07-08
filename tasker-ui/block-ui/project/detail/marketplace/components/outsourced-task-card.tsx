import { ArrowRight, UserCheck, ShieldCheck, MessageSquareText } from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn, formatCurrency } from "@/lib/utils";

export interface OutsourcedTaskCardProps {
  task: any;
  onViewTask: (taskId: string) => void;
  onReviewWork: (taskId: string) => void;
  onMessageExpert: (proposalId: string) => void;
  onAcceptBid: (proposalId: string) => void;
  onRejectBid: (proposalId: string) => void;
  onViewProfile?: (expertId: string) => void;
  isAccepting?: boolean;
}

export function OutsourcedTaskCard({
  task,
  onViewTask,
  onReviewWork,
  onMessageExpert,
  onAcceptBid,
  onRejectBid,
  onViewProfile,
  isAccepting,
}: OutsourcedTaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "text-[#E1801E] bg-[#E1801E]/10 border-[#E1801E]";
      case "ACTIVE": return "text-blue-600 bg-blue-500/10 border-blue-500";
      case "REVIEW": return "text-purple-600 bg-purple-500/10 border-purple-500";
      case "PAID": return "text-primary bg-primary/10 border-primary";
      default: return "text-muted-foreground bg-secondary border-border";
    }
  };

  return (
    <div className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]">
      {/* Task Header */}
      <div className="p-6 border-b-2 border-border bg-secondary/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <span className={cn("text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2", getStatusColor(task.status))}>
              Status: {task.status}
            </span>
            <span className="text-[0.625rem] font-bold uppercase tracking-widest px-2 py-1 border-2 border-[#E1801E] bg-[#E1801E]/10 text-[#E1801E]">
              Budget: {formatCurrency(task.budget || 0)}
            </span>
          </div>
          <h3 className="font-heading font-black text-lg md:text-xl uppercase tracking-wide">
            {task.title}
          </h3>
        </div>

        <NeoButton
          variant="ghost"
          className="text-xs border-transparent shrink-0"
          onClick={() => onViewTask(task.id)}
        >
          Task Details <ArrowRight className="w-4 h-4 ml-2" />
        </NeoButton>
      </div>

      {/* Proposals Section */}
      <div className="p-6">
        {task.status !== "PENDING" ? (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border-2 border-primary bg-primary/5 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-none border-2 border-border bg-primary/20 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    {task.expertId || "Hired Expert"}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                  Hired Expert • Escrow Locked
                </p>
              </div>
            </div>
            <NeoButton 
              className="w-full sm:w-auto text-xs h-10"
              onClick={() => onReviewWork(task.id)}
            >
              Review Work
            </NeoButton>
          </div>
        ) : (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              Proposals Received ({task.proposals?.length || 0})
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {task.proposals?.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-border text-center text-muted-foreground text-xs uppercase font-bold">
                  No proposals yet
                </div>
              ) : task.proposals?.map((p: any) => (
                <div
                  key={p.id}
                  className={cn(
                    "p-4 border-2 border-border bg-background flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors",
                    p.status === "REJECTED" ? "opacity-50 grayscale" : "hover:border-primary/50"
                  )}
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h5 
                        className="font-bold text-sm uppercase tracking-wide cursor-pointer hover:text-primary transition-colors"
                        onClick={() => onViewProfile && onViewProfile(p.expertId)}
                      >
                        {p.expertId || "Expert"}
                      </h5>
                      <span className="text-[0.625rem] font-bold bg-[#E1801E]/10 text-[#E1801E] px-2 py-0.5 border-2 border-[#E1801E]">
                        ★ 5.0
                      </span>
                      <span className="text-[0.625rem] font-bold px-2 py-0.5 border-2 border-border bg-secondary">
                        Bid: {Number(p.proposedPrice) > 0 ? formatCurrency(p.proposedPrice) : formatCurrency(task.budget)}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-muted-foreground italic leading-relaxed">
                      "{p.coverLetter}"
                    </p>
                  </div>

                  {p.status === "REJECTED" ? (
                    <div className="flex flex-col sm:flex-row items-center justify-end gap-3 w-full md:w-auto shrink-0 border-t-2 border-border md:border-t-0 pt-4 md:pt-0">
                      <span className="text-xs font-bold text-destructive uppercase px-4 py-2 border-2 border-destructive bg-destructive/10">
                        Rejected
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 border-t-2 border-border md:border-t-0 pt-4 md:pt-0">
                      <NeoButton
                        variant="outline"
                        className="w-full sm:w-auto text-[0.625rem] h-10 px-4"
                        onClick={() => onMessageExpert(p.id)}
                      >
                        <MessageSquareText className="w-3 h-3 mr-2" />{" "}
                        Message
                      </NeoButton>
                      <NeoButton
                        variant="outline"
                        className="w-full sm:w-auto text-[0.625rem] h-10 px-4 border-destructive text-destructive hover:bg-destructive/10"
                        onClick={() => onRejectBid(p.id)}
                        disabled={isAccepting}
                      >
                        Reject
                      </NeoButton>
                      <NeoButton 
                        className="w-full sm:w-auto text-[0.625rem] h-10 px-4"
                        onClick={() => onAcceptBid(p.id)}
                        disabled={isAccepting}
                      >
                        {isAccepting ? "Accepting..." : "Accept Bid"}
                      </NeoButton>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useParams } from "next/navigation";
import { useProjectMarketplace } from "@/tanstack/useProjects";
import { cn, formatCurrency } from "@/lib/utils";

import {
  Store,
  ArrowRight,
  UserCheck,
  MessageSquareText,
  ShieldCheck,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

export default function ProjectMarketplacePage() {
  const params = useParams();
  const projectId = params.projectId as string;

  const { data: outsourcedTasks = [], isLoading } = useProjectMarketplace(projectId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN": return "text-[#E1801E] bg-[#E1801E]/10 border-[#E1801E]";
      case "IN_PROGRESS": return "text-blue-600 bg-blue-500/10 border-blue-500";
      case "REVIEW": return "text-purple-600 bg-purple-500/10 border-purple-500";
      case "COMPLETED": return "text-primary bg-primary/10 border-primary";
      default: return "text-muted-foreground bg-secondary border-border";
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <NeoPageHeader
        variant="transparent"
        className="mb-2"
        containerClassName="!px-0 !pt-0 !pb-6"
        headingTag="h2"
        title="Marketplace Hub"
        icon={<Store className="w-8 h-8 text-primary" />}
        description="Manage outsourced tasks, review proposals, and hire experts"
        rightContent={
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <NeoButton variant="outline" className="w-full sm:w-auto h-12 px-6">
              Browse Experts
            </NeoButton>
            <NeoButton className="w-full sm:w-auto h-12 px-6">
              Post New Task
            </NeoButton>
          </div>
        }
      />

      {/* Task List */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="text-center p-8 text-muted-foreground uppercase text-xs font-bold">
            Loading marketplace tasks...
          </div>
        ) : outsourcedTasks.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground uppercase text-xs font-bold">
            No outsourced tasks yet. Post a new task!
          </div>
        ) : outsourcedTasks.map((task: any) => (
          <div
            key={task.id}
            className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)]"
          >
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
              >
                Task Details <ArrowRight className="w-4 h-4 ml-2" />
              </NeoButton>
            </div>

            {/* Proposals Section */}
            <div className="p-6">
              {task.status !== "OPEN" ? (
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
                  <NeoButton className="w-full sm:w-auto text-xs h-10">
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
                        className="p-4 border-2 border-border bg-background flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-primary/50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-3">
                            <h5 className="font-bold text-sm uppercase tracking-wide">
                              {p.expertId || "Expert"}
                            </h5>
                            <span className="text-[0.625rem] font-bold bg-[#E1801E]/10 text-[#E1801E] px-2 py-0.5 border-2 border-[#E1801E]">
                              ★ 5.0
                            </span>
                            <span className="text-[0.625rem] font-bold px-2 py-0.5 border-2 border-border bg-secondary">
                              Bid: {formatCurrency(p.proposedPrice)}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-muted-foreground italic leading-relaxed">
                            "{p.coverLetter}"
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0 border-t-2 border-border md:border-t-0 pt-4 md:pt-0">
                          <NeoButton
                            variant="outline"
                            className="w-full sm:w-auto text-[0.625rem] h-10 px-4"
                          >
                            <MessageSquareText className="w-3 h-3 mr-2" />{" "}
                            Message
                          </NeoButton>
                          <NeoButton className="w-full sm:w-auto text-[0.625rem] h-10 px-4">
                            Accept Bid
                          </NeoButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

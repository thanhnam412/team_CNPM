"use client";

import {
  Wallet,
  AlertTriangle,
  MessageSquare,
  Zap,
  Target,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { cn, formatCurrency } from "@/lib/utils";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoWidgetHeader } from "@/components/ui-custom/neo-widget-header";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoAvatar } from "@/components/ui-custom/neo-avatar";
import { NeoProgress } from "@/components/ui-custom/neo-progress";
import Link from "next/link";
import { useGetMe } from "@/tanstack/useGetMe";
import { useExpertOverview } from "@/tanstack/useExperts";

export default function ExpertDashboardOverviewPage() {
  const { data: me } = useGetMe();
  const expertId = me?.id;
  const { data: overview, isLoading } = useExpertOverview(expertId || "");

  const displayName = me?.name || "Expert";

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Hero Section */}
      <NeoPageHeader
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        icon={<Zap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        title={`Welcome back, ${displayName}`}
        description="Here's your work pipeline and pending milestones."
        rightContent={
          <Link href="/expert/find-work/tasks">
            <NeoButton className="h-12 px-6">Find Work</NeoButton>
          </Link>
        }
      />

      {/* Main Grid */}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Row: Finance & Action Required */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Finance Snapshot */}
          <NeoCard className="lg:col-span-1 p-6 flex flex-col">
            <NeoWidgetHeader
              title="Earnings"
              icon={<Wallet className="w-5 h-5 text-primary" />}
              href="/expert/earnings"
              linkText="View All"
            />

            <div className="space-y-4 flex-1">
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Available to Withdraw
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-primary">
                  {formatCurrency(overview?.finance?.availableToWithdraw || me?.wallet?.balance || 0)}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border border-dashed">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    In Escrow
                  </div>
                  <div className="font-heading font-black text-lg text-muted-foreground">
                    {formatCurrency(overview?.finance?.inEscrow || me?.wallet?.escrowBalance || 0)}
                  </div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Total Earned
                  </div>
                  <div className="font-heading font-black text-lg">
                    {formatCurrency(overview?.finance?.earnedMTD || me?.wallet?.totalEarned || 0)}
                  </div>
                </div>
              </div>
            </div>

            <Link href="/expert/earnings" className="mt-6">
              <NeoButton variant="outline" className="w-full h-10">
                Withdraw Funds
              </NeoButton>
            </Link>
          </NeoCard>

          {/* Action Required */}
          <NeoCard className="lg:col-span-2 bg-destructive/10 border-destructive shadow-[4px_4px_0px_0px_var(--destructive)] p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-destructive text-destructive-foreground p-1.5 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black uppercase tracking-widest text-lg text-destructive">
                Action Required
              </h3>
            </div>

            <p className="text-sm font-bold text-foreground mb-6">
              You have {overview?.actionRequired?.length || 0} tasks/milestones
              due soon. Submit your deliverables to release escrow funds.
            </p>

            <div className="space-y-3 flex-1">
              {(!overview?.actionRequired || overview.actionRequired.length === 0) && (
                <div className="text-sm font-semibold text-muted-foreground">
                  No urgent tasks due soon.
                </div>
              )}
              {(overview?.actionRequired || []).map((item: any, i: number) => (
                <div
                  key={i}
                  className={cn(
                    "bg-card border-2 p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-[1px] transition-transform cursor-pointer",
                    item.isUrgent ? "border-destructive" : "border-foreground",
                  )}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <NeoBadge variant="secondary">{item.type}</NeoBadge>
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                        {item.id}
                      </span>
                      <NeoBadge
                        variant={item.isUrgent ? "destructive" : "warning"}
                      >
                        Due {new Date(item.dueDate).toLocaleDateString()}
                      </NeoBadge>
                    </div>
                    <div className="font-bold text-sm uppercase">
                      {item.taskName}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">
                      For {item.clientName}
                    </div>
                  </div>
                  <Link href="/expert/workspace">
                    <NeoButton className="h-8 px-4 text-xs shrink-0">
                      Submit Work
                    </NeoButton>
                  </Link>
                </div>
              ))}
            </div>
          </NeoCard>
        </div>

        {/* Middle Row: Active Work & Inbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Work Widget */}
          <NeoCard className="p-6">
            <NeoWidgetHeader
              title="Active Work"
              icon={<Target className="w-5 h-5 text-primary" />}
              href="/expert/find-work/milestones"
              linkText="View All"
            />

            <div className="space-y-6">
              {(!overview?.activeWork || overview.activeWork.length === 0) && (
                <div className="text-sm font-semibold text-muted-foreground">
                  No active work at the moment.
                </div>
              )}
              {(overview?.activeWork || []).map((work: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Link
                        href="/expert/workspace"
                        className="font-bold uppercase hover:text-primary transition-colors"
                      >
                        {work.title}
                      </Link>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                        Client: {work.clientName}
                      </div>
                    </div>
                    <NeoBadge
                      variant={
                        work.status === "REVIEW" ? "secondary" : "default"
                      }
                    >
                      {work.status}
                    </NeoBadge>
                  </div>
                  <NeoProgress
                    value={work.progressPercentage}
                    variant={work.status === "REVIEW" ? "secondary" : "default"}
                  />
                  <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                    <span>
                      Progress: {work.progressPercentage}%{" "}
                      {work.status === "REVIEW" && "(Client reviewing)"}
                    </span>
                    <span>Escrow: {formatCurrency(work.escrowAmount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </NeoCard>

          {/* Urgent Inbox Widget */}
          <NeoCard className="p-6">
            <NeoWidgetHeader
              title="Client Messages"
              icon={<MessageSquare className="w-5 h-5 text-primary" />}
              href="/expert/messages"
              linkText="Open Inbox"
            />

            <div className="space-y-3">
              {(!overview?.messages?.recentChats || overview.messages.recentChats.length === 0) && (
                <div className="text-sm font-semibold text-muted-foreground">
                  No recent messages.
                </div>
              )}
              {(overview?.messages?.recentChats || []).map((chat: any, i: number) => (
                <Link key={i} href="/expert/messages" className="block">
                  <div className="border-2 border-border bg-background p-3 flex gap-3 hover:bg-secondary/10 transition-colors group">
                    <NeoAvatar name={chat.senderName} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm uppercase truncate group-hover:text-primary">
                          {chat.senderName}
                        </span>
                        {chat.unreadCount > 0 && (
                          <NeoBadge variant="destructive" className="shrink-0">
                            {chat.unreadCount}
                          </NeoBadge>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground truncate mt-0.5">
                        {chat.lastMessage}
                      </div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1 flex justify-between">
                        <span>{chat.contextLabel}</span>
                        <span>{new Date(chat.time).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/expert/messages">
              <NeoButton variant="outline" className="w-full mt-4 h-10">
                View All Conversations
              </NeoButton>
            </Link>
          </NeoCard>
        </div>

        {/* Bottom Row: Recommended Tasks */}
        <div>
          <NeoWidgetHeader
            title="Recommended Tasks"
            icon={<Zap className="w-5 h-5 text-primary" />}
            href="/expert/find-work/tasks"
            linkText="Browse Marketplace"
            className="mb-4"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(!overview?.recommendedTasks || overview.recommendedTasks.length === 0) && (
                <div className="text-sm font-semibold text-muted-foreground col-span-3">
                  No recommended tasks at the moment.
                </div>
              )}
            {(overview?.recommendedTasks || []).map((task: any, i: number) => (
              <NeoCard
                key={i}
                variant="interactive"
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-heading font-black text-lg text-primary">
                      {formatCurrency(task.budget)}
                    </span>
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                      {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-bold uppercase text-sm mb-3 line-clamp-2">
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags.map((t: string) => (
                      <NeoBadge
                        key={t}
                        variant="secondary"
                        className="bg-secondary/50 font-bold"
                      >
                        {t}
                      </NeoBadge>
                    ))}
                  </div>
                </div>
                <Link href="/expert/find-work/tasks">
                  <NeoButton variant="outline" className="w-full h-8 text-xs">
                    Apply Now
                  </NeoButton>
                </Link>
              </NeoCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

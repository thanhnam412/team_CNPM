"use client";

import {
  Wallet,
  AlertTriangle,
  MessageSquare,
  Briefcase,
  ChevronRight,
  Zap,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";
import { NeoWidgetHeader } from "@/components/ui-custom/neo-widget-header";
import { NeoBadge } from "@/components/ui-custom/neo-badge";
import { NeoAvatar } from "@/components/ui-custom/neo-avatar";
import { NeoProgress } from "@/components/ui-custom/neo-progress";
import Link from "next/link";

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Hero Section */}
      <NeoPageHeader
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        icon={<Zap className="w-8 h-8 md:w-10 md:h-10 text-primary" />}
        title="Welcome back, Client_01"
        description="Here's what's happening across your projects today."
        rightContent={
          <Link href="/client/projects/new">
            <NeoButton className="h-12 px-6">New Project</NeoButton>
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
              title="Finance"
              icon={<Wallet className="w-5 h-5 text-primary" />}
              href="/client/finance"
              linkText="View All"
            />

            <div className="space-y-4 flex-1">
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Available Balance
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl">
                  $4,500.00
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border border-dashed">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    In Escrow
                  </div>
                  <div className="font-heading font-black text-lg text-warning">
                    $2,150.00
                  </div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Spent (MTD)
                  </div>
                  <div className="font-heading font-black text-lg">$850.00</div>
                </div>
              </div>
            </div>

            <Link href="/client/finance?tab=deposit" className="mt-6">
              <NeoButton variant="outline" className="w-full h-10">
                Deposit Funds
              </NeoButton>
            </Link>
          </NeoCard>

          {/* Action Required */}
          <NeoCard className="lg:col-span-2 bg-warning/10 border-warning shadow-[4px_4px_0px_0px_var(--color-warning)] p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-warning text-warning-foreground p-1.5 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] animate-pulse">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-black uppercase tracking-widest text-lg text-warning">
                Action Required
              </h3>
            </div>

            <p className="text-sm font-bold text-foreground mb-6">
              You have 2 deliverables waiting for your approval. Escrow funds
              will be automatically released in 48 hours if no action is taken.
            </p>

            <div className="space-y-3 flex-1">
              {[
                {
                  task: "API Integration Module",
                  expert: "Alex_Code",
                  type: "Project",
                  id: "PROJ-123",
                },
                {
                  task: "Web Scraper Script",
                  expert: "Data_Wizard_99",
                  type: "Quick Task",
                  id: "QT-889",
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="bg-card border-2 border-foreground p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-[1px] transition-transform cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <NeoBadge variant="secondary">
                        {item.type}
                      </NeoBadge>
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                        {item.id}
                      </span>
                    </div>
                    <div className="font-bold text-sm uppercase">
                      {item.task}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">
                      Submitted by {item.expert}
                    </div>
                  </div>
                  <NeoButton className="h-8 px-4 text-xs shrink-0">
                    Review
                  </NeoButton>
                </div>
              ))}
            </div>
          </NeoCard>
        </div>

        {/* Middle Row: Active Projects & Inbox */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Projects Widget */}
          <NeoCard className="p-6">
            <NeoWidgetHeader
              title="Active Projects"
              icon={<Briefcase className="w-5 h-5 text-primary" />}
              href="/client/projects"
              linkText="View All"
            />

            <div className="space-y-6">
              {/* Project 1 */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      href="/client/projects/PROJ-123"
                      className="font-bold uppercase hover:text-primary transition-colors"
                    >
                      Hệ thống Quản lý Doanh nghiệp (ERP)
                    </Link>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      Deadline: Dec 31, 2026
                    </div>
                  </div>
                  <NeoBadge variant="success">
                    On Track
                  </NeoBadge>
                </div>
                <NeoProgress value={65} />
                <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  <span>Progress: 65%</span>
                  <span>Escrow: $5,000.00</span>
                </div>
              </div>

              {/* Project 2 */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      href="/client/projects/PROJ-124"
                      className="font-bold uppercase hover:text-primary transition-colors"
                    >
                      B2B E-commerce Platform
                    </Link>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-warning mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Due in 3 days
                    </div>
                  </div>
                  <NeoBadge variant="warning">
                    At Risk
                  </NeoBadge>
                </div>
                <NeoProgress value={85} variant="warning" />
                <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  <span>Progress: 85%</span>
                  <span>Escrow: $3,200.00</span>
                </div>
              </div>
            </div>
          </NeoCard>

          {/* Urgent Inbox Widget */}
          <NeoCard className="p-6">
            <NeoWidgetHeader
              title="Unread Messages"
              icon={<MessageSquare className="w-5 h-5 text-primary" />}
              href="/client/messages"
              linkText="Open Inbox"
            />

            <div className="space-y-3">
              {[
                {
                  name: "Alex_Code",
                  time: "10:42 AM",
                  msg: "I've started setting up the proxy pool for the scraper.",
                  unread: 2,
                  context: "QT-889",
                },
                {
                  name: "DesignStudio",
                  time: "Yesterday",
                  msg: "Attached the initial wireframes for your review.",
                  unread: 1,
                  context: "PROJ-124",
                },
              ].map((chat) => (
                <Link key={chat.context} href="/client/messages" className="block">
                  <div className="border-2 border-border bg-background p-3 flex gap-3 hover:bg-secondary/10 transition-colors group">
                    <NeoAvatar name={chat.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm uppercase truncate group-hover:text-primary">
                          {chat.name}
                        </span>
                        <NeoBadge variant="destructive" className="shrink-0">
                          {chat.unread}
                        </NeoBadge>
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground truncate mt-0.5">
                        {chat.msg}
                      </div>
                      <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1 flex justify-between">
                        <span>{chat.context}</span>
                        <span>{chat.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <Link href="/client/messages">
              <NeoButton variant="outline" className="w-full mt-4 h-10">
                View All Conversations
              </NeoButton>
            </Link>
          </NeoCard>
        </div>
      </div>
    </div>
  );
}

"use client";

import {
  ArrowRight,
  Wallet,
  AlertTriangle,
  MessageSquare,
  Briefcase,
  Clock,
  ChevronRight,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCard } from "@/components/ui-custom/neo-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function ExpertDashboardOverviewPage() {
  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Hero Section */}
      <div className="bg-card border-b-2 border-border p-6 md:p-8 shrink-0 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />

        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 fill-primary" /> Command Center
            </h2>
            <h1 className="text-4xl md:text-5xl font-heading font-black tracking-widest uppercase">
              Welcome back, <br className="hidden md:block" /> Expert_01
            </h1>
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest mt-4">
              Here's your work pipeline and pending milestones.
            </p>
          </div>

          <div className="flex gap-3">
            <Link href="/expert/find-work/tasks">
              <NeoButton className="h-12 px-6">Find Work</NeoButton>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Row: Finance & Action Required */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Finance Snapshot */}
          <NeoCard className="lg:col-span-1 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" /> Earnings
              </h3>
              <Link
                href="/expert/earnings"
                className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                  Available to Withdraw
                </div>
                <div className="font-heading font-black text-3xl md:text-4xl text-primary">
                  $1,250.00
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t-2 border-border border-dashed">
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    In Escrow
                  </div>
                  <div className="font-heading font-black text-lg text-muted-foreground">
                    $3,150.00
                  </div>
                </div>
                <div>
                  <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                    Earned (MTD)
                  </div>
                  <div className="font-heading font-black text-lg">$850.00</div>
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
              You have 2 milestones due in the next 24 hours. Submit your
              deliverables to release escrow funds.
            </p>

            <div className="space-y-3 flex-1">
              {[
                {
                  task: "API Integration Module",
                  client: "Client_01",
                  type: "Milestone",
                  id: "PROJ-123",
                  due: "Today",
                },
                {
                  task: "Web Scraper Script",
                  client: "Startup_Hub",
                  type: "Task",
                  id: "QT-889",
                  due: "Tomorrow",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="bg-card border-2 border-foreground p-3 md:p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[2px_2px_0px_0px_var(--foreground)] hover:-translate-y-[1px] transition-transform cursor-pointer"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[0.625rem] font-black uppercase tracking-widest bg-secondary px-1.5 py-0.5 border-2 border-border">
                        {item.type}
                      </span>
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                        {item.id}
                      </span>
                      <span className="text-[0.625rem] font-black uppercase tracking-widest bg-destructive text-destructive-foreground px-1.5 py-0.5">
                        Due {item.due}
                      </span>
                    </div>
                    <div className="font-bold text-sm uppercase">
                      {item.task}
                    </div>
                    <div className="text-xs font-bold text-muted-foreground">
                      For {item.client}
                    </div>
                  </div>
                  <Link href="/expert/find-work/milestones">
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
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Active Work
              </h3>
              <Link
                href="/expert/find-work/milestones"
                className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                View All <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-6">
              {/* Project 1 */}
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <Link
                      href="/expert/find-work/milestones"
                      className="font-bold uppercase hover:text-primary transition-colors"
                    >
                      Hệ thống Quản lý Doanh nghiệp (ERP)
                    </Link>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      Client: Client_01
                    </div>
                  </div>
                  <span className="bg-primary/10 text-primary border-2 border-primary px-2 py-0.5 text-[0.625rem] font-black uppercase tracking-widest">
                    In Progress
                  </span>
                </div>
                <div className="h-4 border-2 border-border bg-secondary/30 w-full relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-primary border-r-2 border-border"
                    style={{ width: "65%" }}
                  />
                </div>
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
                      href="/expert/find-work/milestones"
                      className="font-bold uppercase hover:text-primary transition-colors"
                    >
                      B2B E-commerce Platform
                    </Link>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-destructive mt-1 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Due in 3 days
                    </div>
                  </div>
                  <span className="bg-secondary text-secondary-foreground border-2 border-border px-2 py-0.5 text-[0.625rem] font-black uppercase tracking-widest">
                    Review Pending
                  </span>
                </div>
                <div className="h-4 border-2 border-border bg-secondary/30 w-full relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-secondary border-r-2 border-border"
                    style={{ width: "85%" }}
                  />
                </div>
                <div className="flex justify-between text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                  <span>Progress: 85% (Client reviewing)</span>
                  <span>Escrow: $3,200.00</span>
                </div>
              </div>
            </div>
          </NeoCard>

          {/* Urgent Inbox Widget */}
          <NeoCard className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> Client
                Messages
              </h3>
              <Link
                href="/expert/messages"
                className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                Open Inbox <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>

            <div className="space-y-3">
              {[
                {
                  name: "Startup_Hub",
                  time: "10:42 AM",
                  msg: "Can we add one more data point to the scraper?",
                  unread: 1,
                  context: "QT-889",
                },
                {
                  name: "Client_01",
                  time: "Yesterday",
                  msg: "The UI looks great! Let's proceed to the next phase.",
                  unread: 0,
                  context: "PROJ-123",
                },
              ].map((chat, i) => (
                <Link key={i} href="/expert/messages" className="block">
                  <div className="border-2 border-border bg-background p-3 flex gap-3 hover:bg-secondary/10 transition-colors group">
                    <div className="w-10 h-10 border-2 border-foreground bg-primary flex items-center justify-center font-heading font-black text-primary-foreground shrink-0 shadow-[2px_2px_0px_0px_var(--foreground)]">
                      {chat.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-sm uppercase truncate group-hover:text-primary">
                          {chat.name}
                        </span>
                        {chat.unread > 0 && (
                          <span className="text-[0.625rem] font-black uppercase bg-destructive text-destructive-foreground px-1.5 py-0.5 border-2 border-destructive shrink-0">
                            {chat.unread}
                          </span>
                        )}
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

            <Link href="/expert/messages">
              <NeoButton variant="outline" className="w-full mt-4 h-10">
                View All Conversations
              </NeoButton>
            </Link>
          </NeoCard>
        </div>

        {/* Bottom Row: Recommended Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-black uppercase tracking-widest text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" /> Recommended Tasks
            </h3>
            <Link
              href="/expert/find-work/tasks"
              className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center"
            >
              Browse Marketplace <ChevronRight className="w-3 h-3 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Fix React Hydration Error",
                budget: "$150",
                tags: ["React", "NextJS"],
                time: "2 hours ago",
              },
              {
                title: "Design Custom PDF Template",
                budget: "$300",
                tags: ["Design", "HTML/CSS"],
                time: "5 hours ago",
              },
              {
                title: "Setup CI/CD Pipeline",
                budget: "$500",
                tags: ["DevOps", "GitHub Actions"],
                time: "1 day ago",
              },
            ].map((task, i) => (
              <NeoCard
                key={i}
                variant="interactive"
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-heading font-black text-lg text-primary">
                      {task.budget}
                    </span>
                    <span className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground">
                      {task.time}
                    </span>
                  </div>
                  <h4 className="font-bold uppercase text-sm mb-3 line-clamp-2">
                    {task.title}
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[0.625rem] font-bold uppercase tracking-widest bg-secondary/50 px-2 py-0.5 border-2 border-border"
                      >
                        {t}
                      </span>
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

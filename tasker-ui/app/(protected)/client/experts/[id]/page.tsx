"use client";

import { useState } from "react";
import {
  ArrowLeft,
  UserPlus,
  Bookmark,
  BookmarkCheck,
  Star,
  MapPin,
  Briefcase,
  Clock,
  Award,
  Zap,
  ExternalLink,
  MessageSquare,
  X,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Data for the Expert
const EXPERT = {
  id: "exp_1",
  name: "Alex_Code",
  title: "Senior AI / Python Engineer",
  avatar: "A",
  rate: "$45/hr",
  totalEarned: "$12k+",
  rating: 4.9,
  reviews: 124,
  completedTasks: 89,
  successRate: "98%",
  online: true,
  saved: false,
  location: "Vietnam (UTC+7)",
  badge: "Top Rated",
  bio: "I am a Senior AI Engineer specializing in Python, LLMs, and large-scale web scraping. I have over 5 years of experience building scalable data pipelines and integrating OpenAI/Anthropic APIs into production environments.\n\nMy approach is highly pragmatic: I focus on writing clean, maintainable code that solves real business problems. I am comfortable working in fast-paced startup environments and can take a project from architecture design to deployment.",
  skills: {
    core: [
      "Python",
      "Large Language Models (LLMs)",
      "Web Scraping",
      "FastAPI",
      "PyTorch",
    ],
    secondary: ["Docker", "AWS", "PostgreSQL", "React", "TypeScript"],
  },
  workHistory: [
    {
      id: "PROJ-88",
      title: "Automated Data Pipeline for E-commerce",
      date: "Aug 2026",
      earned: "$1,200",
      rating: 5,
      feedback:
        "Alex was exceptional. He understood the requirements immediately and delivered a robust scraping solution that bypassed all Cloudflare protections. Highly recommended for any complex data extraction tasks.",
    },
    {
      id: "QT-102",
      title: "Integrate Llama-3 into existing Next.js app",
      date: "Jul 2026",
      earned: "$350",
      rating: 5,
      feedback:
        "Fast turnaround and clean code. Helped us reduce our API costs by switching to a local model.",
    },
    {
      id: "PROJ-65",
      title: "Backend API for AI Image Generator",
      date: "Jun 2026",
      earned: "$2,500",
      rating: 4,
      feedback:
        "Good technical skills. There were some minor delays due to time zone differences, but the final product was solid and well-documented.",
    },
  ],
  portfolio: [
    { title: "AI Content Generator", type: "Web App" },
    { title: "Distributed Crawler", type: "Script / CLI" },
  ],
};

export default function ExpertProfilePage() {
  const params = useParams();
  // In a real app, we would fetch data based on params.id
  // const expertId = params.id;

  const [isSaved, setIsSaved] = useState(EXPERT.saved);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-y-auto">
      {/* Top Nav Bar */}
      <div className="p-4 border-b-2 border-border bg-card sticky top-0 z-30 flex items-center justify-between">
        <Link href="/client/experts">
          <NeoButton
            variant="ghost"
            className="border-transparent text-[0.625rem]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
          </NeoButton>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row flex-1 w-full max-w-7xl mx-auto">
        {/* LEFT COLUMN: Identity & Stats */}
        <div className="w-full lg:w-[350px] shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-border bg-card p-6 flex flex-col gap-6">
          {/* Avatar & Basic Info */}
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 border-4 border-foreground bg-primary flex items-center justify-center font-heading font-black text-5xl text-primary-foreground shadow-[6px_6px_0px_0px_var(--foreground)]">
                {EXPERT.avatar}
              </div>
              {EXPERT.online && (
                <div
                  className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 border-4 border-card rounded-full"
                  title="Online Now"
                />
              )}
            </div>

            {EXPERT.badge && (
              <div className="bg-purple-500 text-white border-2 border-foreground px-3 py-1 flex items-center gap-1 mb-3 shadow-[2px_2px_0px_0px_var(--foreground)]">
                <Zap className="w-3 h-3 fill-current" />
                <span className="text-xs font-black uppercase tracking-widest">
                  {EXPERT.badge}
                </span>
              </div>
            )}

            <h1 className="font-heading font-black text-2xl uppercase tracking-wider">
              {EXPERT.name}
            </h1>
            <p className="text-sm font-bold text-muted-foreground uppercase mt-1">
              {EXPERT.title}
            </p>

            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground mt-3">
              <MapPin className="w-4 h-4" /> {EXPERT.location}
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col gap-3">
            <NeoButton
              onClick={() => setIsInviteOpen(true)}
              className="w-full h-14 text-sm"
            >
              <UserPlus className="w-5 h-5 mr-2" /> Invite to Project
            </NeoButton>
            <NeoButton
              variant="outline"
              onClick={() => setIsSaved(!isSaved)}
              className={cn("w-full h-12", isSaved ? "bg-primary/5" : "")}
            >
              {isSaved ? (
                <BookmarkCheck className="w-4 h-4 mr-2" />
              ) : (
                <Bookmark className="w-4 h-4 mr-2" />
              )}
              {isSaved ? "Saved" : "Save Expert"}
            </NeoButton>
          </div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-4 border-t-2 border-border pt-6">
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Hourly Rate
              </div>
              <div className="font-heading font-black text-xl text-primary">
                {EXPERT.rate}
              </div>
            </div>
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Total Earned
              </div>
              <div className="font-heading font-black text-xl">
                {EXPERT.totalEarned}
              </div>
            </div>
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Jobs Done
              </div>
              <div className="font-heading font-black text-xl">
                {EXPERT.completedTasks}
              </div>
            </div>
            <div>
              <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Success Rate
              </div>
              <div className="font-heading font-black text-xl">
                {EXPERT.successRate}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Deep Dive Content */}
        <div className="flex-1 p-6 md:p-8 space-y-12 bg-secondary/5">
          {/* Bio */}
          <section>
            <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
              <UserPlus className="w-5 h-5 text-primary" /> About
            </h2>
            <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] text-sm font-semibold whitespace-pre-wrap leading-relaxed">
              {EXPERT.bio}
            </div>
          </section>

          {/* Skill Tree */}
          <section>
            <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
              <Award className="w-5 h-5 text-primary" /> Skills & Expertise
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EXPERT.skills.core.map((skill) => (
                    <span
                      key={skill}
                      className="bg-foreground text-background border-2 border-foreground px-3 py-1.5 text-xs font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_var(--foreground)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mb-2">
                  Secondary Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {EXPERT.skills.secondary.map((skill) => (
                    <span
                      key={skill}
                      className="bg-card border-2 border-border px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Portfolio Placeholder */}
          <section>
            <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
              <Briefcase className="w-5 h-5 text-primary" /> Portfolio
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPERT.portfolio.map((item, i) => (
                <div
                  key={i}
                  className="aspect-video bg-card border-2 border-border p-4 flex flex-col justify-end group hover:border-primary transition-colors cursor-pointer shadow-[4px_4px_0px_0px_var(--border)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-secondary/50 flex items-center justify-center">
                    <span className="text-muted-foreground font-black uppercase tracking-widest opacity-30 rotate-12 text-2xl">
                      Preview
                    </span>
                  </div>
                  <div className="relative z-10 bg-background/90 p-3 border-2 border-foreground">
                    <h3 className="font-bold text-sm uppercase truncate">
                      {item.title}
                    </h3>
                    <div className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-1">
                      {item.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Work History & Reviews */}
          <section>
            <h2 className="font-heading font-black uppercase tracking-widest text-lg mb-4 flex items-center gap-2 border-b-2 border-border pb-2">
              <Clock className="w-5 h-5 text-primary" /> Work History & Reviews
            </h2>
            <div className="space-y-6">
              {EXPERT.workHistory.map((job, i) => (
                <div
                  key={i}
                  className="bg-card border-2 border-foreground p-6 shadow-[4px_4px_0px_0px_var(--foreground)]"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b-2 border-border pb-4">
                    <div>
                      <h3 className="font-black text-sm uppercase hover:text-primary cursor-pointer transition-colors inline-flex items-center gap-2">
                        {job.title} <ExternalLink className="w-3 h-3" />
                      </h3>
                      <div className="flex items-center gap-3 text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground mt-2">
                        <span>{job.date}</span>
                        <span className="w-1 h-1 bg-border rounded-full" />
                        <span>{job.id}</span>
                      </div>
                    </div>

                    <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1 shrink-0">
                      <div className="font-heading font-black text-lg">
                        {job.earned}
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, idx) => (
                          <Star
                            key={idx}
                            className={cn(
                              "w-3 h-3",
                              idx < job.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-muted text-muted",
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-dashed border-border bg-secondary/10 p-4 text-sm font-semibold italic">
                    "{job.feedback}"
                  </div>
                </div>
              ))}
            </div>

            <NeoButton variant="outline" className="w-full mt-6 h-12">
              Load More History
            </NeoButton>
          </section>
        </div>
      </div>

      {/* Invite Modal (Reused from Marketplace) */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="border-b-4 border-foreground p-6 flex justify-between items-center bg-secondary/30 shrink-0">
              <h2 className="font-heading font-black text-2xl uppercase tracking-widest flex items-center gap-3">
                <UserPlus className="w-6 h-6 text-primary" /> Invite Expert
              </h2>
              <NeoButton
                variant="ghost"
                size="icon"
                onClick={() => setIsInviteOpen(false)}
                className="border-transparent h-8 w-8"
              >
                <X className="w-5 h-5" />
              </NeoButton>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex items-center gap-4 bg-secondary/10 border-2 border-border p-4">
                <div className="w-12 h-12 border-2 border-border bg-background flex items-center justify-center font-heading font-black text-xl shrink-0">
                  {EXPERT.avatar}
                </div>
                <div>
                  <div className="font-heading font-black uppercase text-lg">
                    {EXPERT.name}
                  </div>
                  <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    {EXPERT.title}
                  </div>
                </div>
                <div className="ml-auto font-heading font-black text-primary text-xl">
                  {EXPERT.rate}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2">
                  Select Context
                </label>
                <NeoSelect defaultValue="qt_1">
                  <NeoSelectTrigger className="w-full h-12 text-sm">
                    <NeoSelectValue placeholder="Select a Project or Quick Task" />
                  </NeoSelectTrigger>
                  <NeoSelectContent>
                    <div className="px-2 py-1.5 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary/20">
                      Open Quick Tasks
                    </div>
                    <NeoSelectItem value="qt_1" className="text-sm">
                      Write a Python script for web scraping (QT-889)
                    </NeoSelectItem>
                    <NeoSelectItem value="qt_2" className="text-sm">
                      Data cleaning for ML model (QT-890)
                    </NeoSelectItem>

                    <div className="px-2 py-1.5 text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary/20 mt-2">
                      Active Projects
                    </div>
                    <NeoSelectItem value="proj_1" className="text-sm">
                      Hệ thống Quản lý Doanh nghiệp (PROJ-123)
                    </NeoSelectItem>
                  </NeoSelectContent>
                </NeoSelect>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Invitation
                  Message
                </label>
                <NeoTextarea
                  defaultValue={`Hi ${EXPERT.name},\n\nI reviewed your profile and was impressed by your work history in ${EXPERT.skills.core[0]}. I'd like to invite you to collaborate with us. Let me know if you are available.`}
                  className="min-h-[120px] focus-visible: text-sm font-semibold p-4"
                />
              </div>

              <div className="flex items-start gap-3 p-4 border-2 border-primary bg-primary/5">
                <NeoCheckbox
                  id="terms"
                  defaultChecked
                  className="mt-0.5 data-[state=checked]:bg-primary"
                />
                <label
                  htmlFor="terms"
                  className="text-[0.625rem] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer leading-tight"
                >
                  By sending this invitation, a new direct message will be
                  created in your{" "}
                  <strong className="text-foreground">Global Inbox</strong>.
                </label>
              </div>
            </div>

            <div className="border-t-4 border-foreground p-6 bg-secondary/30 flex gap-4 shrink-0">
              <NeoButton
                variant="outline"
                onClick={() => setIsInviteOpen(false)}
                className="flex-1 h-12"
              >
                Cancel
              </NeoButton>
              <NeoButton
                onClick={() => setIsInviteOpen(false)}
                className="flex-1 h-12"
              >
                Send Invite
              </NeoButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Globe,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  UserPlus,
  Zap,
  X,
  MessageSquare,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoInput } from "@/components/ui-custom/neo-input";
import {
  NeoSelect,
  NeoSelectContent,
  NeoSelectItem,
  NeoSelectTrigger,
  NeoSelectValue,
} from "@/components/ui-custom/neo-select";
import { NeoCheckbox } from "@/components/ui-custom/neo-checkbox";
import { cn } from "@/lib/utils";
import { NeoTextarea } from "@/components/ui-custom/neo-textarea";
import Link from "next/link";

// Mock Data
const EXPERTS = [
  {
    id: "exp_1",
    name: "Alex_Code",
    title: "Senior AI / Python Engineer",
    avatar: "A",
    rate: "$45/hr",
    rating: 4.9,
    reviews: 124,
    completedTasks: 89,
    online: true,
    saved: true,
    location: "Vietnam (UTC+7)",
    skills: ["Python", "Scraping", "LLMs", "FastAPI"],
    badge: "Top Rated",
  },
  {
    id: "exp_2",
    name: "Data_Wizard_99",
    title: "Data Scientist & Analytics Expert",
    avatar: "D",
    rate: "$60/hr",
    rating: 5.0,
    reviews: 42,
    completedTasks: 35,
    online: false,
    saved: false,
    location: "Singapore (UTC+8)",
    skills: ["Data Analysis", "Pandas", "SQL", "Tableau"],
    badge: null,
  },
  {
    id: "exp_3",
    name: "VisionPro_Studio",
    title: "Computer Vision Specialist",
    avatar: "V",
    rate: "$85/hr",
    rating: 4.8,
    reviews: 215,
    completedTasks: 180,
    online: true,
    saved: false,
    location: "United States (UTC-5)",
    skills: ["Computer Vision", "PyTorch", "OpenCV", "YOLO"],
    badge: "Top Rated",
  },
  {
    id: "exp_4",
    name: "Sarah_Fullstack",
    title: "Fullstack Web3 Developer",
    avatar: "S",
    rate: "$50/hr",
    rating: 4.7,
    reviews: 88,
    completedTasks: 76,
    online: true,
    saved: false,
    location: "Remote",
    skills: ["React", "Next.js", "Solidity", "Node.js"],
    badge: null,
  },
  {
    id: "exp_5",
    name: "PromptMaster_X",
    title: "AI Prompt Engineer & Consultant",
    avatar: "P",
    rate: "$30/hr",
    rating: 4.9,
    reviews: 312,
    completedTasks: 290,
    online: false,
    saved: true,
    location: "Remote",
    skills: ["Prompt Engineering", "ChatGPT", "Midjourney", "Copywriting"],
    badge: "Rising Talent",
  },
  {
    id: "exp_6",
    name: "ML_Ops_Guru",
    title: "Machine Learning Operations",
    avatar: "M",
    rate: "$95/hr",
    rating: 5.0,
    reviews: 18,
    completedTasks: 12,
    online: true,
    saved: false,
    location: "Germany (UTC+1)",
    skills: ["MLOps", "AWS", "Docker", "Kubernetes"],
    badge: null,
  },
];

export default function ExpertMarketplacePage() {
  const [savedExperts, setSavedExperts] = useState<Record<string, boolean>>(
    EXPERTS.reduce((acc, exp) => ({ ...acc, [exp.id]: exp.saved }), {}),
  );

  // Modal State
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<
    (typeof EXPERTS)[0] | null
  >(null);

  const openInviteModal = (expert: (typeof EXPERTS)[0]) => {
    setSelectedExpert(expert);
    setIsInviteOpen(true);
  };

  const toggleSave = (id: string) => {
    setSavedExperts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Global Header */}
      <div className="shrink-0 border-b-2 border-border bg-card relative z-20">
        <div className="px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto w-full">
          <h1 className="text-3xl md:text-4xl font-heading font-black tracking-widest uppercase text-foreground flex items-center gap-3">
            <Globe className="w-8 h-8 md:w-10 md:h-10 text-primary" /> Expert
            Marketplace
          </h1>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-2 max-w-2xl">
            Discover and hire the top 1% of AI and Tech talent globally. Filter
            by skills, rates, and reviews to find the perfect match for your
            project.
          </p>
        </div>

        {/* Sticky Filter Bar */}
        <div className="border-t-2 border-border bg-secondary/30 p-4 sticky top-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative w-full lg:w-96 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <NeoInput
                placeholder="Search by name, title, or keywords..."
                className="pl-9 h-10 focus-visible: text-xs"
              />
            </div>

            {/* Filters */}
            <div className="flex w-full overflow-x-auto no-scrollbar gap-3 pb-1 lg:pb-0 items-center">
              <NeoSelect defaultValue="all">
                <NeoSelectTrigger className="w-36 md:w-48 shrink-0 h-10 text-[0.625rem]">
                  <Filter className="w-3 h-3 mr-2" />
                  <NeoSelectValue placeholder="Category" />
                </NeoSelectTrigger>
                <NeoSelectContent>
                  <NeoSelectItem value="all" className="text-[0.625rem]">
                    All Categories
                  </NeoSelectItem>
                  <NeoSelectItem value="ai" className="text-[0.625rem]">
                    AI / Machine Learning
                  </NeoSelectItem>
                  <NeoSelectItem value="data" className="text-[0.625rem]">
                    Data Science
                  </NeoSelectItem>
                  <NeoSelectItem value="web" className="text-[0.625rem]">
                    Web Development
                  </NeoSelectItem>
                </NeoSelectContent>
              </NeoSelect>

              <NeoSelect defaultValue="any">
                <NeoSelectTrigger className="w-32 md:w-40 shrink-0 h-10 text-[0.625rem]">
                  <NeoSelectValue placeholder="Hourly Rate" />
                </NeoSelectTrigger>
                <NeoSelectContent>
                  <NeoSelectItem value="any" className="text-[0.625rem]">
                    Any Rate
                  </NeoSelectItem>
                  <NeoSelectItem value="tier1" className="text-[0.625rem]">
                    Under $20/hr
                  </NeoSelectItem>
                  <NeoSelectItem value="tier2" className="text-[0.625rem]">
                    $20 - $50/hr
                  </NeoSelectItem>
                  <NeoSelectItem value="tier3" className="text-[0.625rem]">
                    $50 - $100/hr
                  </NeoSelectItem>
                </NeoSelectContent>
              </NeoSelect>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                <NeoCheckbox
                  id="online"
                  className="data-[state=checked]:bg-green-500 data-[state=checked]:text-white data-[state=checked]:border-green-500"
                />
                <label
                  htmlFor="online"
                  className="font-bold text-[0.625rem] uppercase tracking-widest cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  Online Now
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-background relative z-10">
        <div className="max-w-7xl mx-auto pb-24">
          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-heading font-black uppercase tracking-widest text-lg">
              Showing 142 Experts
            </h2>
            <div className="flex gap-2">
              <NeoButton variant="outline" className="h-8 px-3 text-[0.625rem]">
                Saved (2)
              </NeoButton>
            </div>
          </div>

          {/* Grid of Expert Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {EXPERTS.map((expert) => (
              <div
                key={expert.id}
                className="bg-card border-2 border-border shadow-[4px_4px_0px_0px_var(--border)] hover:shadow-[6px_6px_0px_0px_var(--primary)] hover:-translate-y-1 hover:-translate-x-1 transition-all flex flex-col group"
              >
                {/* Card Header (Avatar + Rate) */}
                <div className="p-5 border-b-2 border-border flex justify-between items-start bg-secondary/10 relative">
                  {/* Badge */}
                  {expert.badge && (
                    <div className="absolute -top-3 -left-3 bg-purple-500 text-white border-2 border-border px-2 py-1 flex items-center gap-1 shadow-[2px_2px_0px_0px_var(--border)]">
                      <Zap className="w-3 h-3 fill-current" />
                      <span className="text-[0.625rem] font-black uppercase tracking-widest">
                        {expert.badge}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-4 items-center w-full mt-2">
                    <div className="relative shrink-0">
                      <div className="w-16 h-16 border-2 border-border bg-background flex items-center justify-center font-heading font-black text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        {expert.avatar}
                      </div>
                      {expert.online && (
                        <div
                          className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-card rounded-full"
                          title="Online Now"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-heading font-black text-lg uppercase truncate">
                        {expert.name}
                      </h3>
                      <p
                        className="text-xs font-bold text-muted-foreground uppercase truncate"
                        title={expert.title}
                      >
                        {expert.title}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right ml-2 mt-2">
                    <span className="font-heading font-black text-xl text-primary">
                      {expert.rate}
                    </span>
                  </div>
                </div>

                {/* Card Body (Stats + Skills) */}
                <div className="p-5 flex-1 flex flex-col gap-4">
                  {/* Stats Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-black">{expert.rating}</span>
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        ({expert.reviews})
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="font-black text-primary">
                        {expert.completedTasks}
                      </span>
                      <span className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest ml-1">
                        Tasks
                      </span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span className="truncate">{expert.location}</span>
                  </div>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-2 mt-auto pt-2">
                    {expert.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-secondary/50 border-2 border-border px-2 py-1 text-[0.625rem] font-black uppercase tracking-widest"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer (Actions) */}
                <div className="p-4 border-t-2 border-border bg-secondary/5 flex gap-3">
                  <NeoButton
                    variant="outline"
                    size="icon"
                    onClick={() => toggleSave(expert.id)}
                    className={cn(
                      "h-10 w-10 shrink-0",
                      savedExperts[expert.id] ? "" : "text-muted-foreground",
                    )}
                  >
                    {savedExperts[expert.id] ? (
                      <BookmarkCheck className="w-5 h-5" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </NeoButton>
                  <Link
                    href={`/client/experts/${expert.id}`}
                    className="flex-1"
                  >
                    <NeoButton
                      variant="outline"
                      className="w-full h-10 text-[0.625rem]"
                    >
                      View Profile
                    </NeoButton>
                  </Link>
                  <NeoButton
                    onClick={() => openInviteModal(expert)}
                    className="flex-1 h-10 text-[0.625rem]"
                  >
                    <UserPlus className="w-4 h-4 mr-2" /> Invite
                  </NeoButton>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Mock */}
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <NeoButton
                variant="outline"
                disabled
                className="text-xs h-10 px-6"
              >
                Previous
              </NeoButton>
              <NeoButton
                variant="outline"
                className="bg-primary/10 text-xs h-10 w-10 p-0"
              >
                1
              </NeoButton>
              <NeoButton variant="outline" className="text-xs h-10 w-10 p-0">
                2
              </NeoButton>
              <NeoButton variant="outline" className="text-xs h-10 w-10 p-0">
                3
              </NeoButton>
              <NeoButton variant="outline" className="text-xs h-10 px-6">
                Next
              </NeoButton>
            </div>
          </div>
        </div>
      </div>

      {/* Invite Modal (Brutalist Popup) */}
      {isInviteOpen && selectedExpert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border-4 border-foreground shadow-[8px_8px_0px_0px_var(--foreground)] w-full max-w-xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
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

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Expert Summary */}
              <div className="flex items-center gap-4 bg-secondary/10 border-2 border-border p-4">
                <div className="w-12 h-12 border-2 border-border bg-background flex items-center justify-center font-heading font-black text-xl shrink-0">
                  {selectedExpert.avatar}
                </div>
                <div>
                  <div className="font-heading font-black uppercase text-lg">
                    {selectedExpert.name}
                  </div>
                  <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
                    {selectedExpert.title}
                  </div>
                </div>
                <div className="ml-auto font-heading font-black text-primary text-xl">
                  {selectedExpert.rate}
                </div>
              </div>

              {/* Context Selection */}
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
                    <NeoSelectItem value="proj_2" className="text-sm">
                      B2B E-commerce Platform (PROJ-124)
                    </NeoSelectItem>
                  </NeoSelectContent>
                </NeoSelect>
              </div>

              {/* Invitation Message */}
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-foreground block mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" /> Invitation
                  Message
                </label>
                <NeoTextarea
                  defaultValue={`Hi ${selectedExpert.name},\n\nI came across your profile and was impressed by your skills in ${selectedExpert.skills[0]}. I'd like to invite you to collaborate with us. Let me know if you are available.`}
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
                  created in your{""}
                  <strong className="text-foreground">Global Inbox</strong>. You
                  will be notified when the expert responds.
                </label>
              </div>
            </div>

            {/* Modal Footer */}
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

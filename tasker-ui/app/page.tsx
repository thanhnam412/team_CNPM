"use client";

import { useState } from "react";
import Link from "next/link";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { NeoCard as Card } from "@/components/ui-custom/neo-card";
import { NeoBadge as Badge } from "@/components/ui-custom/neo-badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowRight,
  BrainCircuit,
  ChevronRight,
  Code,
  Eye,
  Globe,
  LineChart,
  Lock,
  Quote,
  Settings,
  Sparkles,
  Star,
  StarHalf,
  Terminal,
  TrendingUp,
  User,
  Verified,
  Zap,
} from "lucide-react";

export default function HomePage() {
  const [role, setRole] = useState<"client" | "expert">("client");

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* 1. Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b h-16">
        <div className="flex justify-between items-center h-full px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-2xl font-bold text-primary flex items-center gap-2 tracking-tight">
            <Terminal className="w-8 h-8" strokeWidth={2.5} />
            AITasker
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <NeoButton
              variant="outline"
              asChild
              className="font-mono text-xs uppercase tracking-wider hidden sm:inline-flex"
            >
              <Link href="/expert">Find Work</Link>
            </NeoButton>
            <NeoButton
              asChild
              className="font-mono text-xs uppercase tracking-wider font-bold shadow-sm"
            >
              <Link href="/client">Post a Job</Link>
            </NeoButton>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="lg:w-3/5 text-center lg:text-left">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl leading-[1.1] font-extrabold mb-6 tracking-tight">
              The AI Services Marketplace <br className="hidden lg:block" />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-blue-600">
                Built for Real Projects
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Hire vetted AI experts — LLM, Computer Vision, MLOps, and more.
              <br className="hidden sm:block" />
              Scoped, delivered, and paid securely with enterprise precision.
            </p>

            {/* Dual Pill Toggle */}
            <div className="flex justify-center lg:justify-start mb-10">
              <div className="p-2 flex gap-2 border-2 border-foreground bg-secondary/20 shadow-[4px_4px_0px_0px_var(--foreground)]">
                <NeoButton
                  onClick={() => setRole("client")}
                  variant={role === "client" ? "default" : "ghost"}
                  className={`h-10 text-xs ${role !== "client" && "opacity-50 hover:opacity-100 border-transparent"}`}
                >
                  I NEED AI HELP
                </NeoButton>
                <NeoButton
                  onClick={() => setRole("expert")}
                  variant={role === "expert" ? "default" : "ghost"}
                  className={`h-10 text-xs ${role !== "expert" && "opacity-50 hover:opacity-100 border-transparent"}`}
                >
                  I AM AN EXPERT
                </NeoButton>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <NeoButton
                size="lg"
                asChild
                className="h-14 px-8 text-lg font-bold gap-2"
              >
                <Link href={role === "client" ? "/client" : "/expert"}>
                  {role === "client"
                    ? "Post a Job — Free"
                    : "Find Work — Apply Now"}
                  <ArrowRight className="w-5 h-5 shrink-0" />
                </Link>
              </NeoButton>
            </div>
          </div>

          {/* Floating AI Card */}
          <div className="lg:w-2/5 relative w-full max-w-md mx-auto lg:max-w-full">
            <Card className="p-8 relative overflow-hidden bg-background/50 backdrop-blur-sm">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
                  <span className="font-mono text-[11px] text-primary font-bold uppercase tracking-wider">
                    AI Assistant Active
                  </span>
                </div>
                <Sparkles className="w-5 h-5 text-primary/50" />
              </div>
              <div className="space-y-4">
                <div className="h-4 bg-primary/20 rounded w-full animate-pulse"></div>
                <div className="h-4 bg-primary/20 rounded w-3/4 animate-pulse"></div>
                <div className="pt-6 border-t mt-6">
                  <p className="font-mono text-sm text-muted-foreground italic">
                    &quot;Synthesizing RAG pipeline requirements for an
                    enterprise finance bot...&quot;
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-between items-end">
                <div>
                  <span className="font-mono text-[10px] text-muted-foreground block uppercase tracking-wider mb-1">
                    Project Confidence
                  </span>
                  <span className="font-mono text-sm text-primary font-bold">
                    98.4% Match Accuracy
                  </span>
                </div>
                <div className="w-12 h-12 rounded-lg bg-muted border flex items-center justify-center">
                  <Terminal className="w-6 h-6 text-muted-foreground" />
                </div>
              </div>
            </Card>
            {/* Decorative Glows */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full pointer-events-none"></div>
          </div>
        </div>
      </section>

      {/* 3. Stats Bar */}
      <div className="bg-card border-y py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-wrap justify-between items-center gap-8">
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Total Paid
            </span>
            <span className="font-mono text-2xl font-bold text-primary">
              $2.1M+
            </span>
          </div>
          <div className="w-px h-10 bg-border hidden md:block"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Vetted Experts
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">
              542
            </span>
          </div>
          <div className="w-px h-10 bg-border hidden md:block"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Projects Completed
            </span>
            <span className="font-mono text-2xl font-bold text-foreground">
              1,890
            </span>
          </div>
          <div className="w-px h-10 bg-border hidden md:block"></div>
          <div className="flex flex-col">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
              Avg Match Time
            </span>
            <span className="font-mono text-2xl font-bold text-primary">
              14.5m
            </span>
          </div>
        </div>
      </div>

      {/* 4. Marketplace Preview */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                Marketplace Preview
              </h2>
              <p className="text-muted-foreground">
                Live opportunities in the AI ecosystem.
              </p>
            </div>
            <div className="flex gap-2 p-2 bg-secondary/10 border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
              <NeoButton size="sm" className="font-mono text-xs font-bold">
                JOBS
              </NeoButton>
              <NeoButton
                size="sm"
                variant="ghost"
                className="font-mono text-xs opacity-50 hover:opacity-100 border-transparent"
              >
                SERVICES
              </NeoButton>
              <NeoButton
                size="sm"
                variant="ghost"
                className="font-mono text-xs opacity-50 hover:opacity-100 border-transparent"
              >
                EXPERT PROFILES
              </NeoButton>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <Card className="p-6 flex flex-col h-full relative group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                <span className="font-mono text-[10px] text-primary uppercase font-bold">
                  Trending
                </span>
              </div>
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] uppercase font-bold text-primary bg-primary/10 hover:bg-primary/20"
                >
                  LLM / RAG
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-4 grow group-hover:text-primary transition-colors">
                Custom Fine-tuning for Financial Dataset
              </h3>
              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-foreground font-bold">
                    $2,500 - $5,000
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 2 */}
            <Card className="p-6 flex flex-col h-full group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] uppercase font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300"
                >
                  Computer Vision
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-4 grow group-hover:text-primary transition-colors">
                Edge Deployment for Retail Analytics
              </h3>
              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-foreground font-bold">
                    $4,000+
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 3 */}
            <Card className="p-6 flex flex-col h-full group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] uppercase font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300"
                >
                  MLOps
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-4 grow group-hover:text-primary transition-colors">
                Kubeflow Pipeline Optimization
              </h3>
              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-foreground font-bold">
                    $80 - $120/hr
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>

            {/* Card 4 */}
            <Card className="p-6 flex flex-col h-full group hover:border-primary/50 transition-colors cursor-pointer shadow-sm">
              <div className="mb-4">
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] uppercase font-bold"
                >
                  Ethics / Compliance
                </Badge>
              </div>
              <h3 className="text-lg font-bold mb-4 grow group-hover:text-primary transition-colors">
                AI Safety Audit for Healthcare App
              </h3>
              <div className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-sm text-foreground font-bold">
                    Bidding Open
                  </span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. AI Category Grid */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 md:mb-16 text-center tracking-tight">
            Specialized Expertise
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <Card className="p-8 hover:border-primary/50 transition-all cursor-pointer">
              <BrainCircuit
                className="w-10 h-10 text-primary mb-6"
                strokeWidth={1.5}
              />
              <h4 className="text-xl font-bold mb-3">LLM &amp; GenAI</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                RAG, Agents, Fine-tuning, Prompt Engineering.
              </p>
            </Card>
            <Card className="p-8 hover:border-primary/50 transition-all cursor-pointer">
              <Eye className="w-10 h-10 text-primary mb-6" strokeWidth={1.5} />
              <h4 className="text-xl font-bold mb-3">Computer Vision</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Detection, Segmentation, OCR, Generative Video.
              </p>
            </Card>
            <Card className="p-8 hover:border-primary/50 transition-all cursor-pointer">
              <Settings
                className="w-10 h-10 text-primary mb-6"
                strokeWidth={1.5}
              />
              <h4 className="text-xl font-bold mb-3">MLOps</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Deployment, Monitoring, CI/CD for ML pipelines.
              </p>
            </Card>
            <Card className="p-8 hover:border-primary/50 transition-all cursor-pointer">
              <LineChart
                className="w-10 h-10 text-primary mb-6"
                strokeWidth={1.5}
              />
              <h4 className="text-xl font-bold mb-3">Predictive Analytics</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Forecasting, Churn Analysis, Supply Chain.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-20 md:py-24 bg-muted/20 border-y">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* For Clients */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  For Clients
                </h2>
                <Badge className="font-mono text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary hover:bg-primary/20">
                  HIRING
                </Badge>
              </div>
              <div className="space-y-10 md:space-y-12 border-l-2 border-border pl-8 md:pl-10 ml-4 md:ml-5 relative">
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
                    1
                  </span>
                  <h4 className="text-xl font-bold mb-2">Post with AI Help</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Describe your needs and our assistant writes a detailed
                    technical scope.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
                    2
                  </span>
                  <h4 className="text-xl font-bold mb-2">Smart Matching</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Review pre-vetted experts whose stack perfectly matches your
                    project.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
                    3
                  </span>
                  <h4 className="text-xl font-bold mb-2">
                    Secure Milestone Escrow
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Funds are held by AITasker and only released upon your
                    approval of code.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-primary shadow-[2px_2px_0px_0px_var(--foreground)]">
                    4
                  </span>
                  <h4 className="text-xl font-bold mb-2">
                    Iterate &amp; Scale
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Re-hire top talent for long-term support through your
                    ProjectSpace.
                  </p>
                </div>
              </div>
            </div>

            {/* For Experts */}
            <div className="space-y-10">
              <div className="flex items-center gap-4">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  For Experts
                </h2>
                <Badge
                  variant="secondary"
                  className="font-mono text-[10px] font-bold uppercase tracking-wider"
                >
                  WORKING
                </Badge>
              </div>
              <div className="space-y-10 md:space-y-12 border-l-2 border-border pl-8 md:pl-10 ml-4 md:ml-5 relative">
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                    1
                  </span>
                  <h4 className="text-xl font-bold mb-2">
                    Apply &amp; Pass Vetting
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Showcase your GitHub and verify your expertise in specific
                    AI domains.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                    2
                  </span>
                  <h4 className="text-xl font-bold mb-2">
                    Claim High-Value Jobs
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    No more "logo design" spam. Only enterprise-grade AI
                    technical tasks.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                    3
                  </span>
                  <h4 className="text-xl font-bold mb-2">Expert Workspace</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Manage GPU credits, API keys, and deliverables in one
                    technical dashboard.
                  </p>
                </div>
                <div className="relative">
                  <span className="absolute -left-[50px] md:-left-[60px] top-0 w-10 h-10 rounded-none bg-background border-2 border-foreground flex items-center justify-center font-mono font-bold text-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                    4
                  </span>
                  <h4 className="text-xl font-bold mb-2">Instant Payouts</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    Once milestones are approved, funds are available in your
                    wallet instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Feature Strip */}
      <section className="py-20 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-8 md:p-10 border-t-4 border-t-primary transition-shadow">
            <Sparkles className="w-10 h-10 text-primary mb-6" />
            <h4 className="text-xl font-bold mb-3">AI Job Assistant</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              We use enterprise LLMs to translate your business goals into
              technical requirements for experts.
            </p>
          </Card>
          <Card className="p-8 md:p-10 border-t-4 border-t-foreground transition-shadow">
            <BrainCircuit className="w-10 h-10 text-foreground mb-6" />
            <h4 className="text-xl font-bold mb-3">Smart Expert Matching</h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Our algorithm ranks experts based on actual repo history and
              verified project performance.
            </p>
          </Card>
          <Card className="p-8 md:p-10 border-t-4 border-t-blue-500 transition-shadow">
            <Lock className="w-10 h-10 text-blue-500 mb-6" />
            <h4 className="text-xl font-bold mb-3">
              Escrow &amp; IP Protection
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Built-in NDAs and code escrow ensure your proprietary data and
              models remain yours.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. Expert Spotlight */}
      <section className="py-20 md:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="text-3xl font-bold mb-12 md:mb-16 text-center tracking-tight">
            Top Rated AI Engineers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Expert 1 */}
            <Card className="p-6 flex items-center gap-5 group cursor-pointer hover:border-primary/50 transition-colors">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 grayscale group-hover:grayscale-0 transition-all duration-300 rounded-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                <AvatarImage
                  src="https://i.pravatar.cc/150?u=alex"
                  alt="Alex K."
                />
                <AvatarFallback>AK</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                    Alex K.
                  </h4>
                  <Verified className="w-4 h-4 text-primary fill-primary" />
                </div>
                <p className="font-mono text-[10px] text-primary uppercase font-bold tracking-wider mb-2">
                  MLOps Specialist
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="font-mono text-xs font-bold">
                    5.0 (42 projects)
                  </span>
                </div>
              </div>
            </Card>
            {/* Expert 2 */}
            <Card className="p-6 flex items-center gap-5 group cursor-pointer hover:border-primary/50 transition-colors">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 grayscale group-hover:grayscale-0 transition-all duration-300 rounded-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                <AvatarImage
                  src="https://i.pravatar.cc/150?u=sarah"
                  alt="Sarah L."
                />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                    Sarah L.
                  </h4>
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
                  LLM / NLP Lead
                </p>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="font-mono text-xs font-bold">
                    4.9 (88 projects)
                  </span>
                </div>
              </div>
            </Card>
            {/* Expert 3 */}
            <Card className="p-6 flex items-center gap-5 group cursor-pointer hover:border-primary/50 transition-colors">
              <Avatar className="w-16 h-16 md:w-20 md:h-20 grayscale group-hover:grayscale-0 transition-all duration-300 rounded-none border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                <AvatarImage
                  src="https://i.pravatar.cc/150?u=david"
                  alt="David M."
                />
                <AvatarFallback>DM</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <h4 className="text-lg font-bold group-hover:text-primary transition-colors">
                    David M.
                  </h4>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                </div>
                <p className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider mb-2">
                  Vision / Robotics
                </p>
                <div className="flex items-center gap-1">
                  <StarHalf className="w-3.5 h-3.5 text-primary fill-primary" />
                  <span className="font-mono text-xs font-bold italic">
                    Rising Talent
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 9. Affiliate Banner */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-primary text-primary-foreground rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden relative shadow-xl">
          <div className="relative z-10 text-center md:text-left selection:bg-primary-foreground/30! selection:text-primary-foreground!">
            <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              Share the Intelligence
            </h3>
            <p className="text-primary-foreground/90 max-w-md text-base md:text-lg">
              Join our enterprise affiliate program. Earn 10% on every contract
              for 12 months when you refer clients or experts.
            </p>
          </div>
          <NeoButton
            variant="secondary"
            size="lg"
            className="relative z-10 px-8 md:px-10 py-6 text-lg font-bold"
          >
            Become a Partner
          </NeoButton>
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none hidden md:block">
            <Globe className="w-[300px] h-[300px] absolute -right-10 -top-10" />
          </div>
        </div>
      </section>

      {/* 10. Workspace Directional Banners */}
      <section className="py-20 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Client ProjectSpace */}
          <Link href="/client" className="block">
            <Card className="relative group cursor-pointer overflow-hidden p-8 md:p-12 hover:border-primary/50 transition-all h-full">
              <div className="relative z-10">
                <span className="font-mono text-[11px] text-primary mb-6 block font-bold tracking-widest uppercase">
                  CLIENT DASHBOARD
                </span>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  Your ProjectSpace
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm">
                  Track milestones, approve deliverables, and communicate with
                  your AI team in a secure, unified environment.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-primary group-hover:gap-4 transition-all">
                  Enter ProjectSpace <ArrowRight className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            </Card>
          </Link>

          {/* Expert Workspace */}
          <Link href="/expert" className="block">
            <Card className="relative group cursor-pointer overflow-hidden p-8 md:p-12 hover:border-foreground/30 transition-all bg-muted/30 h-full">
              <div className="relative z-10">
                <span className="font-mono text-[11px] text-foreground mb-6 block font-bold tracking-widest uppercase">
                  EXPERT DASHBOARD
                </span>
                <h3 className="text-3xl font-bold mb-4 tracking-tight">
                  Your Workspace
                </h3>
                <p className="text-muted-foreground mb-8 leading-relaxed max-w-sm">
                  Manage code reviews, access high-performance compute credits,
                  and track your global AI impact.
                </p>
                <span className="inline-flex items-center gap-2 font-bold text-foreground group-hover:gap-4 transition-all">
                  Enter Workspace <ArrowRight className="w-5 h-5" />
                </span>
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-foreground/5 blur-[100px] rounded-full pointer-events-none"></div>
            </Card>
          </Link>
        </div>
      </section>

      {/* 11. Testimonials */}
      <section className="py-20 md:py-24 bg-muted/20 border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <Card className="p-8 md:p-12 relative border-foreground">
              <Quote className="w-16 h-16 text-primary/10 absolute top-6 right-8" />
              <p className="text-lg md:text-xl font-medium text-foreground italic mb-10 relative z-10 leading-relaxed">
                "Finding niche MLOps talent was a nightmare until AITasker. We
                found an expert who optimized our latency by 40% in just two
                weeks."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="text-lg font-bold">Marcus Chen</h5>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Founder, Stealth AI Startup
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-8 md:p-12 relative border-foreground">
              <Quote className="w-16 h-16 text-foreground/5 absolute top-6 right-8" />
              <p className="text-lg md:text-xl font-medium text-foreground italic mb-10 relative z-10 leading-relaxed">
                "The quality of technical briefs is unmatched. I don't have to
                waste time explaining what a Transformer is to the platform; it
                just works."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center border">
                  <Code className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h5 className="text-lg font-bold">Elena Rostova</h5>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    Senior AI Engineer
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 py-20 md:py-24 border-t">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div className="text-2xl font-black text-foreground flex items-center gap-2">
              <Terminal className="w-7 h-7 text-primary" strokeWidth={2.5} />
              AITasker
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              © 2024 AITasker. Intelligence-first specialized marketplace for
              the age of enterprise AI.
            </p>
          </div>
          <div>
            <h6 className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest mb-6">
              Marketplace
            </h6>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Find Work
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Expert Resources
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Workspace
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest mb-6">
              Platform
            </h6>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Create Profile
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h6 className="font-mono text-[11px] text-foreground font-bold uppercase tracking-widest mb-6">
              Company
            </h6>
            <ul className="space-y-4">
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                >
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

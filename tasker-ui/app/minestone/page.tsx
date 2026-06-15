"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Timeline,
  TimelineContent,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle,
} from "@/components/ui/timeline";
import {
  Briefcase,
  Check,
  CheckCircle,
  CircleDot,
  Download,
  FileText,
  MessageSquare,
  Timer,
  User,
} from "lucide-react";

export default function ContractLayout() {
  return (
    <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      {/* Auto-approve Banner */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start sm:items-center gap-3">
        <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-0" />
        <div className="flex-1">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            Auto-approving in{" "}
            <strong className="font-semibold">3 days, 14 hours</strong>. Please
            review.
          </p>
        </div>
        <Button
          variant="link"
          className="text-blue-600 dark:text-blue-400 p-0 h-auto font-medium shrink-0"
        >
          Review Now
        </Button>
      </div>

      {/* Page Header */}
      <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            E-commerce Platform Development
          </h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            Contract Workspace
          </p>
        </div>

        {/* Escrow Summary Card */}
        <Card className="min-w-[300px] shadow-sm">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Escrow Balance
              </span>
              <span className="text-2xl font-bold text-primary">$1,500</span>
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/30"></span>
                $500 Released
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary"></span>
                $1,000 In Escrow
              </div>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
              <div
                className="h-full bg-muted-foreground/30"
                style={{ width: "33.33%" }}
              ></div>
              <div
                className="h-full bg-primary"
                style={{ width: "66.67%" }}
              ></div>
            </div>
          </CardContent>
        </Card>
      </header>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Timeline & Milestones */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Milestones
          </h2>

          <Timeline defaultValue={2}>
            {/* MILESTONE 1: Completed */}
            <TimelineItem step={1}>
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
                <TimelineTitle className="text-muted-foreground">
                  Milestone 1
                </TimelineTitle>

                <TimelineIndicator className="bg-muted text-muted-foreground group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                  <Check className="size-3.5" />
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent>
                <Card className="opacity-75">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          Project Kickoff & Setup
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Completed on Oct 12, 2024
                        </p>
                      </div>
                      <Badge variant="secondary">Completed</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 border-t">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Amount: $500</span>
                      <span>Funds Released</span>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>

            {/* MILESTONE 2: Awaiting Approval (Active) */}
            <TimelineItem step={2}>
              <TimelineHeader>
                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
                <TimelineTitle className="text-primary">
                  Milestone 2
                </TimelineTitle>

                <TimelineIndicator className="bg-background text-primary ring-2 ring-primary/20 flex size-6 items-center justify-center border-2 border-primary group-data-[orientation=vertical]/timeline:-left-7">
                  <CircleDot className="size-3.5" />
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent>
                <Card className="border-primary/50 shadow-md ring-1 ring-primary/20 overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">
                          UI/UX Design Approval
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Submitted on Oct 25, 2024
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 gap-1.5 border-transparent"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                        Awaiting Approval
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-0">
                    <p className="text-sm mb-6">
                      The initial design files and specifications are ready for
                      your review. Please check the attached documents before
                      approving the release of funds for this phase.
                    </p>

                    {/* Deliverables Area */}
                    <div className="bg-muted/50 rounded-lg border p-4 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Deliverables
                        </h4>
                        <Button
                          variant="link"
                          className="h-auto p-0 text-xs gap-1"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download All
                        </Button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3">
                        {/* File 1 */}
                        <div className="flex items-center gap-3 p-3 bg-background border rounded-md flex-1 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">design_v1.fig</p>
                            <p className="text-xs text-muted-foreground">
                              12.4 MB
                            </p>
                          </div>
                        </div>
                        {/* File 2 */}
                        <div className="flex items-center gap-3 p-3 bg-background border rounded-md flex-1 hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">specs.pdf</p>
                            <p className="text-xs text-muted-foreground">
                              2.1 MB
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>

                  {/* Actions */}
                  <div className="bg-muted/30 border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                    <span className="text-sm font-medium">
                      Amount to Release: $500
                    </span>
                    <div className="flex w-full sm:w-auto gap-3">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Request Changes
                      </Button>
                      <Button className="w-full sm:w-auto gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Approve & Release Funds
                      </Button>
                    </div>
                  </div>
                </Card>
              </TimelineContent>
            </TimelineItem>

            {/* MILESTONE 3: Upcoming */}
            <TimelineItem step={3}>
              <TimelineHeader>
                <TimelineTitle className="text-muted-foreground">
                  Milestone 3
                </TimelineTitle>
                <TimelineIndicator className="bg-muted text-muted-foreground flex size-6 items-center justify-center border-2 border-border group-data-[orientation=vertical]/timeline:-left-7">
                  <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
                </TimelineIndicator>
              </TimelineHeader>

              <TimelineContent>
                <Card className="opacity-60 bg-muted/30">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <CardTitle className="text-lg text-muted-foreground">
                          Backend Integration
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Est. Nov 15, 2024
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className="text-muted-foreground bg-transparent"
                      >
                        Upcoming
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span>Amount: $500</span>
                    </div>
                  </CardContent>
                </Card>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </div>

        {/* Right Column: Side Panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Freelancer Info */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contractor
              </h4>
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-12 h-12 border">
                  <AvatarImage src="" alt="Alex Mercer" />
                  <AvatarFallback className="bg-muted">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Alex Mercer</p>
                  <p className="text-sm text-muted-foreground">
                    Full-Stack Developer
                  </p>
                </div>
              </div>
              <Button variant="outline" className="w-full gap-2">
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Contract Details
              </h4>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm text-muted-foreground mb-1">
                    Total Contract Value
                  </dt>
                  <dd className="text-base font-medium">$1,500.00</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground mb-1">
                    Start Date
                  </dt>
                  <dd className="text-base">Oct 10, 2024</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground mb-1">
                    Contract ID
                  </dt>
                  <dd className="text-sm font-mono">CTR-88291-A</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

const A = (
  <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
    {/* Auto-approve Banner */}
    <div className="mb-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 flex items-start sm:items-center gap-3">
      <Timer className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 sm:mt-0" />
      <div className="flex-1">
        <p className="text-sm text-blue-900 dark:text-blue-200">
          Auto-approving in{" "}
          <strong className="font-semibold">3 days, 14 hours</strong>. Please
          review.
        </p>
      </div>
      <Button
        variant="link"
        className="text-blue-600 dark:text-blue-400 p-0 h-auto font-medium shrink-0"
      >
        Review Now
      </Button>
    </div>

    {/* Page Header */}
    <header className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          E-commerce Platform Development
        </h1>
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Briefcase className="w-4 h-4" />
          Contract Workspace
        </p>
      </div>

      {/* Escrow Summary Card */}
      <Card className="min-w-[300px] shadow-sm">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Escrow Balance
            </span>
            <span className="text-2xl font-bold text-primary">$1,500</span>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30"></span>
              $500 Released
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              $1,000 In Escrow
            </div>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden flex">
            <div
              className="h-full bg-muted-foreground/30"
              style={{ width: "33.33%" }}
            ></div>
            <div
              className="h-full bg-primary"
              style={{ width: "66.67%" }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </header>

    {/* Main Grid Layout */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Timeline & Milestones */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Milestones
        </h2>

        <Timeline defaultValue={2}>
          {/* MILESTONE 1: Completed */}
          <TimelineItem step={1}>
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
              <TimelineTitle className="text-muted-foreground">
                Milestone 1
              </TimelineTitle>

              <TimelineIndicator className="bg-muted text-muted-foreground group-data-completed/timeline-item:bg-primary group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center border-none group-data-[orientation=vertical]/timeline:-left-7">
                <Check className="size-3.5" />
              </TimelineIndicator>
            </TimelineHeader>

            <TimelineContent>
              <Card className="opacity-75">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Project Kickoff & Setup
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Completed on Oct 12, 2024
                      </p>
                    </div>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 border-t">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Amount: $500</span>
                    <span>Funds Released</span>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>

          {/* MILESTONE 2: Awaiting Approval (Active) */}
          <TimelineItem step={2}>
            <TimelineHeader>
              <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem-0.25rem)] group-data-[orientation=vertical]/timeline:translate-y-7" />
              <TimelineTitle className="text-primary">
                Milestone 2
              </TimelineTitle>

              <TimelineIndicator className="bg-background text-primary ring-2 ring-primary/20 flex size-6 items-center justify-center border-2 border-primary group-data-[orientation=vertical]/timeline:-left-7">
                <CircleDot className="size-3.5" />
              </TimelineIndicator>
            </TimelineHeader>

            <TimelineContent>
              <Card className="border-primary/50 shadow-md ring-1 ring-primary/20 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        UI/UX Design Approval
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Submitted on Oct 25, 2024
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 gap-1.5 border-transparent"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse"></span>
                      Awaiting Approval
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="pb-0">
                  <p className="text-sm mb-6">
                    The initial design files and specifications are ready for
                    your review. Please check the attached documents before
                    approving the release of funds for this phase.
                  </p>

                  {/* Deliverables Area */}
                  <div className="bg-muted/50 rounded-lg border p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Deliverables
                      </h4>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-xs gap-1"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download All
                      </Button>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {/* File 1 */}
                      <div className="flex items-center gap-3 p-3 bg-background border rounded-md flex-1 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">design_v1.fig</p>
                          <p className="text-xs text-muted-foreground">
                            12.4 MB
                          </p>
                        </div>
                      </div>
                      {/* File 2 */}
                      <div className="flex items-center gap-3 p-3 bg-background border rounded-md flex-1 hover:bg-muted/50 transition-colors cursor-pointer">
                        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">specs.pdf</p>
                          <p className="text-xs text-muted-foreground">
                            2.1 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Actions */}
                <div className="bg-muted/30 border-t p-4 flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
                  <span className="text-sm font-medium">
                    Amount to Release: $500
                  </span>
                  <div className="flex w-full sm:w-auto gap-3">
                    <Button variant="outline" className="w-full sm:w-auto">
                      Request Changes
                    </Button>
                    <Button className="w-full sm:w-auto gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Approve & Release Funds
                    </Button>
                  </div>
                </div>
              </Card>
            </TimelineContent>
          </TimelineItem>

          {/* MILESTONE 3: Upcoming */}
          <TimelineItem step={3}>
            <TimelineHeader>
              <TimelineTitle className="text-muted-foreground">
                Milestone 3
              </TimelineTitle>
              <TimelineIndicator className="bg-muted text-muted-foreground flex size-6 items-center justify-center border-2 border-border group-data-[orientation=vertical]/timeline:-left-7">
                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50"></div>
              </TimelineIndicator>
            </TimelineHeader>

            <TimelineContent>
              <Card className="opacity-60 bg-muted/30">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-lg text-muted-foreground">
                        Backend Integration
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Est. Nov 15, 2024
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-muted-foreground bg-transparent"
                    >
                      Upcoming
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span>Amount: $500</span>
                  </div>
                </CardContent>
              </Card>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      </div>

      {/* Right Column: Side Panel */}
      <div className="lg:col-span-4 space-y-6">
        {/* Freelancer Info */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Contractor
            </h4>
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="w-12 h-12 border">
                <AvatarImage src="" alt="Alex Mercer" />
                <AvatarFallback className="bg-muted">
                  <User className="w-6 h-6 text-muted-foreground" />
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Alex Mercer</p>
                <p className="text-sm text-muted-foreground">
                  Full-Stack Developer
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full gap-2">
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card>
          <CardContent className="p-6">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Contract Details
            </h4>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-muted-foreground mb-1">
                  Total Contract Value
                </dt>
                <dd className="text-base font-medium">$1,500.00</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground mb-1">
                  Start Date
                </dt>
                <dd className="text-base">Oct 10, 2024</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground mb-1">
                  Contract ID
                </dt>
                <dd className="text-sm font-mono">CTR-88291-A</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  </main>
);

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  Target,
  Package,
  Braces,
  Code,
  FileText,
  Gavel,
  Lock,
} from "lucide-react";

export function ApproveMilestoneClient() {
  return (
    <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <Badge
                variant="secondary"
                className="gap-1.5 rounded-full uppercase tracking-wider text-xs font-semibold px-2.5 py-1"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                Pending Client Approval
              </Badge>
              <span className="text-muted-foreground text-sm font-medium">
                Submitted 2 hours ago by Expert
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Core AI Chatbot Development
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button variant="outline" className="h-10 px-4">
              Request Changes
            </Button>
            <Button className="h-10 px-4 gap-2 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              Approve &amp; Secure Funds
            </Button>
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Column (Takes up 2/3 of the width on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Definition & Goals Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Target className="w-5 h-5 text-primary" />
                  Definition &amp; Goals
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Primary Goal
                  </h4>
                  <p className="text-base font-medium text-foreground">
                    Build AI chatbot
                  </p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                    Description
                  </h4>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    Development of the core conversational engine utilizing
                    specialized LLM agents. This milestone covers the initial
                    architecture, integration of basic cognitive skills, and
                    foundational routing logic required for the alpha release.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Scope & Deliverables Card */}
            <Card className="shadow-sm">
              <CardHeader className="border-b pb-4 mb-4">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Package className="w-5 h-5 text-primary" />
                  Scope &amp; Deliverables
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-4">
                    Deliverables Submitted
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 p-3.5 rounded-lg bg-muted/40 border">
                      <Braces className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">
                          API
                        </p>
                        <p className="text-sm text-muted-foreground">
                          RESTful endpoints for chatbot interaction.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3.5 rounded-lg bg-muted/40 border">
                      <Code className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">
                          Source code
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Repository access granted via GitHub.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-3.5 rounded-lg bg-muted/40 border">
                      <FileText className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-foreground mb-0.5">
                          Documentation
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Integration guide and architecture diagram.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-base font-semibold text-foreground mb-4">
                    Acceptance Criteria
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors group border border-transparent hover:border-border">
                      <Checkbox id="criteria-1" className="mt-0.5" />
                      <Label
                        htmlFor="criteria-1"
                        className="text-sm font-medium leading-normal cursor-pointer group-hover:text-primary transition-colors"
                      >
                        API works seamlessly with frontend staging environment.
                      </Label>
                    </div>
                    <div className="flex items-start gap-3 p-2.5 rounded-md hover:bg-muted/50 transition-colors group border border-transparent hover:border-border">
                      <Checkbox id="criteria-2" className="mt-0.5" />
                      <Label
                        htmlFor="criteria-2"
                        className="text-sm font-medium leading-normal cursor-pointer group-hover:text-primary transition-colors"
                      >
                        Response time is &lt; 3s under standard load test.
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info Panel Column */}
          <div className="space-y-6">
            {/* Financial & Contract Card */}
            <Card className="relative overflow-hidden shadow-sm">
              {/* Subtle decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-bl-full pointer-events-none"></div>

              <CardHeader className="border-b pb-4 mb-4 relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Gavel className="w-5 h-5 text-primary" />
                  Contract Terms
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-5 relative z-10">
                <div className="flex justify-between items-center pb-3 border-b border-dashed">
                  <span className="text-sm text-muted-foreground font-medium">
                    Deadline
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    Dec 15, 2024
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-dashed">
                  <span className="text-sm text-muted-foreground font-medium">
                    Payment Amount
                  </span>
                  <span className="text-xl font-black text-primary">
                    $5,000.00
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-dashed">
                  <span className="text-sm text-muted-foreground font-medium">
                    Revision Limit
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    2 Revisions
                  </span>
                </div>

                {/* Escrow Impact Alert */}
                <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/20">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-blue-900 dark:text-blue-200 mb-1.5">
                        Escrow Impact
                      </h4>
                      <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                        Approving this milestone will secure{" "}
                        <strong className="font-bold text-blue-950 dark:text-blue-100">
                          $5,000.00
                        </strong>{" "}
                        in escrow for the Expert. Funds will not be released
                        until final project sign-off.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Expert Info Mini-Card */}
            <Card className="p-5 flex items-center gap-4 shadow-sm">
              <Avatar className="w-14 h-14 border-2 border-background shadow-sm">
                <AvatarImage
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCy8IPe6Q2Bq1fI3o8zOHAXH7g8xlg-p-kORRgo8EElOD-NOOd2bBqOlTKR-K_GVPuiRmfz9B-Xpe3_sg1OHg6K5jnY3vFvRxmQvDbZm_oYS-tptwBJkSab7py0NopvjXsZdwrY7GNHvYcuug1jwCe_PrNTmSce_VZZR9LG7VVrPhlc96k2AIvdc-tPDVtmYUaf8y3cYjDjXmaFlQ0WRblHGen8yCPSFImLfKDuWZWhJS8HJ9rYJ0OAXaPqTBKHSuEFMOV0HQwZe9I"
                  alt="Elena Rodriguez"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1">
                  Submitted By
                </p>
                <p className="text-base font-bold text-foreground leading-none mb-1">
                  Elena Rodriguez
                </p>
                <p className="text-xs font-medium text-primary">
                  AI Solutions Architect
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

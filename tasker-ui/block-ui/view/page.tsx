"use client";

import React, { useState } from "react";
import {
  Bell,
  Settings,
  FileText,
  Package,
  Code,
  ExternalLink,
  Download,
  ClipboardCheck,
  CheckCircle,
  Edit,
  AlertTriangle,
  LogOut,
  SearchIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  NeoDropdownMenu,
  NeoDropdownMenuContent,
  NeoDropdownMenuItem,
  NeoDropdownMenuSeparator,
  NeoDropdownMenuTrigger,
} from "@/components/ui-custom/neo-dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";

export default function MilestoneReviewPage() {
  const [showRevisionPanel, setShowRevisionPanel] = useState(false);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col">
      <header className="bg-surface dark:bg-on-background w-full h-16 border-b border-outline-variant dark:border-outline flex justify-between items-center px-6 mx-auto shrink-0 z-50 sticky top-0">
        <InputGroup>
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>

        <Button>Create Project</Button>
        <Button variant="ghost" size="icon">
          <Bell />
        </Button>

        <NeoDropdownMenu>
          <NeoDropdownMenuTrigger
            render={() => (
              <Button variant="ghost" size="icon">
                <Settings />
              </Button>
            )}
          />
          <NeoDropdownMenuContent align="end">
            <NeoDropdownMenuItem>Settings</NeoDropdownMenuItem>
            <NeoDropdownMenuItem>Preferences</NeoDropdownMenuItem>
            <NeoDropdownMenuSeparator />
            <NeoDropdownMenuItem>Logout</NeoDropdownMenuItem>
          </NeoDropdownMenuContent>
        </NeoDropdownMenu>

        <NeoDropdownMenu>
          <NeoDropdownMenuTrigger>
            <Avatar>
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
          </NeoDropdownMenuTrigger>
          <NeoDropdownMenuContent align="end">
            <NeoDropdownMenuItem>Profile</NeoDropdownMenuItem>
            <NeoDropdownMenuItem>Account Settings</NeoDropdownMenuItem>
            <NeoDropdownMenuSeparator />
            <NeoDropdownMenuItem>
              <LogOut />
              Logout
            </NeoDropdownMenuItem>
          </NeoDropdownMenuContent>
        </NeoDropdownMenu>
      </header>

      <div className="grid grid-cols-1 gap-6 p-4 md:grid-cols-3 grid-rows-[max-content] lg:p-6">
        <div className="flex flex-col gap-4 md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <Package />
                Deliverables Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/50">
                <Code className="text-primary size-6" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-label-md text-label-md text-on-background font-bold mb-1">
                  API (RESTful endpoints)
                </h4>
                <p>
                  Complete set of endpoints for chat completion, context
                  management, and user history.
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Download />
              </Button>

              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/50">
                <Package className="text-primary size-6" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-label-md text-label-md text-on-background font-bold mb-1">
                  Source code (GitHub repository)
                </h4>
                <p>
                  Access granted to the main repository branch release/v1.0.
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <ExternalLink />
              </Button>

              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/50">
                <FileText className="text-primary size-6" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-label-md text-label-md text-on-background font-bold mb-1">
                  Documentation (PDF)
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Technical architecture, integration guide, and API reference
                  manual.
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <Download />
              </Button>

              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/50">
                <ExternalLink className="text-primary size-6" />
              </div>
              <div className="flex-1 pt-1">
                <h4 className="font-label-md text-label-md text-on-background font-bold mb-1">
                  Demo Link
                </h4>
                <a
                  className="font-body-sm text-body-sm text-primary hover:underline block truncate w-full md:w-auto"
                  href="#"
                >
                  staging-env.example.com
                </a>
              </div>
              <Button variant="ghost" size="icon">
                <ExternalLink />
              </Button>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                <ClipboardCheck />
                Acceptance Criteria Checklist
              </CardTitle>
              <CardDescription>
                Verify the following criteria before approving the milestone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3 cursor-pointer group">
                <Checkbox id="nlu-engine" />
                <label
                  htmlFor="nlu-engine"
                  className="font-body-md text-body-md text-on-background group-hover:text-primary transition-colors cursor-pointer"
                >
                  NLU Engine integrated with 95% accuracy
                </label>
              </div>
              <div className="flex items-start gap-3 cursor-pointer group">
                <Checkbox id="api-latency" />
                <label
                  htmlFor="api-latency"
                  className="font-body-md text-body-md text-on-background group-hover:text-primary transition-colors cursor-pointer"
                >
                  API latency &lt; 200ms
                </label>
              </div>
              <div className="flex items-start gap-3 cursor-pointer group">
                <Checkbox id="unit-testing" />
                <label
                  htmlFor="unit-testing"
                  className="font-body-md text-body-md text-on-background group-hover:text-primary transition-colors cursor-pointer"
                >
                  Comprehensive unit testing &gt; 80%
                </label>
              </div>
              <div className="flex items-start gap-3 cursor-pointer group">
                <Checkbox id="deployment-docs" />
                <label
                  htmlFor="deployment-docs"
                  className="font-body-md text-body-md text-on-background group-hover:text-primary transition-colors cursor-pointer"
                >
                  Deployment documentation updated
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Milestone Decision</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <p className="text-sm text-muted-foreground">MILESTONE VALUE</p>

                <p className="text-lg font-semibold">$5,000.00</p>
              </CardHeader>

              <CardContent>
                <Progress value={75} />
                <p className="text-sm text-muted-foreground not-first:mt-6">
                  <span className="text-sm font-medium text-foreground">
                    75%
                  </span>{" "}
                  of Total Contract
                </p>
              </CardContent>
            </Card>
            <div className="space-y-4 ">
              <Button className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve &amp; Release Funds
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Releasing $5,000.00 from escrow to the provider.
              </p>

              <div className="space-y-3 border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowRevisionPanel(!showRevisionPanel)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Request Revision
                </Button>

                {showRevisionPanel && (
                  <div className="space-y-3 animate-in fade-in">
                    <Textarea placeholder="Provide specific feedback on what needs to be changed..." />

                    <Button variant="secondary" className="w-full">
                      Send Feedback
                    </Button>
                  </div>
                )}

                <Button
                  variant="ghost"
                  className="w-full text-destructive hover:text-destructive"
                >
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Reject &amp; Raise Dispute
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

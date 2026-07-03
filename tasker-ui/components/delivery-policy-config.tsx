"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  BadgeCheck,
  CalendarCheck,
  ChevronRight,
  CloudSync,
  Info,
  Lock,
  Settings,
  Shield,
  ShieldCheck,
} from "lucide-react";

export function DeliveryPolicyConfig() {
  const [deliveryMode, setDeliveryMode] = useState<"platform" | "private">(
    "platform",
  );
  const [ackChecked, setAckChecked] = useState(false);

  return (
    <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2 text-muted-foreground text-sm font-medium mb-3">
          <CalendarCheck className="w-4 h-4" />
          <span>Milestones</span>
          <ChevronRight className="w-4 h-4" />
          <span>Phase 1 Delivery</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-primary">Policy Setup</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">
          Delivery &amp; Data Access Policy
        </h1>
        <p className="text-base text-muted-foreground max-w-3xl leading-relaxed">
          Configure how deliverables for this milestone will be handled, stored,
          and accessed. This ensures clear expectations and compliance with
          project security requirements.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Section 1: Delivery Mode Selection */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-primary" />
              1. Select Delivery Mode
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Platform Transfer */}
              <label className="relative cursor-pointer group h-full">
                <input
                  type="radio"
                  name="delivery_mode"
                  value="platform"
                  className="peer sr-only"
                  checked={deliveryMode === "platform"}
                  onChange={() => setDeliveryMode("platform")}
                />
                <div className="h-full border border-border rounded-xl p-5 hover:bg-muted/50 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                      <CloudSync className="w-6 h-6" />
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
                      <div
                        className={`w-2 h-2 rounded-full bg-primary-foreground transition-opacity ${
                          deliveryMode === "platform"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Platform Transfer
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Shared Delivery
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
                    All deliverables (Documentation, Source code, Reports) are
                    transferred and stored on AITasker for member access.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs font-semibold w-fit">
                    <BadgeCheck className="w-4 h-4" />
                    Recommended for transparency
                  </div>
                </div>
              </label>

              {/* Option B: Private Delivery */}
              <label className="relative cursor-pointer group h-full">
                <input
                  type="radio"
                  name="delivery_mode"
                  value="private"
                  className="peer sr-only"
                  checked={deliveryMode === "private"}
                  onChange={() => setDeliveryMode("private")}
                />
                <div className="h-full border border-border rounded-xl p-5 hover:bg-muted/50 transition-all peer-checked:border-primary peer-checked:bg-primary/5 peer-checked:ring-1 peer-checked:ring-primary flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <div className="p-2.5 bg-muted text-muted-foreground rounded-lg">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
                      <div
                        className={`w-2 h-2 rounded-full bg-primary-foreground transition-opacity ${
                          deliveryMode === "private"
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-1">
                      Private Delivery
                    </h3>
                    <p className="text-sm text-muted-foreground font-medium">
                      Restricted Access
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground flex-grow leading-relaxed">
                    No physical file transfer. Used for private source code,
                    internal company data, or sensitive systems.
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold w-fit">
                    <Shield className="w-4 h-4" />
                    Used for high-security projects
                  </div>
                </div>
              </label>
            </div>
          </section>

          {/* Section 2: Mode-Specific Configuration */}
          <section className="bg-card border border-border rounded-xl p-6 shadow-sm min-h-[260px]">
            <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
              <Settings className="w-6 h-6 text-primary" />
              2. Configuration Details
            </h2>

            {deliveryMode === "platform" ? (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <Label className="block text-sm font-semibold text-foreground mb-2">
                    Access Visibility
                  </Label>
                  <Select defaultValue="project_members">
                    <SelectTrigger className="w-full md:w-1/2">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project_members">
                        Project Members Only
                      </SelectItem>
                      <SelectItem value="admins_assignees">
                        Admin &amp; Milestone Assignees
                      </SelectItem>
                      <SelectItem value="specific_team">
                        Specific Team Selection
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg border border-border flex items-start gap-3 mt-2">
                  <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-1">
                      System Tracking Enabled
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      AITasker will automatically generate cryptographic hashes
                      for uploaded files and maintain an immutable log of
                      timestamps and member access events for audit purposes.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg border border-destructive/20 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">
                      Out-of-Band Delivery
                    </h4>
                    <p className="text-sm text-destructive/90 leading-relaxed">
                      The Expert will not upload sensitive data to the platform.
                      Both parties must manually confirm completion and access
                      via external secure channels before this milestone can be
                      marked as complete.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 group mt-2">
                  <Checkbox
                    id="private-ack"
                    checked={ackChecked}
                    onCheckedChange={(checked) =>
                      setAckChecked(checked === true)
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="private-ack"
                    className="text-sm leading-relaxed text-foreground font-medium cursor-pointer group-hover:text-primary transition-colors"
                  >
                    I acknowledge that deliverables will be managed outside of
                    AITasker storage and assume responsibility for verifying
                    receipt.
                  </Label>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Summary & Actions */}
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-8 flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-bold text-foreground mb-5">
                Milestone Agreement
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Selected Policy
                  </span>
                  <span className="block text-base font-medium text-foreground">
                    {deliveryMode === "platform"
                      ? "Platform Transfer"
                      : "Private Delivery"}
                  </span>
                </div>
                <div className="pb-4 border-b border-border">
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Data Storage
                  </span>
                  <span className="block text-base font-medium text-foreground">
                    {deliveryMode === "platform"
                      ? "AITasker Secure Cloud"
                      : "External / Manual"}
                  </span>
                </div>
                <div>
                  <span className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Audit Trail
                  </span>
                  <span className="block text-base font-medium text-foreground">
                    {deliveryMode === "platform"
                      ? "Full System Logs"
                      : "Manual Verification"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full shadow-sm"
                disabled={deliveryMode === "private" && !ackChecked}
              >
                Apply to Milestone
              </Button>
              <Button size="lg" variant="outline" className="w-full">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import {
  Plus,
  CheckCircle2,
  Clock,
  Upload,
  Download,
  FileText,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";
import { NeoProgress } from "@/components/ui-custom/neo-progress";

interface Milestone {
  id: string;
  title: string;
  amount: string;
  status: "pending" | "active" | "review" | "paid";
  dueDate: string;
  deliverables: { name: string; url: string; date?: string }[];
}

const MILESTONES: Milestone[] = [
  {
    id: "m-1",
    title: "Phase 1: Architecture & Setup",
    amount: "$2,000",
    status: "paid",
    dueDate: "Oct 1, 2026",
    deliverables: [
      { name: "Architecture_Diagram.pdf", url: "#", date: "Sep 28, 2026" },
      { name: "infrastructure_as_code.zip", url: "#", date: "Sep 30, 2026" },
    ],
  },
  {
    id: "m-2",
    title: "Phase 2: Baseline Model Training",
    amount: "$3,500",
    status: "review",
    dueDate: "Oct 15, 2026",
    deliverables: [
      { name: "training_report_v1.pdf", url: "#", date: "Oct 14, 2026" },
      { name: "model_weights.pkl", url: "#", date: "Oct 14, 2026" },
    ],
  },
  {
    id: "m-3",
    title: "Phase 3: API Deployment & Testing",
    amount: "$4,500",
    status: "active",
    dueDate: "Nov 15, 2026",
    deliverables: [],
  },
];

export default function ProjectMilestonesPage() {
  const [milestones] = useState<Milestone[]>(MILESTONES);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8 pb-24">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b-2 border-border pb-6">
        <div>
          <h2 className="text-2xl font-heading font-black uppercase tracking-widest">
            Milestones & Payments
          </h2>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-1">
            Manage project phases and deliverables
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Total Budget
            </div>
            <div className="font-heading font-black text-xl text-primary">
              $10,000
            </div>
          </div>
          <div className="w-px bg-border h-10" />
          <div className="text-right">
            <div className="text-[0.625rem] font-bold text-muted-foreground uppercase tracking-widest">
              Paid
            </div>
            <div className="font-heading font-black text-xl text-green-600">
              $2,000
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {milestones.map((m, idx) => (
          <div
            key={m.id}
            className={cn(
              "bg-card border-4 shadow-[6px_6px_0px_0px_var(--foreground)] p-6 transition-all",
              m.status === "review"
                ? "border-purple-500 shadow-[6px_6px_0px_0px_var(--purple)]"
                : m.status === "active"
                  ? "border-blue-500 shadow-[6px_6px_0px_0px_var(--blue)]"
                  : m.status === "paid"
                    ? "border-foreground bg-secondary/10 opacity-75"
                    : "border-border",
            )}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Left Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-heading font-black text-lg uppercase tracking-wide">
                    {idx + 1}. {m.title}
                  </span>
                  {m.status === "paid" && (
                    <span className="bg-green-500 text-white px-2 py-0.5 text-[0.625rem] font-black uppercase tracking-widest border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]">
                      Paid
                    </span>
                  )}
                  {m.status === "review" && (
                    <span className="bg-purple-500 text-white px-2 py-0.5 text-[0.625rem] font-black uppercase tracking-widest border-2 border-foreground shadow-[2px_2px_0px_0px_var(--foreground)] animate-pulse">
                      Needs Review
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {m.dueDate}
                  </span>
                  <span className="w-1 h-1 bg-border rounded-full" />
                  <span className="text-foreground font-black">{m.amount}</span>
                </div>
              </div>

              {/* Action Area */}
              <div className="md:w-64 shrink-0 flex flex-col items-end gap-3 justify-center border-t-2 md:border-t-0 md:border-l-2 border-border pt-4 md:pt-0 md:pl-6">
                {m.status === "review" && (
                  <NeoButton className="w-full h-12">
                    Approve & Pay <ArrowRight className="w-4 h-4 ml-2" />
                  </NeoButton>
                )}
                {m.status === "active" && (
                  <NeoButton
                    variant="outline"
                    className="w-full h-12 cursor-not-allowed opacity-50"
                  >
                    Awaiting Delivery
                  </NeoButton>
                )}
                {m.status === "paid" && (
                  <NeoButton
                    variant="ghost"
                    className="w-full h-10 border-transparent text-green-600"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" /> Settled
                  </NeoButton>
                )}
              </div>
            </div>

            {/* Deliverables Section */}
            {(m.deliverables.length > 0 || m.status === "active") && (
              <div className="mt-6 pt-6 border-t-2 border-border border-dashed">
                <h4 className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
                  <FileText className="w-3 h-3" /> Deliverables
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {m.deliverables.map((doc, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 border-2 border-border bg-background hover:border-foreground transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 bg-secondary/20 flex items-center justify-center shrink-0 border border-border">
                          <FileText className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold truncate">
                            {doc.name}
                          </div>
                          {doc.date && (
                            <div className="text-[0.625rem] font-semibold text-muted-foreground">
                              {doc.date}
                            </div>
                          )}
                        </div>
                      </div>
                      <Download className="w-4 h-4 text-muted-foreground group-hover:text-foreground shrink-0" />
                    </div>
                  ))}

                  {m.status === "active" && (
                    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border bg-secondary/5 text-muted-foreground">
                      <Clock className="w-6 h-6 mb-2 opacity-50" />
                      <span className="text-[0.625rem] font-bold uppercase tracking-widest text-center">
                        Expert has not submitted files yet.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center pt-8">
        <NeoButton
          variant="outline"
          className="border-dashed h-12 px-8 text-muted-foreground"
        >
          <Plus className="w-4 h-4 mr-2" /> Request New Milestone
        </NeoButton>
      </div>
    </div>
  );
}

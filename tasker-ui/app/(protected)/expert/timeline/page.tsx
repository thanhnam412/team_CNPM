"use client";

import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  Briefcase,
  AlertTriangle,
  Palmtree,
} from "lucide-react";
import { NeoButton } from "@/components/ui-custom/neo-button";
import { cn } from "@/lib/utils";
import { NeoPageHeader } from "@/components/ui-custom/neo-page-header";

// Mock Data for Timeline
const DAYS = [
  "Mon 12",
  "Tue 13",
  "Wed 14",
  "Thu 15",
  "Fri 16",
  "Sat 17",
  "Sun 18",
];

const TIMELINE_ROWS = [
  {
    id: "PROJ-123",
    title: "API Integration (ERP)",
    client: "Global Tech LLC",
    type: "project",
    events: [
      {
        id: "e1",
        title: "Develop Auth Module",
        startDay: 0,
        span: 3,
        status: "completed",
      },
      {
        id: "e2",
        title: "Testing & QA",
        startDay: 3,
        span: 2,
        status: "in_progress",
      },
    ],
  },
  {
    id: "QT-889",
    title: "Python Scraper Script",
    client: "Acme Corp.",
    type: "task",
    events: [
      {
        id: "e3",
        title: "Scrape Target A",
        startDay: 1,
        span: 1,
        status: "completed",
      },
      {
        id: "e4",
        title: "Data Cleaning",
        startDay: 2,
        span: 1,
        status: "overdue",
      },
    ],
  },
  {
    id: "UNAVAILABLE",
    title: "Time Off / Unavailable",
    client: "Personal",
    type: "personal",
    events: [
      { id: "e5", title: "Vacation", startDay: 5, span: 2, status: "time_off" },
    ],
  },
];

export default function ExpertTimelinePage() {
  const getEventColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-700";
      case "in_progress":
        return "bg-primary text-primary-foreground border-foreground shadow-[2px_2px_0px_0px_var(--foreground)]";
      case "overdue":
        return "bg-[#E1801E] text-white border-[#E1801E] shadow-[2px_2px_0px_0px_var(--foreground)] animate-pulse";
      case "time_off":
        return "bg-secondary text-muted-foreground border-border border-dashed pattern-diagonal-lines pattern-secondary/20 pattern-bg-background pattern-size-2";
      default:
        return "bg-card border-border";
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden relative">
      {/* Header & Toolbar */}
      <NeoPageHeader
        className="z-20 relative"
        containerClassName="max-w-7xl mx-auto w-full p-6 md:p-8"
        title="Timeline"
        icon={<CalendarDays className="w-6 h-6 md:w-8 md:h-8 text-primary" />}
        description="Manage your deadlines and availability."
        rightContent={
          <div className="flex items-center gap-4 border-2 border-border p-2 bg-secondary/10">
            <div className="flex items-center gap-2 mr-4">
              <Clock className="w-4 h-4 text-primary" />
              <div className="text-xs font-black uppercase tracking-widest">
                Workload: 35/40 hrs
              </div>
            </div>

            <div className="flex bg-background border-2 border-border">
              <NeoButton variant="ghost" className="h-8 px-4 text-xs">
                Week
              </NeoButton>
              <div className="w-0.5 bg-border" />
              <NeoButton
                variant="ghost"
                className="h-8 px-4 text-xs text-muted-foreground"
              >
                Month
              </NeoButton>
            </div>
          </div>
        }
      />

      {/* Timeline Grid Area */}
      <div className="flex-1 overflow-auto bg-background p-6">
        <div className="max-w-7xl mx-auto min-w-[800px]">
          {/* Calendar Controls */}
          <div className="flex items-center justify-between mb-4 border-2 border-border bg-card p-2">
            <NeoButton variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="w-4 h-4" />
            </NeoButton>
            <h2 className="font-heading font-black uppercase tracking-widest text-sm">
              Oct 12 - Oct 18, 2026
            </h2>
            <NeoButton variant="ghost" size="icon" className="h-8 w-8">
              <ChevronRight className="w-4 h-4" />
            </NeoButton>
          </div>

          {/* The Gantt/Timeline Grid */}
          <div className="border-2 border-foreground shadow-[6px_6px_0px_0px_var(--foreground)] bg-card overflow-hidden">
            {/* Header Row (Days) */}
            <div className="flex border-b-2 border-foreground bg-secondary/30">
              {/* Row Header column */}
              <div className="w-64 shrink-0 border-r-2 border-foreground p-3 flex items-center">
                <span className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground">
                  Projects / Tasks
                </span>
              </div>
              {/* Days columns */}
              <div className="flex-1 grid grid-cols-7">
                {DAYS.map((day, idx) => (
                  <div
                    key={day}
                    className={cn(
                      "p-3 text-center border-r-2 border-border last:border-r-0",
                      idx === 2
                        ? "bg-primary/10 border-b-4 border-b-primary"
                        : "", // Today highlight
                    )}
                  >
                    <span
                      className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        idx === 2 ? "text-primary" : "text-foreground",
                      )}
                    >
                      {day}
                    </span>
                    {idx === 2 && (
                      <div className="text-[0.5rem] font-bold text-primary uppercase mt-0.5">
                        Today
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix Rows */}
            <div className="divide-y-2 divide-border">
              {TIMELINE_ROWS.map((row, rowIdx) => (
                <div
                  key={row.id}
                  className="flex min-h-[80px] group hover:bg-secondary/5 transition-colors"
                >
                  {/* Row Info (Left Column) */}
                  <div className="w-64 shrink-0 border-r-2 border-foreground p-3 flex flex-col justify-center bg-card z-10 relative">
                    <div className="flex items-center gap-2 mb-1">
                      {row.type === "personal" ? (
                        <Palmtree className="w-3 h-3 text-muted-foreground" />
                      ) : (
                        <Briefcase className="w-3 h-3 text-primary" />
                      )}
                      <span className="text-[0.5rem] font-black uppercase tracking-widest text-muted-foreground bg-secondary px-1 py-0.5 border-2 border-border">
                        {row.id}
                      </span>
                    </div>
                    <div
                      className="font-bold text-xs uppercase truncate leading-tight mb-1"
                      title={row.title}
                    >
                      {row.title}
                    </div>
                    <div className="text-[0.5rem] font-bold uppercase tracking-widest text-muted-foreground truncate">
                      {row.client}
                    </div>
                  </div>

                  {/* Grid Cells & Events */}
                  <div className="flex-1 grid grid-cols-7 relative">
                    {/* Vertical grid lines */}
                    {[...Array(7)].map((_, i) => (
                      <div
                        key={i}
                        className="border-r-2 border-border/50 h-full w-full last:border-r-0 pointer-events-none"
                      />
                    ))}

                    {/* Events Overlay */}
                    <div className="absolute inset-0 p-2">
                      {row.events.map((event) => (
                        <div
                          key={event.id}
                          className={cn(
                            "absolute h-10 top-1/2 -translate-y-1/2 border-2 px-2 py-1 flex flex-col justify-center overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                            getEventColor(event.status),
                          )}
                          style={{
                            left: `calc(${event.startDay} * (100% / 7) + 0.25rem)`,
                            width: `calc(${event.span} * (100% / 7) - 0.5rem)`,
                          }}
                          title={`${event.title} (${event.status})`}
                        >
                          <div className="text-[0.5rem] md:text-[0.625rem] font-black uppercase tracking-widest truncate flex items-center gap-1">
                            {event.status === "overdue" && (
                              <AlertTriangle className="w-3 h-3 shrink-0" />
                            )}
                            {event.title}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4 items-center justify-center p-4 border-2 border-border bg-secondary/10">
            <span className="text-[0.625rem] font-black uppercase tracking-widest text-muted-foreground mr-2">
              Legend:
            </span>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <div className="w-3 h-3 bg-green-500 border-2 border-green-700" />{" "}
              Completed
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <div className="w-3 h-3 bg-primary border-2 border-foreground" />{" "}
              In Progress
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <div className="w-3 h-3 bg-[#E1801E] border-2 border-[#E1801E]" />{" "}
              Overdue
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <div className="w-3 h-3 bg-secondary border-2 border-border border-dashed" />{" "}
              Time Off
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

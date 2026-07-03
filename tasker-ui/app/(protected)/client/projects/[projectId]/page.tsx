import { ArrowUpRight, CheckCircle2, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProjectOverviewPage() {
  const stats = [
    { title: "Completion", value: "45%", icon: CheckCircle2, desc: "On track" },
    {
      title: "Active Tasks",
      value: "12",
      icon: Clock,
      desc: "Across 4 buckets",
    },
    {
      title: "Team Members",
      value: "5",
      icon: Users,
      desc: "2 Experts included",
    },
    {
      title: "Budget Used",
      value: "$4,500",
      icon: ArrowUpRight,
      desc: "Out of $10,000",
    },
  ];

  return (
    <div className="p-6 pb-24 max-w-6xl mx-auto space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="uppercase tracking-widest font-bold text-xs text-muted-foreground">
                  {stat.title}
                </h3>
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-4xl font-heading font-black tracking-wider mb-2">
                {stat.value}
              </div>
              <p className="text-xs uppercase font-semibold text-muted-foreground">
                {stat.desc}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] min-h-[300px]">
          <h3 className="uppercase tracking-widest font-black text-sm mb-6 border-b-2 border-border pb-4">
            Burndown Chart
          </h3>
          <div className="flex items-center justify-center h-48 bg-secondary/30 border-2 border-dashed border-border">
            <span className="text-muted-foreground font-semibold uppercase tracking-widest text-xs">
              [Chart Placeholder]
            </span>
          </div>
        </div>

        <div className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)]">
          <h3 className="uppercase tracking-widest font-black text-sm mb-6 border-b-2 border-border pb-4">
            Upcoming Milestones
          </h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full border-2 border-border bg-primary/20 flex items-center justify-center shrink-0">
                  <span className="font-bold text-xs">{i}</span>
                </div>
                <div>
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    Phase {i} Deliverable
                  </h4>
                  <p className="text-xs text-muted-foreground font-semibold">
                    Due in {i * 3} days
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

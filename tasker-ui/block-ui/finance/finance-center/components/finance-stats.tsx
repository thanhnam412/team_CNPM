import { cn } from "@/lib/utils";

export interface FinanceStatsProps {
  stats: {
    title: string;
    value: string;
    icon: React.ElementType;
    color: string;
  }[];
}

export function FinanceStats({ stats }: FinanceStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-card border-2 border-border p-6 shadow-[4px_4px_0px_0px_var(--border)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_var(--border)] transition-all flex flex-col justify-between h-36 cursor-pointer group"
          >
            <div className="flex items-center justify-between">
              <h3 className="uppercase tracking-widest font-bold text-[0.625rem] text-muted-foreground group-hover:text-foreground transition-colors">
                {stat.title}
              </h3>
              <Icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div
              className={cn(
                "text-3xl lg:text-4xl font-heading font-black tracking-wider mt-4 truncate",
                stat.color,
              )}
            >
              {stat.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}

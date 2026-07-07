export interface StatItem {
  title: string;
  value: string;
  icon: React.ElementType;
  desc: string;
}

export interface OverviewStatsProps {
  stats: StatItem[];
}

export function OverviewStats({ stats }: OverviewStatsProps) {
  return (
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
  );
}

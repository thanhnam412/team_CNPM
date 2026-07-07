export function OverviewChart() {
  return (
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
  );
}

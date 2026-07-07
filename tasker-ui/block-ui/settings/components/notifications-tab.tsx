import { cn } from "@/lib/utils";

export function NotificationsTab() {
  const notificationsOptions = [
    {
      title: "New Messages",
      desc: "Get notified when someone sends you a direct message.",
    },
    {
      title: "Task Updates",
      desc: "Status changes on projects or quick tasks.",
    },
    {
      title: "Financial Alerts",
      desc: "Payouts cleared, deposits, and escrow updates.",
    },
    {
      title: "Marketing & Promos",
      desc: "Occasional updates on new platform features.",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <section className="space-y-6">
        <h2 className="font-heading font-black text-xl uppercase tracking-widest border-b-2 border-border pb-2 mb-6">
          Email Preferences
        </h2>

        {notificationsOptions.map((item, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 p-4 border-2 border-border hover:border-foreground transition-colors cursor-pointer group"
          >
            <div>
              <h3 className="font-bold text-sm uppercase group-hover:text-primary transition-colors">
                {item.title}
              </h3>
              <p className="text-xs font-bold text-muted-foreground mt-1">
                {item.desc}
              </p>
            </div>
            {/* Brutalist Toggle Button */}
            <div className="relative inline-flex h-8 w-14 shrink-0 cursor-pointer items-center justify-center rounded-none border-2 border-foreground bg-secondary transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50">
              {/* Fake active state for mockup */}
              {i !== 3 && <div className="absolute inset-0 bg-primary/20" />}
              <span
                className={cn(
                  "pointer-events-none block h-6 w-6 rounded-none border-2 border-foreground bg-primary shadow-[2px_2px_0px_0px_var(--foreground)] transition-transform",
                  i !== 3 ? "translate-x-3" : "-translate-x-3 bg-card",
                )}
              />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

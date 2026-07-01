"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Icon({ name, className }: { name: string; className?: string }) {
  return <span className={cn("material-symbols-outlined select-none align-middle", className)}>{name}</span>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "outline";
  asLink?: string;
  loading?: boolean;
};

export function AiButton({ className, variant = "primary", asLink, children, loading = false, disabled, ...props }: ButtonProps) {
  const styles = cn(
    "inline-flex h-10 items-center justify-center gap-2 rounded-sm px-4 text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50",
    variant === "primary" && "bg-primary-container text-on-primary shadow-sm hover:-translate-y-0.5 hover:bg-primary",
    variant === "secondary" && "bg-secondary-container text-on-secondary-container hover:bg-secondary-fixed-dim",
    variant === "ghost" && "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
    variant === "outline" && "border border-outline bg-surface-container-lowest text-on-surface hover:bg-surface-container hover:border-primary hover:text-primary",
    variant === "danger" && "bg-error-container text-on-error-container hover:bg-error/10",
    className,
  );
  if (asLink) return <Link href={asLink} className={styles}>{children}</Link>;
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
      className={styles}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" /> : null}
      {children}
    </motion.button>
  );
}

export function GlassCard({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut", delay }}
      className={cn("glass-card", className)}
    >
      {children}
    </motion.div>
  );
}

export function Surface({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-outline-variant bg-surface-container-low/70 p-5", className)}>{children}</section>;
}

export function Badge({ children, tone = "info", className }: { children: ReactNode; tone?: "info" | "success" | "warning" | "danger" | "violet"; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-[0.14em]",
      tone === "info" && "border-primary/30 bg-primary/10 text-primary",
      tone === "success" && "border-emerald-700/20 bg-emerald-50 text-emerald-700",
      tone === "warning" && "border-tertiary/30 bg-tertiary-fixed text-tertiary",
      tone === "danger" && "border-error/30 bg-error-container text-on-error-container",
      tone === "violet" && "border-secondary/30 bg-secondary/10 text-secondary",
      className,
    )}>{children}</span>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return <p className="label-caps text-on-surface-variant">{children}</p>;
}

export function StatCard({ icon, label, value, hint, tone = "info" }: { icon: string; label: string; value: string; hint?: string; tone?: "info" | "success" | "warning" | "danger" | "violet" }) {
  return (
    <GlassCard className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Label>{label}</Label>
          <p className="mt-3 font-syne text-3xl font-bold text-on-surface">{value}</p>
          {hint ? <p className="mt-2 text-sm text-on-surface-variant">{hint}</p> : null}
        </div>
        <div className="rounded-lg border border-outline-variant bg-surface-container-low p-3">
          <Icon name={icon} className={cn("text-2xl", tone === "violet" ? "text-secondary" : tone === "warning" ? "text-tertiary" : tone === "danger" ? "text-error" : "text-primary")} />
        </div>
      </div>
    </GlassCard>
  );
}

export function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return <label className="grid gap-2 text-sm font-medium text-on-surface"><span>{label}</span>{children}{error ? <span className="text-xs text-error">{error}</span> : null}</label>;
}

export function AiInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("h-11 rounded-sm border border-outline-variant bg-surface-container-low px-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20", props.className)} />;
}

export function AiTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("min-h-28 rounded-sm border border-outline-variant bg-surface-container-low px-3 py-3 text-sm text-on-surface outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20", props.className)} />;
}

export function ProgressBar({ value }: { value: number }) {
  return <div className="h-2 overflow-hidden rounded-full bg-surface-container-high"><div className="h-full rounded-full bg-primary-container transition-all duration-500" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} /></div>;
}

export function EmptyState({ icon = "search_off", title, body, action }: { icon?: string; title: string; body: string; action?: ReactNode }) {
  return (
    <GlassCard className="flex min-h-[260px] flex-col items-center justify-center p-8 text-center">
      <div className="rounded-xl border border-outline-variant bg-surface-container-high p-4"><Icon name={icon} className="text-4xl text-primary" /></div>
      <h3 className="mt-5 font-syne text-2xl font-bold text-on-surface">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-6 text-on-surface-variant">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </GlassCard>
  );
}

export function SkeletonPanel() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass-card p-5">
          <div className="h-4 w-2/5 animate-pulse rounded bg-surface-container-high" />
          <div className="mt-4 h-8 w-3/4 animate-pulse rounded bg-surface-container-high" />
          <div className="mt-5 space-y-2">
            <div className="h-3 animate-pulse rounded bg-surface-container-high" />
            <div className="h-3 w-5/6 animate-pulse rounded bg-surface-container-high" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PageHeader({ eyebrow, title, body, action }: { eyebrow: string; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <Label>{eyebrow}</Label>
        <h1 className="mt-2 font-syne text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">{title}</h1>
        {body ? <p className="mt-3 max-w-3xl text-base leading-7 text-on-surface-variant">{body}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function TabsPill({ items, active, onChange }: { items: string[]; active: string; onChange: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 rounded-lg border border-outline-variant bg-surface-container-low/70 p-1">
      {items.map((item) => (
        <button key={item} onClick={() => onChange(item)} className={cn("rounded-sm px-3 py-2 text-sm font-semibold transition", active === item ? "bg-primary-container text-on-primary" : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface")}>{item}</button>
      ))}
    </div>
  );
}

export function RouteCard({ href, title, body, icon = "open_in_new" }: { href: string; title: string; body: string; icon?: string }) {
  return (
    <Link href={href} className="glass-card group block p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-syne text-lg font-bold text-on-surface group-hover:text-primary">{title}</p>
          <p className="mt-2 text-sm leading-6 text-on-surface-variant">{body}</p>
        </div>
        <Icon name={icon} className="text-primary" />
      </div>
    </Link>
  );
}

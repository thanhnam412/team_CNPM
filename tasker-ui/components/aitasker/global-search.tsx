"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Role } from "@/lib/types";
import { useAppStore } from "@/store/app-store";
import { Icon } from "@/components/ui/aitasker";

export function GlobalSearch({ role }: { role: Role }) {
  const s = useAppStore();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (term.length < 2) return [];
    const jobs = s.jobs.filter((j) => j.title.toLowerCase().includes(term)).slice(0, 4).map((j) => ({ id: j.id, label: j.title, type: "Việc làm", href: role === "expert" ? "/expert/marketplace" : role === "client" ? "/client/jobs" : "/marketplace" }));
    const users = s.users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term)).slice(0, 4).map((u) => ({ id: u.id, label: u.name, type: u.role === "expert" ? "Expert" : "Người dùng", href: u.role === "expert" ? `/experts/${u.id}` : role === "admin" ? "/admin/users" : `/${role}/dashboard` }));
    const contracts = s.contracts.filter((c) => c.title.toLowerCase().includes(term)).slice(0, 4).map((c) => ({ id: c.id, label: c.title, type: "Hợp đồng", href: role === "expert" ? `/expert/contracts/${c.id}` : role === "client" ? `/client/contracts/${c.id}` : role === "admin" ? "/admin/disputes" : "/enterprise/contracts" }));
    return [...jobs, ...users, ...contracts].slice(0, 8);
  }, [q, role, s.jobs, s.users, s.contracts]);

  return (
    <div className="relative hidden min-w-[280px] lg:block">
      <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm job, expert, hợp đồng..."
        className="h-10 w-full rounded-sm border border-outline-variant bg-surface-container-low px-10 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
      {results.length ? (
        <div className="absolute right-0 top-12 z-[70] w-[420px] overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-xl">
          {results.map((r) => (
            <Link key={`${r.type}-${r.id}`} href={r.href} onClick={() => setQ("")} className="flex items-center justify-between border-b border-outline-variant px-4 py-3 last:border-0 hover:bg-surface-container-low">
              <div>
                <p className="font-semibold text-on-surface">{r.label}</p>
                <p className="font-mono text-[11px] text-on-surface-variant">{r.type} • {r.id}</p>
              </div>
              <Icon name="north_east" className="text-primary" />
            </Link>
          ))}
        </div>
      ) : q.trim().length >= 2 ? (
        <div className="absolute right-0 top-12 z-[70] w-[360px] rounded-lg border border-outline-variant bg-surface-container-lowest p-4 text-sm text-on-surface-variant shadow-xl">Không có dữ liệu phù hợp.</div>
      ) : null}
    </div>
  );
}

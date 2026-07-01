"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/app-store";
import { AiButton, Badge, EmptyState, Field, GlassCard, Icon, Label, RouteCard, AiInput, AiTextarea, StatCard } from "@/components/ui/aitasker";
import type { Role } from "@/lib/types";

export function LandingPage() {
  const { services, jobs, users } = useAppStore();
  return (
    <main className="min-h-screen overflow-hidden bg-grid">
      <nav className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-lg bg-primary-container text-on-primary shadow-glow"><Icon name="neurology" /></div>
          <div><p className="font-syne text-2xl font-extrabold">AITasker</p><p className="font-mono text-[11px] uppercase text-on-surface-variant">AI Expert Sàn giao dịch</p></div>
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <Link href="/marketplace" className="text-sm font-semibold text-on-surface-variant hover:text-primary">Sàn giao dịch</Link>
          <Link href="/services" className="text-sm font-semibold text-on-surface-variant hover:text-primary">Dịch vụ</Link>
          <Link href="/community" className="text-sm font-semibold text-on-surface-variant hover:text-primary">Cộng đồng</Link>
          <Link href="/sitemap" className="text-sm font-semibold text-on-surface-variant hover:text-primary">Sơ đồ màn hình</Link>
        </div>
        <div className="flex gap-2"><AiButton asLink="/login" variant="outline">Đăng nhập</AiButton><AiButton asLink="/register">Bắt đầu</AiButton></div>
      </nav>
      <section className="mx-auto grid max-w-[1440px] gap-8 px-4 pb-16 pt-8 md:px-6 lg:grid-cols-[1.04fr_0.96fr] lg:pb-24 lg:pt-16">
        <div className="flex flex-col justify-center">
          <Badge tone="violet">Deep Space Command Center</Badge>
          <h1 className="mt-6 max-w-5xl font-syne text-5xl font-extrabold leading-[0.98] tracking-tight text-on-surface md:text-7xl">Thuê AI Expert, quản lý milestone và giao dự án AI an toàn hơn.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-on-surface-variant">AITasker mô phỏng đầy đủ marketplace freelance AI: Client đăng job, Expert gửi proposal, hợp đồng escrow, milestone, chat có cảnh báo bảo mật, ví thanh toán, dispute và admin moderation.</p>
          <div className="mt-8 flex flex-wrap gap-3"><AiButton asLink="/client/dashboard"><Icon name="rocket_launch" /> Test luồng Client</AiButton><AiButton asLink="/expert/marketplace" variant="outline"><Icon name="travel_explore" /> Xem việc AI</AiButton><AiButton asLink="/admin/dashboard" variant="ghost">Bảng Admin</AiButton></div>
          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <StatCard icon="verified" label="Expert đã xác minh" value={`${users.filter((u) => u.role === "expert" && u.verified).length}+`} hint="Mock verification" />
            <StatCard icon="work" label="Việc đang mở" value={`${jobs.length}`} hint="Seeded job posts" tone="violet" />
            <StatCard icon="hub" label="Màn hình Stitch" value="180" hint="/sitemap để test" tone="warning" />
          </div>
        </div>
        <GlassCard className="relative p-5 lg:p-6">
          <div className="absolute right-6 top-6 hidden rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary md:block">DỮ LIỆU DEMO LIVE</div>
          <div className="grid gap-4">
            <div className="rounded-xl border border-outline-variant bg-surface-container-low p-5">
              <Label>AI Copilot creates brief</Label>
              <h2 className="mt-2 font-syne text-2xl font-bold">Custom RAG Chatbot</h2>
              <p className="mt-2 text-sm leading-6 text-on-surface-variant">Hybrid retrieval, citation grounding, private delivery policy, eval harness, and handover checklist.</p>
              <div className="mt-4 flex flex-wrap gap-2">{services[0].tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <GlassCard className="p-4"><Label>Duyệt cột mốc</Label><p className="mt-3 font-syne text-3xl font-bold text-primary">58%</p><p className="mt-2 text-sm text-on-surface-variant">Client can approve/request changes instantly.</p></GlassCard>
              <GlassCard className="p-4"><Label>Escrow đã giữ</Label><p className="mt-3 font-syne text-3xl font-bold text-secondary">$4,200</p><p className="mt-2 text-sm text-on-surface-variant">Ví điện tử and release flow included.</p></GlassCard>
            </div>
            <div className="rounded-xl border border-tertiary/30 bg-tertiary/10 p-4 text-sm text-tertiary"><Icon name="shield" className="mr-2 text-[20px]" />Chat moderation warning is active for credentials, private files and unsafe content.</div>
          </div>
        </GlassCard>
      </section>
      <section className="mx-auto max-w-[1440px] px-4 pb-14 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <RouteCard href="/marketplace" title="Hub khám phá thống nhất" body="Lọc experts, services, community job feed and open project drawer." icon="travel_explore" />
          <RouteCard href="/client/contracts/ctr_DR_8842" title="Không gian hợp đồng" body="Duyệt milestone, request changes, submit deliverable, chat and dispute flow." icon="contract" />
          <RouteCard href="/sitemap" title="180 route tham chiếu Stitch" body="Dev menu gom toàn bộ màn hình theo module để bấm test không cần nhớ URL." icon="schema" />
        </div>
      </section>
    </main>
  );
}

const roles: { role: Role; label: string; email: string; hint: string }[] = [
  { role: "client", label: "Client", email: "client@aitasker.dev", hint: "Đăng job, review hồ sơ, duyệt milestone" },
  { role: "expert", label: "AI Expert", email: "expert@aitasker.dev", hint: "Gửi proposal, workspace, ví rút tiền" },
  { role: "enterprise", label: "Enterprise", email: "enterprise@aitasker.dev", hint: "AI program office + approval flow" },
  { role: "admin", label: "Admin", email: "admin@aitasker.dev", hint: "Kiểm duyệt, user, dispute, audit log" },
];

export function AuthPage({ mode }: { mode: "login" | "register" | "recover" }) {
  const router = useRouter();
  const { loginByEmail, registerUser } = useAppStore();
  const [role, setRole] = useState<Role>("client");
  const [email, setEmail] = useState(roles[0].email);
  const [name, setName] = useState("Minh Labs");
  const [password, setPassword] = useState("demo1234");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = roles.find((r) => r.role === role)!;
  const title = mode === "login" ? "Đăng nhập AITasker" : mode === "register" ? "Đăng ký tài khoản demo" : "Khôi phục tài khoản";
  const cta = mode === "recover" ? "Gửi hướng dẫn khôi phục" : mode === "register" ? "Tạo tài khoản demo" : "Đăng nhập demo";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return setError("Email chưa đúng định dạng.");
    if (mode !== "recover" && password.length < 6) return setError("Mật khẩu demo tối thiểu 6 ký tự.");
    if (mode === "register" && !name.trim()) return setError("Thiếu tên hiển thị hoặc tên doanh nghiệp.");
    setError("");
    if (mode === "recover") return router.push("/login?recover=sent");
    setLoading(true);
    const result = mode === "register"
      ? await registerUser(role, email, password, name)
      : await loginByEmail(email, password, role);
    setLoading(false);
    if (!result.ok) return setError(result.message ?? "Không đăng nhập được.");
    const next = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;
    router.push(next || result.redirectTo || `/${role}/dashboard`);
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <GlassCard className="p-7">
          <Link href="/" className="mb-8 flex items-center gap-3"><div className="grid size-11 place-items-center rounded-lg bg-primary-container text-on-primary"><Icon name="neurology" /></div><div><p className="font-syne text-2xl font-extrabold">AITasker</p><p className="font-mono text-xs uppercase text-on-surface-variant">Demo E2E</p></div></Link>
          <Badge tone="violet">Auth / điều hướng theo role</Badge>
          <h1 className="mt-5 font-syne text-4xl font-extrabold">{title}</h1>
          <p className="mt-3 text-sm leading-6 text-on-surface-variant">Chọn role bên dưới để test redirect đúng dashboard. Auth set role + userId vào store, có middleware guard theo cookie demo, không dùng localStorage.</p>
          <form className="mt-7 grid gap-4" onSubmit={submit}>
            {mode === "register" ? <Field label="Tên hiển thị / doanh nghiệp"><AiInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Minh Labs" /></Field> : null}
            <Field label="Email demo" error={error.includes("Email") ? error : undefined}><AiInput value={email} onChange={(e) => setEmail(e.target.value)} placeholder={selected.email} /></Field>
            {mode !== "recover" ? <Field label="Mật khẩu"><AiInput type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></Field> : null}
            <Field label="Role demo"><div className="grid gap-2 sm:grid-cols-2">{roles.map((r) => <button type="button" key={r.role} onClick={() => { setRole(r.role); setEmail(r.email); }} className={`rounded-lg border p-3 text-left transition ${role === r.role ? "border-primary bg-primary/10" : "border-outline-variant bg-surface-container-low hover:border-primary/50"}`}><p className="font-semibold">{r.label}</p><p className="mt-1 text-xs text-on-surface-variant">{r.hint}</p></button>)}</div></Field>
            {error && !error.includes("Email") ? <p className="rounded-sm border border-error/30 bg-error/10 p-3 text-sm text-error">{error}</p> : null}
            <AiButton type="submit" className="w-full" loading={loading}>{cta}</AiButton>
          </form>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-on-surface-variant">
            <Link href="/login" className="hover:text-primary">Đăng nhập</Link><Link href="/register" className="hover:text-primary">Đăng ký</Link><Link href="/recover" className="hover:text-primary">Khôi phục</Link>
          </div>
        </GlassCard>
        <GlassCard className="hidden p-7 lg:block">
          <Label>Trạng thái validate</Label>
          <h2 className="mt-3 font-syne text-3xl font-bold">Thiếu thông tin sẽ hiện lỗi ngay, không reload trang.</h2>
          <div className="mt-6 grid gap-4">
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4"><Badge tone="danger">Thiếu thông tin bắt buộc</Badge><p className="mt-3 text-sm text-on-surface-variant">Email, password, tên doanh nghiệp/freelancer đều validate bằng onSubmit + preventDefault.</p></div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4"><Badge tone="success">Điều hướng theo role</Badge><p className="mt-3 text-sm text-on-surface-variant">Client → /client/dashboard, Expert → /expert/dashboard, Enterprise → /enterprise/dashboard, Admin → /admin/dashboard.</p></div>
            <div className="rounded-lg border border-outline-variant bg-surface-container-low p-4"><Badge>Tài khoản demo</Badge><p className="mt-3 font-mono text-xs leading-6 text-on-surface-variant">client@aitasker.dev / expert@aitasker.dev / enterprise@aitasker.dev / admin@aitasker.dev<br/>Password: demo1234</p></div>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}

export function ServicesPage() {
  const { services, favorites, toggleFavorite } = useAppStore();
  const [q, setQ] = useState("");
  const filtered = useMemo(() => services.filter((s) => `${s.title} ${s.description} ${s.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())), [services, q]);
  return <main className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6"><div className="mb-8 flex items-center justify-between"><Link href="/" className="font-syne text-2xl font-extrabold">AITasker</Link><AiButton asLink="/login" variant="outline">Đăng nhập</AiButton></div><div className="mb-6"><Label>Danh mục dịch vụ</Label><h1 className="mt-2 font-syne text-5xl font-extrabold">Khám phá dịch vụ AI</h1><p className="mt-3 text-on-surface-variant">Catalog, trạng thái rỗng/không tìm thấy và trang chi tiết dịch vụ đều dựng bằng TSX.</p></div><AiInput placeholder="Tìm RAG, CV, MLOps..." value={q} onChange={(e) => setQ(e.target.value)} className="mb-6 w-full md:w-96" />{filtered.length ? <div className="grid gap-4 md:grid-cols-3">{filtered.map((s) => <GlassCard key={s.id} className="p-5"><div className="flex items-start justify-between"><Badge tone="violet">{`Từ $${s.priceFrom}`}</Badge><button onClick={() => toggleFavorite(s.id)}><Icon name={favorites.includes(s.id) ? "favorite" : "favorite_border"} className={favorites.includes(s.id) ? "text-error" : "text-on-surface-variant"} /></button></div><h2 className="mt-4 font-syne text-2xl font-bold">{s.title}</h2><p className="mt-2 text-sm leading-6 text-on-surface-variant">{s.description}</p><div className="mt-4 flex flex-wrap gap-2">{s.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div><AiButton asLink={`/services/${s.slug}`} className="mt-5 w-full" variant="outline">Xem chi tiết</AiButton></GlassCard>)}</div> : <EmptyState title="Không tìm thấy dịch vụ/gói tin" body="Thử từ khóa RAG, chatbot, computer vision hoặc MLOps để xem catalog có dữ liệu." />}</main>;
}

export function ServiceDetailPage({ slug }: { slug: string }) {
  const { services, users, toggleFavorite } = useAppStore();
  const service = services.find((s) => s.slug === slug);
  if (!service) return <main className="mx-auto max-w-5xl px-4 py-10"><EmptyState title="Dịch vụ không khả dụng" body="Slug này không tồn tại trong mock catalog." action={<AiButton asLink="/services">Quay lại catalog</AiButton>} /></main>;
  const expert = users.find((u) => u.id === service.expertId);
  return <main className="mx-auto min-h-screen max-w-[1200px] px-4 py-8 md:px-6"><Link href="/services" className="text-sm text-primary">← Catalog</Link><div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]"><GlassCard className="p-7"><Badge tone="violet">Chi tiết dịch vụ AI</Badge><h1 className="mt-4 font-syne text-5xl font-extrabold">{service.title}</h1><p className="mt-4 text-lg leading-8 text-on-surface-variant">{service.description}</p><div className="mt-6 flex flex-wrap gap-2">{service.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div><div className="mt-8 grid gap-4 md:grid-cols-3"><StatCard icon="payments" label="Giá từ" value={`$${service.priceFrom}`} /><StatCard icon="schedule" label="Bàn giao" value={service.delivery} tone="warning" /><StatCard icon="verified" label="Điểm Expert" value={`${expert?.trustScore ?? 90}`} tone="success" /></div><section className="mt-8 rounded-xl border border-outline-variant bg-surface-container-low p-5"><Label>Example: AI Custom RAG Chatbot</Label><p className="mt-3 text-sm leading-7 text-on-surface-variant">Includes requirement discovery, secure ingestion, vector database setup, citations, hallucination checks, code snippet handover, private deliverable review and milestone approval workflow.</p></section></GlassCard><GlassCard className="h-fit p-6"><Label>Expert</Label><div className="mt-4 flex items-center gap-3"><div className="grid size-12 place-items-center rounded-full bg-secondary-container font-syne font-bold text-secondary">{expert?.avatar}</div><div><p className="font-semibold">{expert?.name}</p><p className="text-sm text-on-surface-variant">{expert?.title}</p></div></div><AiButton className="mt-6 w-full" asLink="/client/jobs/create">Tạo việc tương tự</AiButton><AiButton className="mt-3 w-full" variant="outline" onClick={() => toggleFavorite(service.id)}><Icon name="favorite" /> Lưu dịch vụ</AiButton></GlassCard></div></main>;
}

export function CommunityPage() {
  const { jobs, proposals } = useAppStore();
  return <main className="mx-auto min-h-screen max-w-[1200px] px-4 py-8 md:px-6"><div className="mb-8 flex items-center justify-between"><Link href="/" className="font-syne text-2xl font-extrabold">AITasker</Link><AiButton asLink="/expert/marketplace">Giao diện Expert</AiButton></div><Label>Cộng đồng interaction job feed</Label><h1 className="mt-2 font-syne text-5xl font-extrabold">AI job feed cộng đồng</h1><div className="mt-8 grid gap-4">{jobs.map((job) => <GlassCard key={job.id} className="p-5"><div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between"><div><Badge>{job.category}</Badge><h2 className="mt-3 font-syne text-2xl font-bold">{job.title}</h2><p className="mt-2 max-w-3xl text-sm leading-6 text-on-surface-variant">{job.description}</p><div className="mt-3 flex flex-wrap gap-2">{job.skills.map((s) => <Badge key={s} tone="violet">{s}</Badge>)}</div></div><div className="min-w-44 text-right"><p className="font-syne text-2xl font-bold text-primary">${job.budget}</p><p className="text-sm text-on-surface-variant">{proposals.filter((p) => p.jobId === job.id).length} proposals</p></div></div></GlassCard>)}</div></main>;
}

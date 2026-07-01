"use client";

import { useState } from "react";
import type { Role, Milestone } from "@/lib/types";
import { useAppStore } from "@/store/app-store";
import { AiButton, AiInput, AiTextarea, Badge, Field, GlassCard, Icon, Label, ProgressBar } from "@/components/ui/aitasker";
import { cn } from "@/lib/utils";

function money(n: number) { return `$${Math.max(0, Number(n) || 0).toLocaleString("en-US")}`; }
function userName(users: ReturnType<typeof useAppStore>["users"], id: string) { return users.find((u) => u.id === id)?.name ?? id; }
function tone(status: Milestone["status"]): "info" | "success" | "warning" | "danger" | "violet" { return status === "approved" || status === "paid" ? "success" : status === "change_requested" ? "warning" : status === "submitted" ? "violet" : status === "pending" || status === "planned" ? "info" : "warning"; }
function roleFallbackId(role: Role) { return role === "expert" ? "u_expert" : role === "enterprise" ? "u_enterprise" : role === "admin" ? "u_admin" : "u_client"; }

export function ContractWorkspaceFull({ id, role }: { id: string; role: Role }) {
  const s = useAppStore();
  const contract = s.contracts.find((c) => c.id === id) ?? s.contracts[0];
  const actorId = s.currentUser?.role === role ? s.currentUser.id : roleFallbackId(role);
  const milestones = s.milestones.filter((m) => m.contractId === contract.id);
  const target = milestones.find((m) => role === "client" ? m.status === "submitted" : m.status === "in_progress" || m.status === "change_requested") ?? milestones.find((m) => m.status !== "approved") ?? milestones[0];
  const messages = s.messages.filter((m) => m.contractId === contract.id);
  const [body, setBody] = useState("Mình đã kiểm tra milestone, cần xác nhận thêm acceptance criteria trước khi release.");
  const [code, setCode] = useState("const result = await submitMilestone({ contractId, deliverableUrl });");
  const [deliverable, setDeliverable] = useState("Link handover package + báo cáo nghiệm thu + ghi chú triển khai.");
  const [changeRequest, setChangeRequest] = useState("Bổ sung screenshot, latency metrics và checklist deploy.");
  const [newTitle, setNewTitle] = useState("Hardening bảo mật và QA nghiệm thu");
  const [dispute, setDispute] = useState("Cần admin mediation trước khi giải ngân milestone này.");
  const [notice, setNotice] = useState("");

  function approve() { if (!target) return; s.approveMilestone(target.id); setNotice(`Đã duyệt ${target.title}. Ví Expert được cộng ${money(target.amount)}.`); }
  function submit() { if (!target) return; s.submitMilestone(target.id, deliverable); setNotice("Đã nộp deliverable, Client nhận thông báo review."); }
  function requestChange() { if (!target) return; s.requestMilestoneChange(target.id, changeRequest); setNotice("Đã gửi yêu cầu chỉnh sửa sang Expert."); }
  function createMilestone() { const m = s.createMilestone(contract.id, { title: newTitle, amount: Math.max(300, Math.round(contract.escrow * 0.15)), dueDate: new Date().toISOString().slice(0,10) }); setNotice(`Đã tạo cột mốc ${m.title}.`); }
  function send(kind: "text"|"code" = "text") { const text = kind === "code" ? code : body; if (!text.trim()) return; s.sendMessage(contract.id, actorId, text, kind); if (kind === "text") setBody(""); }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2"><Badge tone={contract.status === "disputed" ? "danger" : "info"}>{contract.status}</Badge><Badge tone="violet">{contract.privacy}</Badge><span className="font-mono text-xs text-on-surface-variant">{contract.id}</span></div>
          <h1 className="font-syne text-4xl font-bold tracking-tight text-on-surface">{contract.title}</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Client {userName(s.users, contract.clientId)} • Expert {userName(s.users, contract.expertId)} • Escrow {money(contract.escrow)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {role === "client" ? <><AiButton onClick={requestChange} variant="outline">Yêu cầu chỉnh sửa</AiButton><AiButton onClick={approve}><Icon name="verified" /> Duyệt & giải ngân</AiButton></> : <><AiButton onClick={submit}><Icon name="upload" /> Nộp milestone</AiButton><AiButton onClick={createMilestone} variant="outline">Tạo cột mốc</AiButton></>}
        </div>
      </div>
      {notice ? <div className="rounded-lg border border-primary/20 bg-primary/10 p-4 text-sm font-semibold text-primary">{notice}</div> : null}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="p-5">
            <h2 className="flex items-center gap-2 border-b border-outline-variant pb-3 font-syne text-2xl font-bold"><Icon name="target" className="text-primary"/>Definition & Goals</h2>
            <p className="mt-4 text-sm uppercase tracking-wider text-on-surface-variant">Primary goal</p>
            <p className="mt-1 text-lg font-semibold">{target?.title ?? contract.title}</p>
            <p className="mt-3 leading-7 text-on-surface-variant">{target?.deliverable || "Triển khai đúng phạm vi hợp đồng, nghiệm thu minh bạch, có báo cáo kỹ thuật và handover bảo mật."}</p>
          </GlassCard>
          <GlassCard className="p-5">
            <h2 className="flex items-center gap-2 border-b border-outline-variant pb-3 font-syne text-2xl font-bold"><Icon name="inventory_2" className="text-primary"/>Scope & Deliverables</h2>
            <div className="mt-4 space-y-3">{milestones.map((m) => <div key={m.id} className="flex flex-col gap-3 rounded-lg border border-outline-variant bg-surface-container-low p-4 md:flex-row md:items-center md:justify-between"><div><p className="font-semibold">{m.title}</p><p className="text-sm text-on-surface-variant">{money(m.amount)} • hạn {m.dueDate} {m.changeRequest ? `• yêu cầu: ${m.changeRequest}` : ""}</p></div><Badge tone={tone(m.status)}>{m.status}</Badge></div>)}</div>
          </GlassCard>
        </div>
        <div className="space-y-6">
          <GlassCard className="p-5"><Label>Contract terms</Label><div className="mt-4 space-y-4"><div className="flex justify-between border-b border-outline-variant pb-2"><span>Deadline</span><b>{target?.dueDate ?? contract.endDate}</b></div><div className="flex justify-between border-b border-outline-variant pb-2"><span>Payment</span><b className="text-primary">{money(target?.amount ?? contract.escrow)}</b></div><div><ProgressBar value={contract.progress}/><p className="mt-2 text-sm text-on-surface-variant">{contract.progress}% hoàn thành</p></div></div></GlassCard>
          <GlassCard className="p-5"><Label>Private delivery / dispute</Label><Field label="Deliverable"><AiTextarea value={deliverable} onChange={(e)=>setDeliverable(e.target.value)}/></Field><Field label="Change request"><AiTextarea value={changeRequest} onChange={(e)=>setChangeRequest(e.target.value)}/></Field><Field label="Milestone mới"><AiInput value={newTitle} onChange={(e)=>setNewTitle(e.target.value)}/></Field><Field label="Lý do tranh chấp"><AiTextarea value={dispute} onChange={(e)=>setDispute(e.target.value)}/></Field><AiButton onClick={()=>s.createDispute(contract.id, actorId, dispute, ["delivery.zip","chat-log.txt"])} variant="danger"><Icon name="gavel"/>Tạo tranh chấp</AiButton></GlassCard>
        </div>
      </div>
      <GlassCard className="p-5">
        <div className="flex items-center justify-between"><h2 className="font-syne text-2xl font-bold">Workspace Chat + AI Assistant</h2><Badge tone="success">Stateful</Badge></div>
        <div className="mt-4 max-h-[420px] space-y-3 overflow-auto rounded-lg border border-outline-variant bg-surface-container-low p-4">
          {messages.map((m) => { const mine = m.senderId === actorId; return <div key={m.id} className={cn("flex", mine ? "justify-end" : "justify-start")}><div className={cn("max-w-[78%] rounded-2xl border p-3", m.kind === "warning" ? "border-tertiary/30 bg-tertiary-container/30" : mine ? "border-primary/30 bg-primary/10" : "border-outline-variant bg-surface-container-lowest")}><div className="mb-1 flex items-center gap-2 text-xs text-on-surface-variant"><span className="grid size-7 place-items-center rounded-full bg-surface-container-high font-bold text-primary">{s.users.find(u=>u.id===m.senderId)?.avatar ?? "AI"}</span><span>{userName(s.users,m.senderId)}</span><span>•</span><span>{m.createdAt}</span><span>•</span><span>{m.kind}</span></div>{m.kind === "code" ? <pre className="overflow-auto rounded bg-surface-container-high p-3 font-mono text-xs"><code>{m.body}</code></pre> : <p className="whitespace-pre-wrap text-sm leading-6">{m.body}</p>}</div></div> })}
        </div>
        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_1fr_auto]">
          <AiTextarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="Nhập tin nhắn..." />
          <AiTextarea value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Code snippet..." />
          <div className="flex flex-col gap-2"><AiButton onClick={()=>send('text')}><Icon name="send"/>Gửi</AiButton><AiButton onClick={()=>send('code')} variant="outline"><Icon name="code"/>Gửi code</AiButton></div>
        </div>
      </GlassCard>
    </div>
  );
}

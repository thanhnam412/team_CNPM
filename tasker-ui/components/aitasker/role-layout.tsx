"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";
import { Role } from "@/lib/types";
import { useAppStore } from "@/store/app-store";
import { AiButton, Icon } from "@/components/ui/aitasker";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/ui/page-transition";
import { GlobalSearch } from "@/components/aitasker/global-search";

const roleNav: Record<Role, { href: string; label: string; icon: string }[]> = {
  client: [
    { href: "/client/dashboard", label: "Tổng quan", icon: "grid_view" },
    { href: "/client/jobs", label: "Tin tuyển dụng", icon: "work" },
    { href: "/client/jobs/create", label: "Đăng việc làm", icon: "add_circle" },
    { href: "/client/applicants", label: "Ứng viên", icon: "groups" },
    { href: "/client/contracts", label: "Hợp đồng", icon: "description" },
    { href: "/client/wallet", label: "Ví điện tử", icon: "account_balance_wallet" },
    { href: "/client/disputes", label: "Tranh chấp", icon: "gavel" },
    { href: "/client/reviews", label: "Đánh giá", icon: "reviews" },
    { href: "/client/notifications", label: "Thông báo", icon: "notifications" },
    { href: "/client/settings", label: "Cài đặt", icon: "settings" },
  ],
  expert: [
    { href: "/expert/dashboard", label: "Tổng quan", icon: "grid_view" },
    { href: "/expert/contracts", label: "Không gian làm việc", icon: "flag" },
    { href: "/expert/marketplace", label: "Sàn giao dịch", icon: "travel_explore" },
    { href: "/expert/proposals", label: "Đơn ứng tuyển", icon: "send" },
    { href: "/expert/profile", label: "Hồ sơ năng lực", icon: "badge" },
    { href: "/expert/wallet", label: "Ví điện tử", icon: "payments" },
    { href: "/expert/reputation", label: "Uy tín", icon: "verified" },
    { href: "/expert/reviews", label: "Đánh giá", icon: "stars" },
    { href: "/expert/notifications", label: "Thông báo", icon: "notifications" },
    { href: "/expert/settings", label: "Cài đặt", icon: "settings" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Tổng quan", icon: "admin_panel_settings" },
    { href: "/admin/moderation", label: "Kiểm duyệt", icon: "shield" },
    { href: "/admin/verifications", label: "Xác minh", icon: "verified_user" },
    { href: "/admin/users", label: "Người dùng", icon: "manage_accounts" },
    { href: "/admin/reputation", label: "Uy tín", icon: "workspace_premium" },
    { href: "/admin/disputes", label: "Tranh chấp", icon: "gavel" },
    { href: "/admin/payments", label: "Thanh toán", icon: "receipt_long" },
    { href: "/admin/policies", label: "Chính sách", icon: "policy" },
    { href: "/admin/audit-logs", label: "Nhật ký hệ thống", icon: "history" },
    { href: "/admin/settings", label: "Cài đặt", icon: "settings" },
  ],
  enterprise: [
    { href: "/enterprise/dashboard", label: "Tổng quan", icon: "domain" },
    { href: "/enterprise/approval", label: "Phê duyệt", icon: "approval" },
    { href: "/enterprise/jobs", label: "Chương trình", icon: "workspaces" },
    { href: "/enterprise/contracts", label: "Hợp đồng", icon: "description" },
    { href: "/enterprise/analytics", label: "Phân tích", icon: "monitoring" },
    { href: "/enterprise/security", label: "Bảo mật", icon: "security" },
    { href: "/enterprise/notifications", label: "Thông báo", icon: "notifications" },
    { href: "/enterprise/settings", label: "Cài đặt", icon: "settings" },
  ],
};

const topNav: Record<Role, { href: string; label: string }[]> = {
  client: [{ href: "/client/dashboard", label: "Tổng quan" }, { href: "/client/contracts", label: "Không gian làm việc" }, { href: "/marketplace", label: "Sàn giao dịch" }, { href: "/client/notifications", label: "Tin nhắn" }],
  expert: [{ href: "/expert/dashboard", label: "Tổng quan" }, { href: "/expert/contracts", label: "Không gian làm việc" }, { href: "/expert/marketplace", label: "Sàn giao dịch" }, { href: "/expert/notifications", label: "Tin nhắn" }],
  admin: [{ href: "/admin/dashboard", label: "Tổng quan" }, { href: "/admin/moderation", label: "Kiểm duyệt" }, { href: "/admin/users", label: "Người dùng" }, { href: "/admin/audit-logs", label: "Nhật ký" }],
  enterprise: [{ href: "/enterprise/dashboard", label: "Tổng quan" }, { href: "/enterprise/approval", label: "Phê duyệt" }, { href: "/enterprise/contracts", label: "Không gian làm việc" }, { href: "/enterprise/security", label: "Bảo mật" }],
};

const brand: Record<Role, string> = { client: "AITasker", expert: "ExpertAI", admin: "TrustOps", enterprise: "EnterpriseAI" };
const projectLabel: Record<Role, string> = { client: "Dự án Alpha", expert: "Dự án Alpha", admin: "Hàng đợi kiểm duyệt", enterprise: "Chương trình AI Q4" };
const projectSub: Record<Role, string> = { client: "Không gian đang hoạt động", expert: "Không gian đang hoạt động", admin: "Bảng vận hành", enterprise: "Giải pháp AI doanh nghiệp" };

function GlassAuthGuard({ role }: { role: Role }) {
  return (
    <div className="max-w-md rounded-lg border border-outline-variant bg-surface-container-lowest p-6 text-center shadow-sm">
      <div className="mx-auto grid size-12 place-items-center rounded-lg bg-primary-container text-on-primary"><Icon name="lock" /></div>
      <h1 className="mt-4 text-2xl font-bold">Đang kiểm tra quyền truy cập</h1>
      <p className="mt-2 text-sm text-on-surface-variant">Khu vực {role} cần đăng nhập đúng role. Nếu chưa đăng nhập, hệ thống sẽ chuyển về trang login.</p>
    </div>
  );
}

export function RoleLayout({ role, children }: { role: Role; children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { hydrated, currentUser, logout, notifications, getRoleHome } = useAppStore();
  const user = currentUser?.role === role ? currentUser : undefined;
  const unread = user ? notifications.filter((n) => !n.read && n.userId === user.id).length : 0;

  useEffect(() => {
    if (!hydrated) return;
    if (!currentUser) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (currentUser.role !== role) router.replace(getRoleHome(currentUser.role));
  }, [hydrated, currentUser, role, router, pathname, getRoleHome]);

  if (!hydrated || !user) {
    return <div className="grid min-h-screen place-items-center bg-background px-4 text-on-surface"><GlassAuthGuard role={role} /></div>;
  }

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <header className="sticky top-0 z-50 h-20 border-b border-outline-variant bg-surface-container-lowest">
        <div className="flex h-full items-center justify-between px-6 md:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-[26px] font-bold tracking-tight text-primary">{brand[role]}</Link>
            <nav className="hidden items-center gap-8 md:flex">
              {topNav[role].map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return <Link key={item.href} href={item.href} className={cn("border-b-2 py-[29px] text-[17px] transition", active ? "border-primary text-primary font-bold" : "border-transparent text-on-surface hover:text-primary")}>{item.label}</Link>;
              })}
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <GlobalSearch role={role} />
            <AiButton asLink={role === "expert" ? "/expert/marketplace" : role === "admin" ? "/admin/moderation" : role === "enterprise" ? "/enterprise/jobs" : "/client/jobs/create"} className="hidden h-11 rounded px-5 md:inline-flex">Tạo dự án</AiButton>
            <Link href={`/${role}/notifications`} className="relative grid size-10 place-items-center rounded-full hover:bg-surface-container-low">
              <Icon name="notifications" className="text-[26px] text-on-surface" />
              {unread ? <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-error text-[10px] font-bold text-on-error">{unread}</span> : null}
            </Link>
            <Link href={`/${role}/settings`} className="grid size-10 place-items-center rounded-full hover:bg-surface-container-low"><Icon name="settings" className="text-[26px] text-on-surface" /></Link>
            <button className="grid size-10 place-items-center overflow-hidden rounded-full border border-outline-variant bg-surface-container-high text-sm font-bold text-primary" title={user.email}>
              {user.avatar}
            </button>
            <button onClick={() => { logout(); router.push("/login"); }} className="hidden text-sm text-on-surface-variant hover:text-primary lg:block">Đăng xuất</button>
          </div>
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-5rem)]">
        <aside className="sticky top-20 hidden h-[calc(100vh-5rem)] w-64 shrink-0 flex-col border-r border-outline-variant bg-surface-container-low md:flex">
          <div className="border-b border-outline-variant p-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-primary-container text-on-primary"><Icon name="rocket_launch" /></div>
              <div><h2 className="text-lg font-bold text-on-background">{projectLabel[role]}</h2><p className="mt-1 text-sm text-on-surface-variant">{projectSub[role]}</p></div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
            {roleNav[role].map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return <Link key={item.href} href={item.href} className={cn("relative flex items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 text-[16px] transition", active ? "font-bold text-on-secondary-container" : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-background")}>
                {active ? <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-lg bg-secondary-container" transition={{ type: "spring", stiffness: 360, damping: 32 }} /> : null}
                <Icon name={item.icon} className={cn("relative z-10 text-[22px]", active && "icon-fill")} /><span className="relative z-10">{item.label}</span></Link>;
            })}
          </nav>
          <div className="mt-auto border-t border-outline-variant p-4">
            <Link href="/sitemap" className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2 text-on-surface-variant hover:bg-surface-container-high hover:text-on-background"><Icon name="help" /> Trung tâm hỗ trợ</Link>
            <AiButton variant="outline" className="w-full">Mời Expert</AiButton>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto bg-surface px-4 py-8 md:px-8">
          <div className="mx-auto max-w-[1100px]"><PageTransition>{children}</PageTransition></div>
        </main>
      </div>
    </div>
  );
}

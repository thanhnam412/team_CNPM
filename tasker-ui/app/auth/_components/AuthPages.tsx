// DEPRECATED: giữ lại để không xóa file cũ. Route chuẩn dùng app/(auth): /login, /register, /recover.
"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type LoginRole = "aitasker" | "business";
type RegisterMainRole = "aitasker" | "customer";
type CustomerType = "personal" | "business";
type IconName =
  | "arrow"
  | "briefcase"
  | "building"
  | "calendar"
  | "card"
  | "clock"
  | "eye"
  | "facebook"
  | "google"
  | "github"
  | "lock"
  | "mail"
  | "person"
  | "shield";

function SvgIcon({ name, className = "h-5 w-5" }: { name: IconName; className?: string }) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "arrow") {
    return (
      <svg {...common}>
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    );
  }

  if (name === "mail") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    );
  }

  if (name === "lock") {
    return (
      <svg {...common}>
        <rect x="5" y="11" width="14" height="10" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </svg>
    );
  }

  if (name === "eye") {
    return (
      <svg {...common}>
        <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }

  if (name === "building") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="2" />
        <path d="M9 8h1" />
        <path d="M14 8h1" />
        <path d="M9 12h1" />
        <path d="M14 12h1" />
        <path d="M9 16h6" />
      </svg>
    );
  }

  if (name === "shield") {
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      </svg>
    );
  }

  if (name === "person") {
    return (
      <svg {...common}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    );
  }

  if (name === "briefcase") {
    return (
      <svg {...common}>
        <rect x="3" y="7" width="18" height="13" rx="2" />
        <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <path d="M3 12h18" />
      </svg>
    );
  }

  if (name === "card") {
    return (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </svg>
    );
  }

  if (name === "clock") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    );
  }

  if (name === "calendar") {
    return (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="17" rx="2" />
        <path d="M8 2v4" />
        <path d="M16 2v4" />
        <path d="M3 10h18" />
      </svg>
    );
  }

  if (name === "google") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded bg-[#f7f9fb] text-xs font-bold text-[#ea4335]">
        G
      </span>
    );
  }

  if (name === "facebook") {
    return (
      <span className="grid h-5 w-5 place-items-center rounded-full bg-[#1877f2] text-xs font-bold text-white">
        f
      </span>
    );
  }

  if (name === "github") {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.15c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.16 1.18.92-.26 1.9-.38 2.87-.39.97.01 1.95.13 2.87.39 2.2-1.49 3.16-1.18 3.16-1.18.62 1.58.23 2.75.11 3.04.74.8 1.18 1.83 1.18 3.08 0 4.42-2.69 5.38-5.25 5.67.41.35.78 1.05.78 2.12v3.19c0 .31.21.67.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
      </svg>
    );
  }

  return null;
}

function AuthHeader({ actionLabel, actionHref }: { actionLabel: string; actionHref: string }) {
  return (
    <header className="h-16 border-b border-[#c7c4d8] bg-white">
      <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="text-[28px] font-bold leading-none text-[#3525cd]">
          Aitasker
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link href="#" className="text-sm font-medium text-[#191c1e] hover:text-[#3525cd]">
            Hỗ trợ
          </Link>
          <Link href="#" className="text-sm font-medium text-[#191c1e] hover:text-[#3525cd]">
            Điều khoản
          </Link>
          <Link href="#" className="text-sm font-medium text-[#191c1e] hover:text-[#3525cd]">
            Bảo mật
          </Link>
        </nav>

        <Link href={actionHref} className="text-sm font-semibold text-[#3525cd] transition hover:opacity-70">
          {actionLabel}
        </Link>
      </div>
    </header>
  );
}

function AuthFooter() {
  return (
    <footer className="border-t border-[#c7c4d8] bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-4 px-5 py-7 md:flex-row md:px-8">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-bold text-[#191c1e]">Aitasker</span>
          <span className="text-sm text-[#464555]">© 2024 Aitasker. Tất cả quyền được bảo lưu.</span>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="text-sm text-[#464555] hover:text-[#191c1e]">
            Liên hệ
          </Link>
          <Link href="#" className="text-sm text-[#464555] hover:text-[#191c1e]">
            Câu hỏi thường gặp
          </Link>
          <Link href="#" className="text-sm text-[#464555] hover:text-[#191c1e]">
            Tuyển dụng
          </Link>
        </div>
      </div>
    </footer>
  );
}

function PageShell({ children, actionLabel, actionHref }: { children: ReactNode; actionLabel: string; actionHref: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f7f9fb] text-[#191c1e]">
      <AuthHeader actionLabel={actionLabel} actionHref={actionHref} />
      {children}
      <AuthFooter />
    </div>
  );
}

function ToggleButton({ active, children, onClick }: { active: boolean; children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "flex-1 rounded-md bg-white px-3 py-2 text-center text-sm font-semibold text-[#3525cd] shadow-sm"
          : "flex-1 rounded-md px-3 py-2 text-center text-sm font-medium text-[#191c1e] transition hover:bg-white/70"
      }
    >
      {children}
    </button>
  );
}

function InputField({
  label,
  placeholder,
  type = "text",
  icon,
  forgot = false,
  showEye = false,
}: {
  label: string;
  placeholder: string;
  type?: string;
  icon: IconName;
  forgot?: boolean;
  showEye?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-[#191c1e]">{label}</label>
        {forgot ? (
          <Link href="#" className="text-sm font-medium text-[#3525cd] hover:underline">
            Quên mật khẩu?
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <SvgIcon name={icon} className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#464555]" />
        <input
          type={type}
          placeholder={placeholder}
          className="h-11 w-full rounded-lg border border-[#c7c4d8] bg-white py-2 pl-10 pr-10 text-sm text-[#191c1e] outline-none transition placeholder:text-[#707070] focus:border-[#3525cd] focus:ring-2 focus:ring-[#3525cd]/20"
        />
        {showEye ? (
          <SvgIcon name="eye" className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#191c1e]" />
        ) : null}
      </div>
    </div>
  );
}

function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#3525cd] px-4 text-sm font-bold text-white shadow-md transition hover:opacity-90 active:scale-[0.98]"
    >
      {children}
    </button>
  );
}

function Divider({ text = "HOẶC TIẾP TỤC VỚI" }: { text?: string }) {
  return (
    <div className="relative my-8">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-[#c7c4d8]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-3 text-xs font-medium uppercase text-[#464555]">{text}</span>
      </div>
    </div>
  );
}

function SocialButton({ icon, label }: { icon: IconName; label: string }) {
  return (
    <button
      type="button"
      className="flex h-11 items-center justify-center gap-2 rounded-lg border border-[#c7c4d8] bg-white px-4 text-sm font-medium text-[#191c1e] transition hover:bg-[#eceef0]"
    >
      <SvgIcon name={icon} />
      {label}
    </button>
  );
}

function BenefitCard({ icon, title, desc, tone }: { icon: IconName; title: string; desc: string; tone: string }) {
  return (
    <div className="rounded-xl border border-[#c7c4d8] bg-white p-6 transition hover:bg-[#eceef0]">
      <div className="flex items-start gap-4">
        <div className={`rounded-lg p-3 ${tone}`}>
          <SvgIcon name={icon} className="h-6 w-6" />
        </div>
        <div>
          <h3 className="mb-1 text-sm font-bold text-[#191c1e]">{title}</h3>
          <p className="text-sm leading-6 text-[#464555]">{desc}</p>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const [role, setRole] = useState<LoginRole>("aitasker");
  const isAitasker = role === "aitasker";

  return (
    <PageShell actionLabel="Đăng ký" actionHref="/auth/register">
      <main className="flex flex-1 items-center px-4 py-12 md:px-10">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <section className="space-y-8">
            <div>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                {isAitasker ? (
                  <>
                    Mở khóa cơ hội <span className="text-[#3525cd]">Tự do</span>
                  </>
                ) : (
                  <>
                    Tìm chuyên gia AI cho <span className="text-[#3525cd]">doanh nghiệp</span>
                  </>
                )}
              </h1>

              <p className="max-w-xl text-lg leading-8 text-[#464555]">
                {isAitasker
                  ? "Kết nối với hàng ngàn dự án chất lượng và xây dựng sự nghiệp Freelance bền vững cùng Aitasker."
                  : "Đăng nhập để đăng dự án, quản lý milestone, thanh toán escrow và làm việc với các chuyên gia AI phù hợp."}
              </p>
            </div>

            <div className="relative aspect-[16/9] max-w-xl overflow-hidden rounded-xl border border-[#c7c4d8] shadow-lg">
              <img
                src={
                  isAitasker
                    ? "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
                    : "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80"
                }
                alt="Aitasker login"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 to-transparent p-8">
                <div className="text-white">
                  <div className="mb-4 text-2xl text-yellow-300">★★★★★</div>
                  <p className="mb-3 text-lg italic">
                    {isAitasker
                      ? "“Aitasker giúp tôi tìm thấy những khách hàng tuyệt vời nhất mà tôi từng hợp tác.”"
                      : "“Aitasker giúp doanh nghiệp của tôi tìm được chuyên gia AI phù hợp nhanh hơn.”"}
                  </p>
                  <p className="text-sm font-medium">{isAitasker ? "— Minh Trần, UI/UX Designer" : "— Đại diện doanh nghiệp"}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto w-full max-w-md rounded-xl border border-[#c7c4d8] bg-white p-8 shadow-sm">
            <div className="mb-8 flex rounded-lg bg-[#eceef0] p-1">
              <ToggleButton active={isAitasker} onClick={() => setRole("aitasker")}>
                Aitasker
              </ToggleButton>
              <ToggleButton active={!isAitasker} onClick={() => setRole("business")}>
                Doanh nghiệp
              </ToggleButton>
            </div>

            <div className="mb-8">
              <h2 className="mb-2 text-2xl font-bold">Chào mừng trở lại</h2>
              <p className="text-sm text-[#464555]">
                {isAitasker ? "Vui lòng nhập thông tin tài khoản Aitasker để tiếp tục." : "Vui lòng nhập tài khoản doanh nghiệp để tiếp tục."}
              </p>
            </div>

            <form className="space-y-5">
              <InputField
                label={isAitasker ? "Email" : "Email công việc"}
                placeholder={isAitasker ? "example@aitasker.com" : "name@company.com"}
                type="email"
                icon="mail"
              />
              <InputField label="Mật khẩu" placeholder="••••••••" type="password" icon="lock" forgot showEye />

              <label className="flex items-center gap-2 text-sm text-[#464555]">
                <input type="checkbox" className="h-4 w-4 rounded border-[#c7c4d8] accent-[#3525cd]" />
                Ghi nhớ đăng nhập
              </label>

              <PrimaryButton>
                Đăng nhập <SvgIcon name="arrow" />
              </PrimaryButton>
            </form>

            <Divider text={isAitasker ? "Hoặc đăng nhập bằng" : "Hoặc tiếp tục với"} />

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon="google" label="Google" />
              {isAitasker ? <SocialButton icon="github" label="GitHub" /> : <SocialButton icon="building" label="SSO" />}
            </div>

            <p className="mt-8 text-center text-sm text-[#464555]">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="font-semibold text-[#3525cd] hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}

function AitaskerRegisterLeft() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="mb-6 text-4xl font-bold leading-tight">
          Tham gia cộng đồng <span className="text-[#3525cd]">Aitasker</span>
        </h1>
        <p className="max-w-xl text-lg leading-8 text-[#464555]">
          Khám phá hàng ngàn cơ hội việc làm tự do và bắt đầu hành trình sự nghiệp mới của bạn ngay hôm nay.
        </p>
      </div>

      <div className="grid gap-4">
        <BenefitCard icon="briefcase" title="Việc làm đa dạng" desc="Tiếp cận hàng nghìn dự án từ thiết kế, lập trình đến viết lách." tone="bg-[#e2dfff] text-[#3525cd]" />
        <BenefitCard icon="card" title="Thanh toán an toàn" desc="Hệ thống ký quỹ đảm bảo bạn luôn nhận được thù lao xứng đáng." tone="bg-[#d0e1fb] text-[#38485d]" />
        <BenefitCard icon="clock" title="Tự do thời gian" desc="Làm việc bất cứ đâu, bất cứ lúc nào bạn muốn với phong cách riêng." tone="bg-[#dae2fd] text-[#41485e]" />
      </div>

      <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-[#c7c4d8] shadow-lg">
        <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80" alt="Aitasker community" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
          <p className="text-lg italic text-white">“Aitasker đã giúp tôi tăng thu nhập gấp 3 lần trong năm qua.” - Minh Anh, Graphic Designer</p>
        </div>
      </div>
    </section>
  );
}

function CustomerRegisterLeft() {
  return (
    <section className="space-y-8">
      <div>
        <h1 className="mb-6 text-4xl font-bold leading-tight">
          Thuê chuyên gia AI cho <span className="text-[#3525cd]">dự án của bạn</span>
        </h1>
        <p className="max-w-xl text-lg leading-8 text-[#464555]">
          Đăng yêu cầu, nhận đề xuất, quản lý milestone và thanh toán an toàn trên cùng một nền tảng.
        </p>
      </div>

      <div className="grid gap-4">
        <BenefitCard icon="briefcase" title="Đăng dự án nhanh" desc="Mô tả nhu cầu và nhận đề xuất từ những chuyên gia phù hợp." tone="bg-[#e2dfff] text-[#3525cd]" />
        <BenefitCard icon="shield" title="Ký quỹ bảo vệ hai bên" desc="Thanh toán theo milestone, chỉ duyệt tiền khi sản phẩm đạt yêu cầu." tone="bg-[#d0e1fb] text-[#38485d]" />
        <BenefitCard icon="calendar" title="Quản lý tiến độ rõ ràng" desc="Theo dõi công việc, tài liệu bàn giao và lịch sử giao dịch minh bạch." tone="bg-[#dae2fd] text-[#41485e]" />
      </div>

      <div className="relative aspect-video max-w-xl overflow-hidden rounded-xl border border-[#c7c4d8] shadow-lg">
        <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80" alt="Customer project" className="h-full w-full object-cover" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6">
          <p className="text-lg italic text-white">“Aitasker giúp doanh nghiệp của tôi tìm được chuyên gia AI phù hợp nhanh hơn.”</p>
        </div>
      </div>
    </section>
  );
}

export function RegisterPage() {
  const [mainRole, setMainRole] = useState<RegisterMainRole>("aitasker");
  const [customerType, setCustomerType] = useState<CustomerType>("business");

  const isAitasker = mainRole === "aitasker";
  const isBusiness = mainRole === "customer" && customerType === "business";
  const isPersonal = mainRole === "customer" && customerType === "personal";

  return (
    <PageShell actionLabel="Đăng nhập" actionHref="/auth/login">
      <main className="flex flex-1 px-4 py-12 md:px-10">
        <div className="mx-auto grid w-full max-w-[1280px] grid-cols-1 gap-12 lg:grid-cols-2">
          {isAitasker ? <AitaskerRegisterLeft /> : <CustomerRegisterLeft />}

          <section className="mx-auto w-full max-w-md self-start rounded-xl border border-[#c7c4d8] bg-white p-8 shadow-sm">
            <div className="mb-6 flex rounded-lg bg-[#eceef0] p-1">
              <ToggleButton active={mainRole === "aitasker"} onClick={() => setMainRole("aitasker")}>
                Aitasker
              </ToggleButton>
              <ToggleButton active={mainRole === "customer"} onClick={() => setMainRole("customer")}>
                Khách hàng
              </ToggleButton>
            </div>

            {mainRole === "customer" ? (
              <div className="mb-8 flex rounded-lg bg-[#eceef0] p-1">
                <ToggleButton active={customerType === "personal"} onClick={() => setCustomerType("personal")}>
                  Cá nhân
                </ToggleButton>
                <ToggleButton active={customerType === "business"} onClick={() => setCustomerType("business")}>
                  Doanh nghiệp
                </ToggleButton>
              </div>
            ) : null}

            <div className="mb-8 text-center md:text-left">
              <h2 className="mb-2 text-2xl font-bold">
                {isAitasker ? "Đăng ký tài khoản" : isBusiness ? "Tạo tài khoản mới" : "Tạo tài khoản cá nhân"}
              </h2>
              <p className="text-sm leading-6 text-[#464555]">
                {isAitasker
                  ? "Bắt đầu sự nghiệp freelance chuyên nghiệp của bạn."
                  : isBusiness
                    ? "Tham gia cùng hàng nghìn doanh nghiệp đang phát triển cùng Aitasker"
                    : "Tìm chuyên gia phù hợp và bắt đầu dự án của bạn trên Aitasker."}
              </p>
            </div>

            <form className="space-y-5">
              {isAitasker ? (
                <>
                  <InputField label="Họ và tên" placeholder="Nhập họ và tên của bạn" icon="person" />
                  <InputField label="Email" placeholder="example@aitasker.vn" type="email" icon="mail" />
                  <InputField label="Mật khẩu" placeholder="••••••••" type="password" icon="lock" showEye />
                  <InputField label="Xác nhận mật khẩu" placeholder="••••••••" type="password" icon="shield" />
                </>
              ) : isBusiness ? (
                <>
                  <InputField label="Tên công ty" placeholder="Công ty TNHH Aitasker" icon="building" />
                  <InputField label="Email công việc" placeholder="name@company.com" type="email" icon="mail" />
                  <InputField label="Mật khẩu" placeholder="••••••••" type="password" icon="lock" />
                  <InputField label="Xác nhận mật khẩu" placeholder="••••••••" type="password" icon="shield" />
                </>
              ) : (
                <>
                  <InputField label="Họ và tên" placeholder="Nhập họ và tên của bạn" icon="person" />
                  <InputField label="Email" placeholder="example@gmail.com" type="email" icon="mail" />
                  <InputField label="Mật khẩu" placeholder="••••••••" type="password" icon="lock" showEye />
                  <InputField label="Xác nhận mật khẩu" placeholder="••••••••" type="password" icon="shield" />
                </>
              )}

              <label className="flex items-start gap-3 text-sm leading-6 text-[#464555]">
                <input type="checkbox" className="mt-1 h-4 w-4 rounded border-[#c7c4d8] accent-[#3525cd]" />
                <span>
                  Tôi đồng ý với{" "}
                  <Link href="#" className="text-[#3525cd] hover:underline">
                    điều khoản và điều kiện
                  </Link>{" "}
                  của Aitasker.
                </span>
              </label>

              <PrimaryButton>
                {isAitasker
                  ? "Tham gia ngay với tư cách Aitasker"
                  : isBusiness
                    ? "Đăng ký tài khoản doanh nghiệp"
                    : "Đăng ký tài khoản cá nhân"}
                <SvgIcon name="arrow" />
              </PrimaryButton>
            </form>

            <Divider />

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon="google" label="Google" />
              {isBusiness ? <SocialButton icon="building" label="SSO" /> : <SocialButton icon="facebook" label="Facebook" />}
            </div>

            <p className="mt-8 text-center text-sm text-[#464555]">
              Bạn đã có tài khoản?{" "}
              <Link href="/auth/login" className="font-semibold text-[#3525cd] hover:underline">
                Đăng nhập ngay
              </Link>
            </p>
          </section>
        </div>
      </main>
    </PageShell>
  );
}

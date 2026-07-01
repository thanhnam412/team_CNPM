"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-heading text-5xl font-bold text-error">Có lỗi runtime</p>
      <p className="max-w-xl text-on-surface-variant">{error.message || "Ứng dụng gặp sự cố khi render trang."}</p>
      <button onClick={reset} className="rounded-sm bg-primary-container px-5 py-3 font-semibold text-on-primary">Thử lại</button>
    </div>
  );
}

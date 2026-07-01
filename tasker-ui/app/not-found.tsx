export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <p className="font-heading text-6xl font-bold text-primary">404</p>
      <p className="text-xl text-on-surface-variant">Trang bạn tìm không tồn tại</p>
      <a href="/" className="btn-primary inline-flex rounded-sm bg-primary-container px-5 py-3 font-semibold text-on-primary">Về trang chủ</a>
    </div>
  );
}

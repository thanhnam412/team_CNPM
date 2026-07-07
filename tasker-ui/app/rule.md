# Kiến trúc phân tách Logic và UI (App Directory)

1. **KHÔNG viết chung UI và Logic**:
   - Thư mục `app` (Routing) đóng vai trò là "Controller" hoặc "Container". Nơi đây **CHỈ** chịu trách nhiệm xử lý **Logic**: bao gồm lấy dữ liệu (fetching data), state management, các hàm xử lý (callbacks), Client logic (`use client`) và Server logic (Server Actions).
   - **Tuyệt đối không** nhồi nhét mã HTML/CSS/Tailwind phức tạp (các UI component) trực tiếp vào các file `page.tsx` hay `layout.tsx` trong thư mục `app`.

2. **Chuyển toàn bộ UI vào `block-ui`**:
   - Mọi khối giao diện (UI blocks, sections, form...) bắt buộc phải được bóc tách và chuyển vào thư mục `block-ui`.
   - Các file trong `app` chỉ nên import các component giao diện từ `block-ui`, sau đó truyền Data và Callback Actions xuống thông qua Props.

### Quy tắc Điều hướng (Navigation)
1. **Client-side Navigation (Nội bộ App)**: Sử dụng `useRouter` từ `next/navigation` để chuyển trang bằng logic ở Client.
2. **SEO / Server-side Navigation**: Cần tốt cho SEO thì sử dụng Component `<Link>` của Next.js.
3. **External Links (Ra ngoài trang web)**: Phải sử dụng thẻ `<Link href="..." target="_blank" rel="noopener noreferrer">` để mở tab mới.

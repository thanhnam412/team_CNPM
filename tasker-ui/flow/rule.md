# Quy tắc Khảo sát Luồng Dữ liệu (Data Flow Analysis Rule)

Trước khi thực hiện tích hợp API hoặc can thiệp logic vào bất kỳ một trang (page) nào, bạn **BẮT BUỘC** phải khảo sát và lập tài liệu phân tích luồng dữ liệu của trang đó.

## Mục đích
Giúp lập trình viên / AI Agent hiểu rõ giao diện đang cần hiển thị những dữ liệu gì (Show) và cần gửi đi những dữ liệu gì (Up), từ đó đối chiếu với API Backend (DTO) để phát hiện sớm các điểm thiếu hụt hoặc cần map dữ liệu.

## Quy trình thực hiện
1. **Quét giao diện**: Đọc file Controller (`app/`) và các file giao diện (`block-ui/`) của trang cần xử lý.
2. **Liệt kê dữ liệu hiển thị (Show)**: Xác định tất cả các field, text, mảng dữ liệu mà UI đang cần để render.
3. **Liệt kê dữ liệu cập nhật (Up)**: Xác định tất cả các field, form input, hoặc action mà UI sẽ gửi đi.
4. **Viết tài liệu**: Tạo một file markdown theo định dạng `flow-[page_name]-[version].md` và lưu vào thư mục `flow/`.

## Cấu trúc file `flow-[page_name]-[version].md`

```markdown
# Flow Analysis: [Tên Trang]
- **Page Path**: `app/.../page.tsx`
- **Block UI Path**: `block-ui/...`

## 1. Dữ liệu cần hiển thị (SHOW)
Liệt kê chi tiết các khối dữ liệu cần render trên UI.
- [ ] Khối A: `title`, `description`, `avatar`
- [ ] Khối B: `listItems` (mảng chứa `id`, `name`, `status`)

## 2. Dữ liệu cần gửi đi (UP / ACTIONS)
Liệt kê các hành động của user (Submit Form, Click Button, v.v.)
- [ ] Submit Form C: payload gồm `email`, `password`.
- [ ] Click nút D: trigger action `delete(id)`.

## 3. Đối chiếu API (API Mapping Check)
- Đã có API đáp ứng đủ các field ở phần SHOW chưa? (Ghi chú nếu API đang thiếu trường dữ liệu nào).
- API Payload ở phần UP có khớp với dữ liệu từ UI form không?
```

## Chú ý
Không được bỏ qua bước này đối với các trang mới hoặc các trang có UI phức tạp. Tài liệu này đóng vai trò như một hợp đồng giữa UI và API trước khi code logic.

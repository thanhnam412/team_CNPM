# Ghi chú về việc chỉnh sửa UI Components

1. **Tuyệt đối KHÔNG SỬA UI GỐC**:
   - Tất cả các file nằm trong thư mục `tasker-ui/components/ui` (thường là các component base sinh ra bởi shadcn/ui hoặc các thư viện khác) đều **không được phép chỉnh sửa trực tiếp**.

2. **Cách Customize (Tuỳ chỉnh)**:
   - Nếu muốn thay đổi giao diện, thêm style hoặc tuỳ chỉnh logic, bạn phải tạo ra một component mới bên trong thư mục `tasker-ui/components/ui-custom`.
   - Trong component mới này, hãy **import (gọi lại)** component gốc từ `components/ui` và **truyền vào các class ghi đè** (overwrite styles) hoặc bọc (wrap) nó lại.

3. **Quy tắc Đặt tên (Naming Convention)**:
   - Cú pháp tên của component custom mới phải là: `[tên style]-[tên component UI custom]`
   - *Ví dụ:* Muốn làm một Button chuẩn phong cách Neo, bạn tạo file `neo-button.tsx` (trong thư mục `ui-custom`), import `<Button>` gốc và thêm các class bo góc, viền dày.

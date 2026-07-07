# Quy tắc phát triển giao diện (Block UI)

Thư mục `block-ui` chứa các khối giao diện (Presentation Components) được tách ra từ thư mục `app`. Nhiệm vụ duy nhất của các component này là **nhận dữ liệu và hiển thị**, hoàn toàn mù tịt về logic phức tạp bên ngoài.

### 1. Cách đặt tên (Naming Conventions)
- **Thư mục (Folder)**: Bắt buộc dùng chữ thường và phân cách bằng dấu gạch ngang `kebab-case` (ví dụ: `auth`, `project-details`, `user-profile`).
- **File**: Tên file cũng sử dụng `kebab-case` phản ánh đúng chức năng (ví dụ: `hero-section.tsx`, `login-form.tsx`).
- **Tên Component**: Bên trong file, khai báo Component bằng `PascalCase` (ví dụ: `export function HeroSection() {}`).

### 2. Export Props Types (Bắt buộc)
- Tất cả Component nhận dữ liệu từ ngoài vào BẮT BUỘC phải định nghĩa kiểu (interface/type) và **phải export kiểu đó ra ngoài**.
- Tên Props phải theo cú pháp: `[TênComponent]Props`.
- **Ví dụ**:
  ```tsx
  export interface LoginFormProps {
    isLoading: boolean;
    onSubmit: (data: LoginData) => void;
  }

  export function LoginForm({ isLoading, onSubmit }: LoginFormProps) {
    // ... UI Code
  }
  ```

### 3. Cách sử dụng (Usage, Data Flow & UI Logic)
- **Truyền Props**: Bất kỳ component nào từ `block-ui` khi được sử dụng ở `app` đều phải nhận đúng type và data đã khai báo trong Props. 
- **Internal UI Logic (Được phép)**: `block-ui` CÓ THỂ sử dụng các logic thông thường (như `useState`, `useRef`) để giải quyết các trạng thái UI nội bộ (Ví dụ: `useState` để bật/tắt `showPassword`, mở menu dropdown). Vì chúng không tương tác với bên ngoài Component.
- **External/Heavy Logic (Bị cấm)**: Tuyệt đối không được handle dữ liệu lớn, fetch API, hay xử lý logic nghiệp vụ bên trong `block-ui`. Nếu logic có tương tác/làm thay đổi dữ liệu bên ngoài Component -> Bắt buộc dùng Callback truyền qua Props hoặc xử lý state bên ngoài thư mục `app` trước khi truyền vào.

### 4. Khi nào cần tách, Gom nhóm (Domain Grouping) và Tái sử dụng
- **Khi nào tách**: Ngay khi thấy một file `page.tsx` trong `app` chứa quá nhiều thẻ HTML (dài quá mức cần thiết), hãy gom nhóm đoạn HTML đó lại thành một Component và ném vào `block-ui`.
- **Gom nhóm Domain (Domain Grouping)**: Thay vì tạo ra hàng loạt folder ở thư mục gốc của `block-ui` (ví dụ: `expert-profile`, `expert-marketplace`), hãy gom các tính năng thuộc cùng một Domain vào một folder cha. Ví dụ: `expert/profile` và `expert/marketplace`. Điều này giúp `block-ui` không bị phình to và rác.
- **Thư mục con**: Bên trong mỗi khối tính năng (ví dụ: `expert/profile`), hãy gom các UI component nhỏ hơn vào thư mục con `components/`.
- **Tái sử dụng**: Nếu một khối UI được dùng ở 2 trang trở lên, hãy đặt nó ở thư mục chung `block-ui/shared` thay vì nằm trong một domain cụ thể.

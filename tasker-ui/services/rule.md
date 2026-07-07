# Quy tắc Tích hợp API (API Integration Rules)

Tài liệu này định nghĩa quy trình, kiến trúc và các bước kiểm tra khi tích hợp API từ Backend vào Frontend trong ứng dụng `tasker-ui`.

---

## 1. Luồng Tích hợp API (Data Flow)

Luồng truyền dẫn dữ liệu bắt buộc tuân theo sơ đồ tuyến tính sau:

```
[Axios Call (Service)] ──> [Type (DTO)] ──> [TanStack Query/Mutation] ──> [Logic (App Page)] ──> [UI (Block UI Props)]
```

1. **Axios Call (Service)**:
   - Đặt trong thư mục `services/`.
   - Chịu trách nhiệm gọi API thô qua Axios instance (`api.ts`).
   - Phải khai báo kiểu dữ liệu trả về thông qua Promise (ví dụ: `Promise<ProjectDto>`).

2. **Type (DTO)**:
   - Đặt trong thư mục `types/` (ví dụ: `types/project.dto.ts`).
   - Định nghĩa chính xác cấu trúc dữ liệu gửi lên và nhận về từ Backend.

3. **TanStack Hook**:
   - Đặt trong thư mục `tanstack/` (ví dụ: `tanstack/useProjects.ts`).
   - Bọc ngoài Service để quản lý Cache, Loading, Error, Invalidation và trigger Refetching.

4. **Logic (App Page)**:
   - Đặt trong thư mục `app/` (ví dụ: `app/(protected)/client/projects/create/page.tsx`).
   - Sử dụng TanStack Hook, quản lý State, điều hướng (router), xử lý các callback và chuyển đổi dữ liệu (data transformation) từ UI Form sang DTO Payload hoặc ngược lại.

5. **UI (Block UI)**:
   - Đặt trong thư mục `block-ui/` (ví dụ: `block-ui/create-project/`).
   - Nhận dữ liệu sạch và các Action callback thông qua Props được định kiểu rõ ràng (`[TênComponent]Props`). Không chứa logic gọi API hay query trực tiếp.

---

## 2. So sánh API vs Logic vs UI

| Đặc tính | API / DTO Layer (`types/`, `services/`) | Logic Layer (`app/`, `tanstack/`) | UI Layer (`block-ui/`) |
| :--- | :--- | :--- | :--- |
| **Nhiệm vụ** | Giao tiếp với Database / Backend | Điều phối dữ liệu, xử lý nghiệp vụ, biến đổi dữ liệu | Hiển thị giao diện và nhận tương tác từ người dùng |
| **Dạng dữ liệu** | Raw data từ database (ID, enums viết hoa, số nguyên/thập phân thô, snake_case...) | Cần biến đổi dữ liệu thô thành dữ liệu hiển thị (ví dụ: format tiền tệ, parse Date) | Dữ liệu sạch, thân thiện để hiển thị (ví dụ: `priceFormatted: string` thay vì `budget: number`) |
| **Sự phụ thuộc** | Phụ thuộc vào Backend Schema | Phụ thuộc vào cả API (DTO) và UI Props | Hoàn toàn độc lập với API, chỉ phụ thuộc vào Props truyền vào |
| **Xử lý Lỗi** | Trả về HTTP status, Validation Errors thô | Bắt lỗi, hiển thị Toast thông báo, map lỗi về từng input | Hiển thị trạng thái lỗi trực quan thông qua styles/components |

---

## 3. Quy trình Ráp nối và Biến đổi Dữ liệu

Khi thực hiện ráp API vào UI/Logic, luôn kiểm tra khả năng biến đổi dữ liệu:
* **Khả năng biến đổi**: Nếu cấu trúc dữ liệu giữa UI Form và API DTO lệch nhau (ví dụ: UI dùng `name` nhưng API yêu cầu `title`), Logic Layer phải chịu trách nhiệm map/biến đổi dữ liệu trước khi gửi đi.
* **Thiếu thông tin**: Nếu UI yêu cầu hiển thị thông tin mà API DTO hiện tại không cung cấp (thiếu trường dữ liệu để show), **phải dừng lại và thông báo lỗi thiếu thông tin API** để Backend bổ sung trước khi tiếp tục.

### Các trường hợp xử lý khi Ráp (Assembly Cases):

* **TH1: Cả UI/Logic và API đều có Type đầy đủ**
  - **Hành động**: Kiểm tra sự tương thích giữa các kiểu dữ liệu. Tiến hành viết hàm map dữ liệu ở Logic Layer và thực hiện ráp hoàn chỉnh.
* **TH2: Thiếu UI (Chưa có Block UI tương ứng)**
  - **Hành động**: **Dừng lại ngay lập tức** và thông báo thiếu UI. Không được tự ý code giao diện hỗn độn trong thư mục `app/`.
* **TH3: Có UI nhưng UI không đảm bảo Type (`any`, `unknown`)**
  - **Hành động**: **Dừng lại và thông báo thiếu Type UI**. Bắt buộc phải chuẩn hóa, định nghĩa kiểu `[TênComponent]Props` rõ ràng cho UI trước khi ráp.
* **TH4: Có UI và UI đã có Type rõ ràng**
  - **Hành động**: Sử dụng Type đó để thực hiện ráp nối và map dữ liệu tại Logic Layer.

---

## 4. Code Convention cho Service

Khi tạo hoặc sửa file service (VD: `contractService.ts`), BẮT BUỘC tuân thủ mẫu sau:
1. Tuyệt đối không dùng `fetch` hay `fetchClient`. Phải dùng Axios instance từ `import api from "./api"`.
2. Hàm service phải khai báo kiểu trả về rõ ràng với `Promise<T>`.
3. Phải destructure `const { data } = await api...` và `return data`.

**Ví dụ chuẩn:**
```typescript
import api from "./api";
import { ContractDto } from "@/types/marketplace.dto";

export const contractService = {
  getContracts: async (): Promise<ContractDto[]> => {
    const { data } = await api.get("/contracts");
    return data;
  },
  generateContract: async (payload: { proposalId: string }): Promise<ContractDto> => {
    const { data } = await api.post("/contracts/generate", payload);
    return data;
  }
};
```

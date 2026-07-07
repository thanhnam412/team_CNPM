# Flow Analysis: Client Create Project (Wizard)
- **Page Path**: `app/(protected)/client/projects/new/page.tsx`
- **Block UI Path**: Không có (đang code trực tiếp trong file page)

## 1. Dữ liệu cần hiển thị (SHOW)
Trang này là form tạo mới nên hoàn toàn không gọi API để lấy dữ liệu. Tuy nhiên, nó render các form inputs tĩnh chia làm 3 Step:
- [x] Step 1 (Basics): `title` (text), `category` (select), `description` (textarea)
- [x] Step 2 (AI Scoping): `technicalScope` (textarea - được AI generate)
- [x] Step 3 (Budget & Post): `type` (select), `budgetMin` (number), `budgetMax` (number), `duration` (select), `commitment` (select)

## 2. Dữ liệu cần gửi đi (UP / ACTIONS)
Hành động cuối cùng là Submit Form bằng Hook `useCreateProjectMutation()`.
Dữ liệu Form (TanStack) gom được:
```json
{
  "title": "string",
  "category": "string",
  "description": "string",
  "technicalScope": "string",
  "type": "fixed",
  "budgetMin": 0,
  "budgetMax": 0,
  "duration": "medium",
  "commitment": "part"
}
```

## 3. Đối chiếu API (API Mapping Check)
- **SHOW**: Không áp dụng (không fetch dữ liệu).
- **UP**: 
  > [!WARNING] Cảnh báo rò rỉ dữ liệu (Data Loss Alert)
  > Hook `useCreateProjectMutation` hiện tại **CHỈ** gửi đi 3 trường:
  > ```json
  > {
  >   "title": value.title,
  >   "description": value.description,
  >   "budget": value.budgetMax
  > }
  > ```
  > **Kết luận**: Hàng loạt field cực kỳ quan trọng mà user đã nhập như `category` (Lĩnh vực AI), `technicalScope` (Phạm vi kỹ thuật do AI generate), `type` (Loại dự án), `duration` (Thời gian), `commitment` (Mức độ cam kết) **bị vứt bỏ hoàn toàn**, không hề được đẩy xuống API!
  > 
  > **Hành động cần làm**: 
  > - Cần kiểm tra lại DTO `CreateProjectDto` của API Backend xem có hỗ trợ các field này không.
  > - Nếu có, cập nhật payload trong hàm `onSubmit`.
  > - Nếu chưa có, yêu cầu Backend thêm các trường này vào DB.

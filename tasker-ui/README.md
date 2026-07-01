# AITasker — Next.js TSX + NestJS MongoDB

Bản này giữ nguyên source cũ, chỉ sửa/bổ sung để hoàn thiện checklist: font Inter/Syne/Space Mono, nhãn tiếng Việt, animation/interaction, store trung tâm, API client có fallback mock, backend NestJS dùng MongoDB/Mongoose và seed dữ liệu demo.

## Chạy backend trước

```bash
cd team_CNPM/tasker-backend
npm install
npm run seed
npm run start:dev
```

Backend chạy tại `http://localhost:4000`.

File môi trường:

```txt
tasker-backend/.env
tasker-backend/.env.example
tasker-ui/.env.local
```

## Chạy frontend

```bash
cd team_CNPM/tasker-ui
npm install --legacy-peer-deps
npm run dev
```

Mở `http://localhost:3000`.

## Tài khoản demo

- Client: `client@aitasker.dev` / `demo1234`
- Expert: `expert@aitasker.dev` / `demo1234`
- Enterprise: `enterprise@aitasker.dev` / `demo1234`
- Admin: `admin@aitasker.dev` / `demo1234`

## Luồng kiểm thử chính

1. Client đăng nhập → `/client/dashboard`.
2. Client tạo job ở `/client/jobs/create` → job hiện ở `/expert/marketplace` và `/marketplace`.
3. Expert gửi proposal → proposal hiện ở `/client/applicants`.
4. Client accept proposal → sinh contract, milestone, escrow transaction và notification.
5. Client/Expert mở cùng contract id ở `/client/contracts/[id]` hoặc `/expert/contracts/[id]` → milestone/chat/dispute dùng chung state/API.
6. Expert submit deliverable → Client nhận thông báo, approve milestone → Expert wallet cộng release transaction.
7. Tạo dispute trong workspace → Admin thấy ở `/admin/disputes`, xử lý sẽ cập nhật contract + transaction + notification.
8. Review ở `/client/reviews` hoặc `/expert/reviews` cập nhật trust score Expert.
9. Admin verify/block user ở `/admin/users`, `/admin/verifications`, audit log ở `/admin/audit-logs`.
10. Enterprise duyệt job `pending_approval` ở `/enterprise/approval`; analytics dùng dữ liệu job/contract/transaction.

## API/fallback

Frontend gọi API thật qua `services/api.ts`. Nếu backend hoặc MongoDB chưa chạy, store vẫn fallback về mock data để không trắng trang khi demo.

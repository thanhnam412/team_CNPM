# AITasker - Freelancing Marketplace với AI 🚀

AITasker là nền tảng freelancing hiện đại kết nối **Clients** và **Experts**, tập trung vào trải nghiệm mượt mà, hệ thống Escrow thông minh và hỗ trợ bởi **AI Copilot**.

## 🛠 Tech Stack

### **Backend**
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Database:** PostgreSQL
- **Query Builder:** [Kysely](https://kysely.dev/) (Type-safe)
- **Schema Management:** Prisma (chỉ dùng cho migrations và generate types)
- **Architecture:** Vertical Slice Architecture

### **Frontend**
- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS + Shadcn UI (Neo-Brutalism Design System)
- **Data Fetching:** TanStack Query v5
- **Icons:** Lucide React
- **Language:** TypeScript

---

## 🏗 Architecture

### Backend (Vertical Slice)
- `src/modules/{feature}`: Mỗi tính năng có thư mục độc lập (projects, quick-tasks, wallet, copilot...)
- `src/modules/{feature}/core`: Domain logic, DTOs, custom errors
- `src/modules/{feature}/{action}`: Các service cụ thể (ví dụ: `accept-proposal.service.ts`)
- `src/queries`: Reusable Kysely queries

### Frontend (Block-UI)
- `app/(protected)`: Protected routes cho Client & Expert
- `block-ui/`: Các business block component (không chỉ là UI thuần)
- `components/ui-custom/`: Hệ thống component Neo-Brutalism (`NeoButton`, `NeoCard`, `NeoInput`...)
- `tanstack/`: Custom React Query hooks

---

## 🌟 Key Features

### **Smart Escrow System**
- Tự động lock tiền khi proposal được chấp nhận
- Tự động release tiền khi Client approve milestone
- Tính phí nền tảng 1% và hỗ trợ partial refund

### **AI Copilot**
- Trò chuyện thông minh giúp Clients diễn đạt ý tưởng
- Tự động draft và tạo Project/Quick Task từ cuộc trò chuyện

### **Projects & Milestones**
- Hỗ trợ dự án lớn với nhiều milestone
- Kanban board cho từng milestone (Todo → In Progress → Review → Done)

### **Quick Tasks**
- Công việc đơn giản, nhanh chóng
- Escrow tức thì và quy trình submit đơn giản

### **Dual Dashboard**
- **Client Dashboard**: Đăng việc, AI Copilot, quản lý tài chính, review công việc
- **Expert Dashboard**: Tìm việc, nộp proposal, quản lý workspace, rút tiền

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Yarn
- PostgreSQL

### 1. Backend

```bash
# Clone backend
cd aitasker-backend

# Cài dependencies
yarn install

# Tạo file .env
cp .env.example .env
# Sau đó chỉnh sửa DATABASE_URL trong .env
```

```bash
# Generate Prisma types (cho Kysely)
yarn prisma generate

# Chạy development server
yarn start:dev
```

**API chạy tại:** `http://localhost:3000`

---

### 2. Frontend

```bash
# Clone frontend
cd aitasker-frontend

# Cài dependencies
yarn install

# Tạo file .env.local
cp .env.example .env.local
```

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

```bash
# Chạy frontend
yarn dev
```

**UI chạy tại:** `http://localhost:3001`

---

## 📁 Project Structure (Tóm tắt)

**Backend:**
- `src/modules/` — Vertical Slices
- `src/queries/` — Raw Kysely queries

**Frontend:**
- `app/(protected)/client` — Client routes
- `app/(protected)/expert` — Expert routes
- `block-ui/` — Business logic components
- `components/ui-custom/` — Neo-Brutalism UI Kit

---

**AITasker** — Kết nối tài năng với công việc thông minh hơn nhờ AI.

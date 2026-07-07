# Sơ đồ Luồng (Flowchart): Client View Project Details (Từ góc nhìn Backend)

Trang chi tiết dự án thường được chia làm nhiều Tab. Ở cấu trúc V1 Schema, thay vì gọi một cục API khổng lồ, Backend đã tách dữ liệu thành các endpoint chuyên biệt để tối ưu hiệu suất. Sơ đồ dưới đây mô tả cách UI (thông qua TanStack Query) lấy dữ liệu từ các API tương ứng.

```mermaid
graph TD
    %% Định nghĩa các Style
    classDef ui fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef hook fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND - UI Components
    subgraph Frontend ["Frontend UI (Project Details Page)"]
        UI_Overview["Tab: Overview (Tổng quan)"]:::ui
        UI_Tasks["Tab: Tasks (Công việc nội bộ)"]:::ui
        UI_Finance["Tab: Finance (Tài chính)"]:::ui
        UI_Market["Tab: Marketplace (Tuyển chuyên gia)"]:::ui
    end

    %% FRONTEND - Tanstack Hooks
    subgraph Hooks ["Tanstack Query Hooks"]
        H_Overview["useProject(id)"]:::hook
        H_Tasks["useTasks(projectId)"]:::hook
        H_Finance["useProjectFinance(id)"]:::hook
        H_Market["useProjectMarketplace(id)"]:::hook
    end

    UI_Overview --> H_Overview
    UI_Tasks --> H_Tasks
    UI_Finance --> H_Finance
    UI_Market --> H_Market

    %% BACKEND API
    subgraph Backend ["Backend API Controllers"]
        API_Overview["GET /api/projects/:id<br/>(Info, Stats, Upcoming Milestones)"]:::api
        API_Tasks["GET /api/tasks?projectId=:id"]:::api
        API_Finance["GET /api/projects/:id/finance<br/>(Budget, Escrow, Transactions)"]:::api
        API_Market["GET /api/projects/:id/marketplace<br/>(Milestones & Proposals)"]:::api
    end

    H_Overview --> API_Overview
    H_Tasks --> API_Tasks
    H_Finance --> API_Finance
    H_Market --> API_Market

    %% DATABASE TABLES
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Proj[("projects")]:::db
        DB_Milestone[("milestones")]:::db
        DB_Members[("project_members")]:::db
        DB_Tasks[("tasks")]:::db
        DB_Trans[("transactions")]:::db
        DB_Prop[("proposals")]:::db

        API_Overview --> DB_Proj
        API_Overview -.->|"Join Stats"| DB_Tasks
        API_Overview -.->|"Join Stats"| DB_Members
        API_Overview -.->|"Limit 3"| DB_Milestone

        API_Tasks --> DB_Tasks

        API_Finance --> DB_Proj
        API_Finance -.->|"List"| DB_Trans

        API_Market --> DB_Milestone
        API_Market -.->|"List"| DB_Prop
    end
```

> [!NOTE] 
> **Lợi ích của việc tách API (V1 Schema):**
> - **Tab Overview** load rất nhanh vì chỉ query cơ bản bảng `projects` và đếm (`count`) số lượng Task/Member.
> - **Tab Finance** được cô lập dữ liệu giao dịch (`transactions`), giúp tính toán số dư Escrow và Spent dễ dàng hơn.
> - **Tab Marketplace** chỉ load Proposals (thay cho Bids cũ) khi Client cần duyệt ứng viên cho Milestones. Dữ liệu này không làm nặng các Tab khác.

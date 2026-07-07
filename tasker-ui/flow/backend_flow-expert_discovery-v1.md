# Sơ đồ Luồng (Flowchart): Expert Discovery & Profiles (Từ góc nhìn Backend)

Sơ đồ này mô tả cách Client tìm kiếm chuyên gia (Find Expert) và xem chi tiết hồ sơ chuyên gia (Expert Profile). Điểm nhấn là việc Backend tự động lọc bỏ tài khoản của chính Client khỏi kết quả tìm kiếm và tổng hợp (aggregate) dữ liệu CV từ nhiều bảng (expert_profiles, users, tasks).

```mermaid
graph TD
    %% Style definitions
    classDef ui fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND
    subgraph Frontend ["Frontend UI (Client Side)"]
        UI_Search["Find Expert Page<br/>(Filters: skill, rating, name)"]:::ui
        UI_Profile["Expert Detail Page<br/>(Bio, Portfolio, Work History)"]:::ui
    end

    %% BACKEND API
    subgraph Backend ["Backend API (experts.controller.ts)"]
        API_Find["GET /api/experts?search=...&skill=...<br/>(Xử lý JWT Token)"]:::api
        API_Filter["Tự động thêm bộ lọc:<br/>where('users.id', '!=', currentUserId)"]:::api
        API_Get["GET /api/experts/:id<br/>(Aggregate Profile Data)"]:::api
    end

    UI_Search --> API_Find
    API_Find --> API_Filter

    UI_Profile --> API_Get

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Users[("users<br/>(name, avatar, online)")]:::db
        DB_Expert[("expert_profiles<br/>(skills, bio, rate, portfolio)")]:::db
        DB_Tasks[("tasks<br/>(Work History)")]:::db
        DB_QTasks[("quick_tasks<br/>(Freelance History)")]:::db

        API_Filter --> DB_Users
        API_Filter --> DB_Expert
        
        API_Get --> DB_Users
        API_Get --> DB_Expert
        API_Get -.->|"Join Completed"| DB_Tasks
        API_Get -.->|"Join Completed"| DB_QTasks
    end
```

> [!TIP]
> Frontend chỉ việc gọi 1 API duy nhất `/api/experts/:id` cho trang Profile. Backend sẽ tự động gộp lịch sử làm việc từ cả 2 bảng `tasks` (Project nội bộ) và `quick_tasks` (Freelance Marketplace) để trả về một `workHistory` hoàn chỉnh.

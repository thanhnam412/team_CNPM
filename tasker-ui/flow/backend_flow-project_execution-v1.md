# Sơ đồ Luồng (Flowchart): Project Execution & Tasks (Từ góc nhìn Backend)

Sơ đồ mô tả quy trình thực thi Dự án nội bộ, bao gồm việc chia nhỏ thành các Cột mốc (Milestones) và giao Công việc (Tasks) cho các thành viên.

```mermaid
graph TD
    %% Style definitions
    classDef ui fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND
    subgraph Frontend ["Frontend UI (Project Board)"]
        UI_Mile["Tạo Milestone mới"]:::ui
        UI_Task["Tạo Task mới<br/>(Gắn vào Milestone)"]:::ui
        UI_Kanban["Kanban Board<br/>(Kéo thả đổi Status)"]:::ui
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_CreateM["POST /api/milestones"]:::api
        API_CreateT["POST /api/tasks"]:::api
        API_UpdateT["PATCH /api/tasks/:id/status<br/>(TODO -> DONE)"]:::api
    end

    UI_Mile --> API_CreateM
    UI_Task --> API_CreateT
    UI_Kanban --> API_UpdateT

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Mile[("milestones<br/>(budget, status)")]:::db
        DB_Task[("tasks<br/>(status: TODO/IN_PROGRESS/DONE)")]:::db
        DB_Stats[("Thống kê (Project Stats)")]:::db

        API_CreateM --> DB_Mile
        API_CreateT --> DB_Task
        API_UpdateT -->|"Đổi Status"| DB_Task
        API_UpdateT -.->|"Tự động tính<br/>% Hoàn thành"| DB_Stats
    end
```

> [!TIP]
> - **Tasks** ở đây là công việc nội bộ của một Project.
> - Bất kỳ thao tác đổi trạng thái Task nào (`PATCH /api/tasks/:id/status`) cũng sẽ gián tiếp làm thay đổi tiến độ (% Completion) của Project khi load tab Overview.
> - Bảng `tasks` không còn trường `description` và `progress` nữa, UI Agent lưu ý đừng gởi lên API 2 field này.

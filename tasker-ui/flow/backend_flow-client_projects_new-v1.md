# Sơ đồ Luồng (Flowchart): Client Create Project (Từ góc nhìn Backend)

Sơ đồ này mô tả chi tiết quá trình từ lúc người dùng (Client) nhập dữ liệu qua 3 bước của Wizard trên Frontend, cho đến khi dữ liệu được đóng gói gửi đi và cách Backend ánh xạ (map) vào Database.

```mermaid
graph TD
    %% Định nghĩa các Style
    classDef step fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef payload fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND - 3 Steps Wizard
    subgraph Frontend ["Frontend UI (React Hook Form)"]
        S1["Step 1: Basics<br/>- title<br/>- category<br/>- description"]:::step
        S2["Step 2: AI Scoping<br/>- technicalScope (AI Gen)"]:::step
        S3["Step 3: Budget & Post<br/>- type<br/>- budgetMin / budgetMax<br/>- duration<br/>- commitment"]:::step

        S1 --> S2 --> S3
    end

    %% DATA PAYLOAD
    Payload[/"Dữ liệu gửi qua useCreateProjectMutation<br/><br/>{<br/>title,<br/>description,<br/>budgetMax,<br/>category, <br/>technicalScope, <br/>type, <br/>duration, <br/>commitment<br/>}"/]:::payload

    S3 -->|"Submit Form"| Payload

    %% BACKEND API
    subgraph Backend ["Backend API (projects.service.ts)"]
        API["POST /api/projects<br/>Hứng toàn bộ Dữ Liệu"]:::api
    end

    Payload --> API

    %% DATABASE MAPPING
    subgraph Database ["PostgreSQL (V1 Schema: projects)"]
        DB_Title[("title")]:::db
        DB_Desc[("description")]:::db
        DB_Ind[("industry")]:::db
        DB_Req[("requirements")]:::db
        DB_Bud[("budget")]:::db
        DB_Tags[("tags (JSON)")]:::db

        API -->|"title"| DB_Title
        API -->|"description"| DB_Desc
        API -->|"budgetMax"| DB_Bud
        API -->|"category"| DB_Ind
        API -->|"technicalScope"| DB_Req
        API -->|"type, duration, commitment"| DB_Tags
    end
```

> [!NOTE] 
> Nhờ việc refactor ở Backend, toàn bộ những thông tin giá trị mà AI sinh ra (như `technicalScope`) hoặc phân loại từ UI (như `category`, `duration`) không còn bị vứt bỏ như trước đây. Chúng đã được Backend gom vào đúng các cột được thiết kế trong Schema V1 (`requirements`, `industry`, `tags`).

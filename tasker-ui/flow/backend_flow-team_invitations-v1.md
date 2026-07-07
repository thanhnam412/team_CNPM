# Sơ đồ Luồng (Flowchart): Teams & Invitations (Từ góc nhìn Backend)

Sơ đồ mô tả quy trình mời người khác (Expert hoặc Internal Team) tham gia vào Project hoặc Quick Task.

```mermaid
graph TD
    %% Style definitions
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef expert fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% CLIENT FLOW
    subgraph Client ["Client Flow (Gửi lời mời)"]
        C_Find["Tìm thấy Expert ưng ý"]:::client
        C_Invite["Bấm 'Invite to Project'"]:::client
    end

    %% EXPERT FLOW
    subgraph Expert ["Expert Flow (Nhận lời mời)"]
        E_Notif["Thấy thông báo Invite"]:::expert
        E_Accept["Bấm 'Accept Invite'"]:::expert
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_Send["POST /api/invitations"]:::api
        API_Get["GET /api/invitations"]:::api
        API_Accept["PATCH /api/invitations/:id/accept"]:::api
    end

    C_Find --> C_Invite
    C_Invite --> API_Send

    E_Notif --> API_Get
    E_Accept --> API_Accept

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Inv[("invitations<br/>(status: PENDING -> ACCEPTED)")]:::db
        DB_Mem[("project_members<br/>(role: EXPERT)")]:::db
        DB_Notif[("notifications")]:::db

        API_Send -->|"Tạo PENDING"| DB_Inv
        API_Send -.->|"Push"| DB_Notif

        API_Get --> DB_Inv

        API_Accept -->|"Đổi status"| DB_Inv
        API_Accept -->|"Add User vào Project"| DB_Mem
    end
```

> [!WARNING]
> Validation cực kỳ quan trọng ở Backend: Bạn không thể tự mời (Invite) chính mình vào một dự án! Điều này giải thích tại sao luồng Find Expert lại phải filter tài khoản của chính Client ra ngoài.

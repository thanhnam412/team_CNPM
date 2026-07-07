# Sơ đồ Luồng (Flowchart): Quick Tasks & Proposals (Từ góc nhìn Backend)

Sơ đồ mô tả quy trình của Freelance Marketplace: Client đăng một công việc làm nhanh (Quick Task) -> Expert tìm thấy và ứng tuyển (Proposal) -> Client duyệt và chọn.

```mermaid
graph TD
    %% Style definitions
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef expert fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% CLIENT & EXPERT FLOW
    subgraph Client ["Client Flow"]
        C_Create["Client tạo Quick Task"]:::client
        C_View["Client xem Proposals<br/>(Ai đã ứng tuyển?)"]:::client
        C_Accept["Client duyệt Proposal"]:::client
    end

    subgraph Expert ["Expert Flow"]
        E_Browse["Expert lướt Marketplace"]:::expert
        E_Apply["Expert gửi Proposal<br/>(Giá đề xuất, Thư chào)"]:::expert
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_CreateQT["POST /api/quick-tasks"]:::api
        API_GetQT["GET /api/quick-tasks?status=OPEN"]:::api
        API_CreateProp["POST /api/proposals"]:::api
        API_GetProp["GET /api/proposals?quickTaskId=:id"]:::api
        API_AcceptProp["PATCH /api/proposals/:id/accept"]:::api
    end

    C_Create --> API_CreateQT
    E_Browse --> API_GetQT
    E_Apply --> API_CreateProp
    C_View --> API_GetProp
    C_Accept --> API_AcceptProp

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_QT[("quick_tasks<br/>(status: OPEN -> IN_PROGRESS)")]:::db
        DB_Prop[("proposals<br/>(proposedPrice, coverLetter)")]:::db
        DB_Wallet[("wallets<br/>(Trừ tiền Escrow)")]:::db

        API_CreateQT --> DB_QT
        API_GetQT --> DB_QT
        
        API_CreateProp --> DB_Prop
        API_GetProp --> DB_Prop

        API_AcceptProp -->|"Đổi status = ACCEPTED"| DB_Prop
        API_AcceptProp -->|"Update expertId"| DB_QT
        API_AcceptProp -.->|"Khóa tiền ngân sách"| DB_Wallet
    end
```

> [!WARNING]
> Lưu ý với UI Agent: Ở schema V1, bảng "Bids" đã bị đổi tên thành `proposals`. Payload khi gửi lên `POST /api/proposals` phải dùng `proposedPrice` (thay vì amount) và `coverLetter` (thay vì message).

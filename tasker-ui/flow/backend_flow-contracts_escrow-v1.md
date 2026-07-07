# Sơ đồ Luồng (Flowchart): Contracts & Escrow (Từ góc nhìn Backend)

Sơ đồ mô tả quy trình Ký kết Hợp đồng (Contract) và Giữ tiền an toàn (Escrow). Đây là trái tim của hệ thống tài chính nhằm đảm bảo quyền lợi cho cả Client (không mất tiền oan) và Expert (chắc chắn được trả lương).

```mermaid
graph TD
    %% Style definitions
    classDef client fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef expert fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND FLOW
    subgraph Frontend ["Frontend UI (Quản lý Hợp đồng)"]
        UI_Accept["Client bấm 'Accept Proposal'"]:::client
        UI_Sign["Expert bấm 'Sign Contract'"]:::expert
        UI_Complete["Client bấm 'Mark as Done & Pay'"]:::client
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_Gen["POST /api/contracts/generate<br/>(Tạo Draft Contract & Trừ tiền Client vào Escrow)"]:::api
        API_Sign["PATCH /api/contracts/:id/sign"]:::api
        API_Release["POST /api/contracts/:id/release-funds<br/>(Chuyển tiền từ Escrow sang ví Expert)"]:::api
    end

    UI_Accept --> API_Gen
    UI_Sign --> API_Sign
    UI_Complete --> API_Release

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Prop[("proposals<br/>(status: ACCEPTED)")]:::db
        DB_Contract[("contracts<br/>(status: DRAFT -> ACTIVE -> COMPLETED)")]:::db
        DB_WalletClient[("wallets (Client)<br/>- Balance<br/>+ Escrow")]:::db
        DB_WalletExpert[("wallets (Expert)<br/>+ Balance")]:::db

        API_Gen -->|"Chốt giá"| DB_Prop
        API_Gen -->|"Sinh Hợp đồng DRAFT"| DB_Contract
        API_Gen -.->|"Giữ tiền (Lock)"| DB_WalletClient

        API_Sign -->|"Đổi status = ACTIVE"| DB_Contract

        API_Release -->|"Đổi status = COMPLETED"| DB_Contract
        API_Release -.->|"Mở khóa tiền"| DB_WalletClient
        API_Release -.->|"Cộng tiền"| DB_WalletExpert
    end
```

> [!CAUTION]
> **Rủi ro UI thường gặp:**
> Ở V1 Schema, việc Client chọn ứng viên (Accept) KHÔNG ĐỒNG NGHĨA với việc Expert có thể bắt tay vào làm ngay. UI Agent bắt buộc phải xây dựng thêm màn hình **"Chờ Expert ký Hợp đồng"**. Chỉ khi nào Contract chuyển sang `ACTIVE`, chức năng submit kết quả của Expert mới được mở khóa.
> Ngoài ra, tiền sẽ bị giam (Escrow) ngay lập tức lúc Client Accept, nên UI cần gọi lại hàm lấy `user.wallet` để cập nhật số dư hiển thị!

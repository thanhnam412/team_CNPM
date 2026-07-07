# Sơ đồ Luồng (Flowchart): Finance & Wallet (Từ góc nhìn Backend)

Sơ đồ mô tả quy trình nạp tiền, quản lý ví (Wallet) và lịch sử giao dịch (Transactions). Số dư của User không còn nằm trên bảng User nữa mà được tách riêng.

```mermaid
graph TD
    %% Style definitions
    classDef ui fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND
    subgraph Frontend ["Frontend UI (Finance Page)"]
        UI_Wallet["Xem Số Dư & Lịch Sử"]:::ui
        UI_Deposit["Nạp Tiền (Deposit)"]:::ui
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_Me["GET /api/users/me<br/>(Lấy thông tin Wallet)"]:::api
        API_Trans["GET /api/finance/transactions"]:::api
        API_Deposit["POST /api/finance/deposit<br/>(Mô phỏng Stripe/VNPay)"]:::api
    end

    UI_Wallet --> API_Me
    UI_Wallet --> API_Trans
    UI_Deposit --> API_Deposit

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_User[("users")]:::db
        DB_Wallet[("wallets<br/>(balance, totalSpent)")]:::db
        DB_Trans[("transactions<br/>(amount, type: DEPOSIT)")]:::db

        API_Me --> DB_User
        API_Me -.->|"Join"| DB_Wallet

        API_Trans --> DB_Trans

        API_Deposit -->|"Cộng Balance"| DB_Wallet
        API_Deposit -->|"Ghi log"| DB_Trans
    end
```

> [!IMPORTANT]
> UI Agent cần chú ý: Khi render số dư trên Navbar, dữ liệu sẽ nằm ở `user.wallet.balance` (Data Transfer Object: `MeProfileDto`), không còn là `user.balance` như V0 nữa. Hàm Deposit ở Backend hiện đã tự động tính toán `balanceAfter` và lưu vào bảng transaction.

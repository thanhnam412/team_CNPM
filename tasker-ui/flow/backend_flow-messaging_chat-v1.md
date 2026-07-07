# Sơ đồ Luồng (Flowchart): Messaging & Chat (Từ góc nhìn Backend)

Sơ đồ mô tả luồng giao tiếp thời gian thực (hoặc near-realtime) giữa Client và Expert/Team. Dữ liệu tin nhắn được quản lý theo mô hình Hội thoại (Conversations) và Người tham gia (Participants).

```mermaid
graph TD
    %% Style definitions
    classDef ui fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef api fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef db fill:#f3e5f5,stroke:#6a1b9a,stroke-width:2px;

    %% FRONTEND
    subgraph Frontend ["Frontend UI (Messages Page)"]
        UI_Inbox["Inbox<br/>(Danh sách Chat)"]:::ui
        UI_Chat["Chat Room<br/>(Chi tiết tin nhắn)"]:::ui
        UI_Send["Send Message<br/>(Gửi tin nhắn)"]:::ui
    end

    %% API LAYER
    subgraph Backend ["Backend API"]
        API_List["GET /api/messages/conversations"]:::api
        API_Detail["GET /api/messages/conversations/:id"]:::api
        API_Send["POST /api/messages/conversations/:id"]:::api
    end

    UI_Inbox --> API_List
    UI_Chat --> API_Detail
    UI_Send --> API_Send

    %% DATABASE
    subgraph Database ["PostgreSQL (V1 Schema)"]
        DB_Conv[("conversations<br/>(type: DIRECT / GROUP)")]:::db
        DB_Part[("conversation_participants<br/>(userId, lastRead)")]:::db
        DB_Msg[("messages<br/>(content, senderId)")]:::db

        API_List --> DB_Conv
        API_List -.->|"Join"| DB_Part
        API_List -.->|"Latest Msg"| DB_Msg

        API_Detail --> DB_Msg

        API_Send -->|"Insert"| DB_Msg
        API_Send -.->|"Update updatedAt"| DB_Conv
    end
```

> [!NOTE]
> Mọi cuộc trò chuyện đều phải thuộc về một `conversationId`. Backend sử dụng bảng trung gian `conversation_participants` để biết user nào được quyền xem tin nhắn trong phòng chat nào. UI Agent chú ý gọi API lấy danh sách Conversations trước khi fetch tin nhắn chi tiết.

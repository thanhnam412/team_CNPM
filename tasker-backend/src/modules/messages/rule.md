# Messages Rules

## 1. Chat Context
Messages belong to a `Conversation`.
- Ensure that participants are strictly validated via the `ConversationParticipant` table before allowing them to read or send messages.

## 2. Realtime Expectation
While endpoints exist for fetching/sending, this module is expected to integrate tightly with WebSockets (Socket.io) for real-time delivery.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


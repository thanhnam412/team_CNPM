# Messages Rules

## 1. Chat Context
Messages belong to a `Conversation`.
- Ensure that participants are strictly validated via the `ConversationParticipant` table before allowing them to read or send messages.

## 2. Realtime Expectation
While endpoints exist for fetching/sending, this module is expected to integrate tightly with WebSockets (Socket.io) for real-time delivery.

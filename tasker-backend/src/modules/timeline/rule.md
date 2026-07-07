# Timeline Rules

## 1. Audit Logging & History
The Timeline module tracks major actions across the system.
- When an entity changes state (e.g., Project created, Milestone paid, Proposal accepted), a timeline event should be logged.
- Events should include context (e.g., `userId`, `actionType`, `entityId`).

## 2. Read-Only
Timeline events are immutable. Once written, they should never be updated or deleted by normal user actions.

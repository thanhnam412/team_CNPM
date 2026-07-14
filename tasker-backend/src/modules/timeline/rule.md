# Timeline Rules

## 1. Audit Logging & History
The Timeline module tracks major actions across the system.
- When an entity changes state (e.g., Project created, Milestone paid, Proposal accepted), a timeline event should be logged.
- Events should include context (e.g., `userId`, `actionType`, `entityId`).

## 2. Read-Only
Timeline events are immutable. Once written, they should never be updated or deleted by normal user actions.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


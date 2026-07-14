# Milestones Rules

## 1. Budget and Escrow
Milestones are the primary financial building block of a `Project`.
- A Milestone has a specific `budget`.
- When an Expert is assigned via a `Proposal`, the `Contracts` logic handles moving the Milestone budget into `escrowBalance` on the Wallet.
- Do NOT manage budget at the `Task` level.

## 2. Status Flow
Milestones move from `PENDING` -> `ACTIVE` -> `REVIEW` -> `PAID`.
- Only transition to `PAID` once the client has approved the deliverables and the funds are ready to move from Escrow to the Expert's wallet balance.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


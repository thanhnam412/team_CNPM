# Milestones Rules

## 1. Budget and Escrow
Milestones are the primary financial building block of a `Project`.
- A Milestone has a specific `budget`.
- When an Expert is assigned via a `Proposal`, the `Contracts` logic handles moving the Milestone budget into `escrowBalance` on the Wallet.
- Do NOT manage budget at the `Task` level.

## 2. Status Flow
Milestones move from `PENDING` -> `ACTIVE` -> `REVIEW` -> `PAID`.
- Only transition to `PAID` once the client has approved the deliverables and the funds are ready to move from Escrow to the Expert's wallet balance.

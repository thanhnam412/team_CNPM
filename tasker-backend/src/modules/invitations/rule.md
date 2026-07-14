# Proposals & Invitations Rules

## 1. Use Proposals, Not Bids
The entity for applying to jobs is called a **Proposal**.
- `bids` is a deprecated term across the codebase.
- A `Proposal` can be linked to either a `quickTaskId` or a `milestoneId`.

## 2. Contracts Generation
When a `Proposal` or `Invitation` changes status to `ACCEPTED`, the system MUST generate a row in the `contracts` table.
- The `contracts` table links the `clientId`, `expertId`, and tracks the `escrowStatus`.

## 3. Invitations Flow
Invitations are sent by Clients to Experts. If accepted, similar to proposals, it results in a contract being established.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


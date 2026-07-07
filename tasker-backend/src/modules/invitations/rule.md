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

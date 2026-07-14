# Users Rules

## 1. No Balance on Users
The `balance` field has been entirely stripped from the `users` table.
- All balance and financial state must be fetched and updated through the `wallets` table.
- Join `users` and `wallets` on `userId` to retrieve balances.

## 2. No CVs or Portfolios
Legacy tables like `CV`, `Portfolios`, `Educations` are deprecated.
- Expert-specific fields (skills, bio, rate, portfolio link) reside exclusively in `expert_profiles`.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


# Finance & Payments Rules

## 1. Wallets over Users
User balances must **never** be stored or retrieved from the `users` table directly. Always join or query the `wallets` table.
- Use `wallet.balance` and `wallet.escrowBalance`.

## 2. Transactions Strict Types
When inserting into the `transactions` table, you must provide:
- `status` (e.g., `'COMPLETED'`, `'PENDING'`)
- `type` (e.g., `'DEPOSIT'`, `'ESCROW'`, `'PAYMENT_RECEIVED'`)
- `source` (e.g., `'System'`, `'Stripe'`, etc.)
- Do not let these default unless specifically designed to.

## 3. Escrow Flow
When dealing with `Contracts` or `Milestones`, money should first be moved to `wallet.escrowBalance`. Only upon `COMPLETED` or `PAID` statuses should the money move to `wallet.balance`.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


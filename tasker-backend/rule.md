# Tasker Backend API Rules & Guidelines

These rules dictate the architectural choices, schema paradigms, and coding conventions for the `tasker-backend` project. Any AI agent or developer contributing to this backend MUST adhere to these guidelines.

## 1. Core Architecture
- **Framework:** NestJS.
- **Database:** PostgreSQL.
- **Query Builder:** Kysely.
- **ORM / Schema Management:** Prisma (Used strictly for schema definition and migrations. **DO NOT** use Prisma Client for data fetching).

## 2. Database & Data Access
- **No Prisma Client:** All data access in services must be written using Kysely (e.g., `this.db.selectFrom(...)`, `this.db.insertInto(...)`).
- **Migrations & Syncing:** Whenever modifying `prisma/schema/*.prisma` files, you must sync the database and regenerate Kysely types by running:
  ```bash
  yarn prisma db push
  yarn generate:types
  ```
  *(Use `--force-reset` with `db push` if there are structural breaking changes in local dev).*

## 3. V1 Database Schema Paradigms (Strict Naming & Logic)
- **Finance & Wallets:**
  - User balances are stored in the `wallets` table (e.g., `wallet.balance`), **not** on the `users` table.
  - `transactions` inserts require strict, non-nullable fields: `status` (e.g., 'COMPLETED'), `type`, and `source`.
- **Marketplace vs Internal Projects:**
  - **Quick Tasks (`quick_tasks`):** Standalone freelance jobs posted to the marketplace. These are fully decoupled from internal projects.
  - **Tasks (`tasks`):** Internal, granular sub-tasks that belong to a specific `Project` or `Milestone`. Do not confuse these with Quick Tasks.
- **Proposals & Bidding:**
  - The term "Bids" is deprecated. Always use **"Proposals"** (`proposals` table) for experts applying to Quick Tasks or Milestones.
- **Expert Profiles:**
  - The legacy `CV`, `Portfolio`, and `Education` tables have been removed.
  - All expert information (bio, skills, hourly rate, portfolio URL) is consolidated into the `expert_profiles` table.

## 4. Contracts & Escrow
- **Polymorphic Contracts:** The `contracts` table is the central entity for tracking agreements between Clients and Experts.
- When a `Proposal` or `Invitation` is accepted, a `Contract` should automatically be generated to lock in the `agreedPrice` and track the `escrowStatus` (e.g., `HELD`, `RELEASED`).

## 5. Clean Code & Services
- **Service Isolation:** Keep business logic in `.service.ts` files. Controllers should remain thin and only handle HTTP request mapping.
- **Return Types:** Ensure services return well-defined structures. Avoid sending sensitive fields (like raw passwords or internal IDs) back to the client unnecessarily.

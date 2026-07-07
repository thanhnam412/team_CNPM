<!-- BEGIN:tasker-backend-rules -->
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

## 3. V1 Database Schema Paradigms (Strict Naming & Logic)
- **Finance & Wallets:** User balances are stored in the `wallets` table, **not** on the `users` table. `transactions` require strict non-nullable fields (`status`, `type`, `source`).
- **Marketplace vs Internal:** `quick_tasks` are standalone freelance jobs. `tasks` are internal project sub-tasks.
- **Proposals:** Use "Proposals" (not "Bids") for experts applying to work.
- **Expert Profiles:** CVs are deprecated; use `expert_profiles` for bio, skills, and portfolios.
- **Contracts:** The `contracts` table is the central entity tracking escrowed payments and expert-client agreements.
<!-- END:tasker-backend-rules -->

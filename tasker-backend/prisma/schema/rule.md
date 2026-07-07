# Prisma & Database Schema Rules

## 1. Prisma is for Definition Only
Prisma is strictly used as our Schema Definition Language (SDL) and for generating migrations.
- **DO NOT** use `PrismaClient` for data fetching or writing in the services.
- All querying must be done using `Kysely`.

## 2. Sync Workflow
Whenever you make a change to any `.prisma` file in `prisma/schema/`, you MUST run:
```bash
yarn prisma db push
yarn generate:types
```
*(Use `--force-reset` on `db push` if local dev encounters structural foreign key errors).*

## 3. V1 Naming Rules
- Use `wallets` instead of adding balances to `users`.
- Use `proposals` instead of `bids`.
- Use `quick_tasks` instead of `freelance_jobs` or `tasks` for the marketplace.
- Use `expert_profiles` instead of `cv`.
- Use `contracts` to lock in escrow states between Client and Expert.

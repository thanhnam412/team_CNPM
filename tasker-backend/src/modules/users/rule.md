# Users Rules

## 1. No Balance on Users
The `balance` field has been entirely stripped from the `users` table.
- All balance and financial state must be fetched and updated through the `wallets` table.
- Join `users` and `wallets` on `userId` to retrieve balances.

## 2. No CVs or Portfolios
Legacy tables like `CV`, `Portfolios`, `Educations` are deprecated.
- Expert-specific fields (skills, bio, rate, portfolio link) reside exclusively in `expert_profiles`.

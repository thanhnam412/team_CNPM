# Quick Tasks Rules (Marketplace)

## 1. Absolute Separation from Internal Tasks
`quick_tasks` are standalone, freelance marketplace jobs.
- Do NOT confuse them with `tasks`.
- They do not belong to a `Project` or `Milestone`.
- They use their own endpoints and logic.

## 2. Proposals instead of Bids
Experts do not "bid" on Quick Tasks. They submit **Proposals**.
- Join against the `proposals` table (not `bids`).

## 3. Contracts
When a Proposal for a Quick Task is accepted, a `Contract` should be created to manage the escrow and expert assignment.

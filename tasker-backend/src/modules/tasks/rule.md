# Tasks & Projects Rules (Internal Work)

## 1. Granular Sub-tasks
`tasks` are granular sub-tasks that belong specifically to a `Project` or `Milestone`.
- They are internal team workflows.
- Do NOT confuse them with `quick_tasks` (marketplace jobs).

## 2. No Budget or Escrow on Tasks
`tasks` do not have individual budgets or escrow tracking in V1.
- Budgeting and escrow are handled at the `Milestone` level or via `quick_tasks` for freelancers.

## 3. Relationships
- A `Task` must have a `projectId`.
- A `Task` can optionally have a `milestoneId`.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


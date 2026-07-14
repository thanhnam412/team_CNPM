# Projects & Milestones Rules

## 1. Top-Level Entity
`projects` is the top-level entity for internal client-agency workflows.
- A Project contains `Milestones` and `Tasks`.
- It does NOT contain `quick_tasks`.

## 2. Milestones Tracking
`Milestones` have a `budget` and an `endDate` (formerly `dueDate`).
- When funding a Milestone, rely on the `contracts` table to track the escrowed amount.

## 3. Team Management
Use `project_members` to manage internal team and experts assigned to a project.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


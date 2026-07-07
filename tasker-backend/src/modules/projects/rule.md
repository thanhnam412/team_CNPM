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

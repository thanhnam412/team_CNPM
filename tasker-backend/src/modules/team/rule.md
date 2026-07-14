# Team Rules

## 1. Project Members
The team module manages `ProjectMember` records linking `users` to `projects`.
- This is strictly for internal project staffing.
- Roles within a project (e.g., `MANAGER`, `DEVELOPER`) are scoped only to that specific `projectId`.

## 2. Experts vs Internal Team
While an `Expert` can be added to a project team once contracted, the team module is primarily for managing permissions and access control to the Project's internal `Tasks` and `Timeline`.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


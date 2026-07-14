# Experts Rules

## 1. Expert Profiles (No CVs)
All expert data must be stored in the `expert_profiles` table.
- This includes `title`, `bio`, `skills`, `hourlyRate`, `experienceYears`, and `portfolioUrl`.
- Do NOT create `CV` or `Portfolio` tables.

## 2. API Endpoints
- Profile updates hit `/api/experts/me`.
- Never use old `/api/cv/me` paths.

## ARCHITECTURE RULE: VERTICAL SLICE
**CRITICAL:** This module STRICTLY follows Vertical Slice Architecture.
- Do NOT add new business logic methods to a monolithic service file.
- Any new business action (e.g., Create, Update, Cancel, Approve) MUST be implemented in its own dedicated directory (e.g., `create/create-entity.service.ts`).
- Do NOT use a `use-cases` directory. Name the action directory exactly what the action does.


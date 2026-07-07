# Experts Rules

## 1. Expert Profiles (No CVs)
All expert data must be stored in the `expert_profiles` table.
- This includes `title`, `bio`, `skills`, `hourlyRate`, `experienceYears`, and `portfolioUrl`.
- Do NOT create `CV` or `Portfolio` tables.

## 2. API Endpoints
- Profile updates hit `/api/experts/me`.
- Never use old `/api/cv/me` paths.

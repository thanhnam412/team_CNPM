# Auth Rules

## 1. Authentication Strategy
The system relies primarily on OAuth (Google) and JWT for authentication.
- Users do NOT have passwords in the database.
- `googleId` and `email` are unique identifiers.

## 2. Default Roles
When a user signs up, they are assigned the `CLIENT` role by default.
- Roles can be dynamically switched using the `switchRole` endpoint.
- Regardless of role, they might have both an `ExpertProfile` and a `ClientProfile`.

## 3. Token Management
Use the `refresh_tokens` table for managing session lifetimes securely.

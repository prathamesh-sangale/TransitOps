# Database Auth Integration Handoff

This document defines the schema requirements that the PostgreSQL database must fulfill to support the TransitOps authentication architecture.

## Canonical `users` Table Contract
The `user.repository.js` module relies on the following schema constraints:

### Essential Columns
1. `id`: Must be a valid UUID. Extracted as the `sub` claim in the JWT.
2. `email`: Must be unique. Used for authentication lookup. Normalized to lowercase via the backend.
3. `password_hash`: Must contain the bcrypt-hashed password. Must *never* be exposed in standard API queries.
4. `role`: A string or ENUM matching the canonical TransitOps roles.
5. `is_active`: Boolean. Must accurately reflect suspension or termination status.

### Canonical Roles
The application strictly enforces:
- `FLEET_MANAGER`
- `DISPATCHER`
- `SAFETY_OFFICER`
- `FINANCIAL_ANALYST`

If the database uses a different case or variant (e.g., `Manager`, `fleet_manager`), a migration or mapping layer will be required, as the middleware uses exact string matching.

## Security Boundaries
1. **Stateless JWT**: The database does NOT store active session tokens. Logout is handled client-side.
2. **Immediate Revocation**: Because the `authenticate` middleware queries the database by `id` on every protected request, setting `is_active = false` in the database will instantly terminate the user's access across all active sessions.
3. **No Direct Role Mutation**: Standard users cannot mutate their roles or bypass active flags. This requires a protected admin endpoint or direct database administration, outside the scope of operational auth.

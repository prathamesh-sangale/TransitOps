# Authentication Architecture

This module implements the custom JWT authentication strategy for the TransitOps platform. It integrates into the primary Express backend architecture.

## Implementation Details

- **Custom JWT Strategy**: Implemented using `jsonwebtoken`. Signed symmetrically using `HS256` with a centralized `JWT_SECRET`.
- **Password Hashing**: Implemented using `bcrypt` (12 rounds default).
- **Database Identity Verification**: `authenticate` middleware verifies JWT cryptographic validity *and* queries PostgreSQL (via the user repository) on every protected request. This guarantees that deactivated users (`is_active = false`) are immediately blocked and role changes take instant effect.
- **Stateless Logout**: Logout is handled by the frontend clearing the JWT. The `/logout` endpoint exists for API consistency and acknowledgement.
- **Registration**: Not implemented by design. Operational users are provisioned via administrative seeding.

## Backend Integration Note

This code resides in the `auth` branch and is built using the intended target directory structures (`backend/src/controllers/`, `backend/src/middleware/`, etc.) in anticipation of a branch merge.

**Integration Requirements Post-Merge:**
1. Include `backend/src/routes/auth.routes.js` inside the central router (`backend/src/routes/index.js`).
2. Migrate `backend/src/config/database.js` stub to use the final backend PostgreSQL Pool.
3. Replace the inline validator interception in `auth.routes.js` with the central `validate` middleware once available.
4. Replace hardcoded API error responses with the central `ApiError` utility.
5. Reconcile the canonical roles array with the central `constants/roles.js`.

## Role-Based Access Control (RBAC) Architecture

- **Middleware Pipeline**: The backend requires `authenticate` (identity verification) to run *before* `authorize` (role verification).
- **Canonical Roles**: Operations are divided strictly among `FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, and `FINANCIAL_ANALYST`.
- **401 vs 403 Distinction**: `401 Unauthorized` means the identity could not be verified (missing token, expired token, inactive account). `403 Forbidden` means the identity is valid and active, but lacks the necessary role permissions for the specific route.
- **Route Protection**: The operational APIs (Vehicles, Trips, Drivers, etc.) must be protected using `authorize(...allowedRoles)` in the central router. See `RBAC_INTEGRATION_MATRIX.md` for the exact integration rules post-merge.

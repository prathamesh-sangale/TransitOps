# Branch Merge Integration Plan

This document outlines the recommended order of operations and the potential conflict zones for integrating the `auth` branch into the canonical `main` repository line.

## Recommended Integration Order
1. **`database` Branch Merge**: Establishes the authoritative schema (users, roles, schema versions) without application interference.
2. **`backend` Branch Merge**: Establishes the canonical layered architecture, central routing, ApiError mechanisms, and operational APIs.
3. **`auth` Branch Merge (This branch)**: Injects the security modules (`jwt`, `password`, `authenticate`, `authorize`) into the established backend architecture and applies them to the operational routes.
4. **`frontend` Branch Merge**: Integrates the frontend application, which consumes the protected endpoints and adheres to the stateless UX requirements.

## Merge Conflict Risk Audit

### Files Highly Likely to Conflict
- `backend/package.json`: Both `backend` and `auth` have independently added dependencies (e.g., `jsonwebtoken`, `bcrypt` here vs `zod`, `pg`, etc. there). Use `npm install` post-merge to reconcile `package-lock.json`.
- `backend/.env.example`: Auth added JWT secrets; Backend added DB secrets. Merge both sequentially.
- `backend/src/config/database.js`: The auth branch stub MUST be discarded in favor of the canonical PostgreSQL pool created on the backend branch.

### Files Requiring Manual Integration
- `backend/src/routes/index.js`: Must be manually updated to mount `authRoutes`.
- **Operational Route Files** (e.g., `backend/src/routes/vehicle.routes.js`): Must be manually updated to import and compose `authenticate` and `authorize(...ROLES)` precisely as detailed in `auth/RBAC_INTEGRATION_MATRIX.md`.
- `backend/src/constants/roles.js`: If the backend branch established a duplicate roles file, they must be merged to ensure only one authoritative export exists.

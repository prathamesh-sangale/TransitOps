# Backend Auth Integration Handoff

This document details the exact requirements for integrating the authentication and authorization modules built on the `auth` branch into the canonical backend application architecture.

## Overview
The `auth` branch contains integration-ready modules designed to drop seamlessly into the `backend/src/` directory. Because this branch was developed concurrently, the operational routes (Vehicles, Drivers, Trips, etc.) and central routers must be updated to apply these protections post-merge.

## 1. Required Dependencies
Ensure the following packages are present in the final `backend/package.json`:
- `jsonwebtoken`
- `bcrypt`

## 2. Environment Variables
The backend environment MUST configure:
- `JWT_SECRET`: A strong, randomly generated symmetric key (HS256).
- `JWT_EXPIRES_IN`: Recommended `8h`.
> **Critical Rule**: The application is configured to fail on startup if `JWT_SECRET` is missing in production.

## 3. Database Stub Migration
The file `backend/src/config/database.js` exists as a stub on the `auth` branch. Post-merge, ensure this file is replaced by or merged with the canonical central PostgreSQL Pool established by the backend team. The `user.repository.js` expects `import { db } from '../config/database.js'` where `db.query` is available.

## 4. Central Router Registration
The auth routes must be mounted to the central Express application.
In `backend/src/routes/index.js` (or equivalent):
```javascript
import authRoutes from './auth.routes.js';
// ...
router.use('/auth', authRoutes);
```

## 5. Middleware Pipeline Integration
The operational routes must be protected exactly as defined in `auth/RBAC_INTEGRATION_MATRIX.md`. 
The order is strictly mandatory:
1. `authenticate` (Verifies JWT and extracts active DB identity)
2. `authorize(...ROLES)` (Verifies canonical role against DB identity)
3. `validate(schema)` (Validates request payload)
4. `controller` (Executes business logic)

## 6. Error Utility Reconciliation
The auth controllers currently use hardcoded JSON responses to mimic the canonical `ApiError` format (e.g., `{ success: false, error: { code: 'FORBIDDEN', message: '...' } }`) because `ApiError.js` was not available on this branch. These controllers should be refactored to throw or use the central `ApiError` constructor for architectural consistency.

## 7. Expected Route Classifications
- **Public**: `POST /api/auth/login`, `GET /api/health`
- **Authenticated**: `GET /api/auth/me`, `POST /api/auth/logout`
- **Role Protected**: All operational mutation and read APIs.

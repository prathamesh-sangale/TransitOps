# Auth Integration Handoff

This document details the boundaries between the finalized `backend` operational logic and the pending `auth` branch integration.

## Canonical User Roles
As established in the `RBAC_ROUTE_MATRIX.md`, the canonical operational roles are:
- `FLEET_MANAGER`
- `DISPATCHER`
- `SAFETY_OFFICER`
- `FINANCIAL_ANALYST`

## Expected Users Table Fields
When the `auth` branch creates the `users` table, the minimum required fields are:
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password_hash` (String)
- `role` (String, from Canonical Roles)
- `is_active` (Boolean, default true)

## Authentication Architecture
- **Strategy**: Custom JWT (JSON Web Tokens).
- **Storage**: JWT should be stateless or stored in a separate sessions/tokens table. Do NOT store the active JWT in the core `users` table.

## Authorization Architecture
- **Strategy**: Role-Based Access Control (RBAC).
- **Rule**: Users MUST NOT be able to select their role during login/registration via the API. The role must be strictly verified against the database `users` record.
- **Rule**: Inactive users (`is_active = false`) MUST NOT be allowed to authenticate.

## Backend Route Middleware Insertion Strategy
The `backend` branch routes have been architected to accept middleware cleanly. The `auth` branch should introduce `authenticate` and `authorize` middleware functions and insert them into the route chains.

**Expected Structure Example**:
```javascript
router.post(
  '/:id/dispatch',
  authenticate,
  authorize(['DISPATCHER']),
  validate(uuidParamSchema),
  validate(dispatchTripSchema),
  asyncHandler(tripController.dispatchTrip)
);
```

## API Error Response Format
All auth errors must follow the existing canonical API error format via the `ApiError` utility.

**Example 401 Unauthorized**:
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Valid authentication token required."
  }
}
```

**Example 403 Forbidden**:
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Insufficient permissions to access this resource."
  }
}
```

## Relevant Files for Integration
- **Roles Constants**: Should be defined in `backend/src/constants/roles.js`
- **Error Handling**: `backend/src/utils/ApiError.js`
- **RBAC Matrix**: `backend/RBAC_ROUTE_MATRIX.md`

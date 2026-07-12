# Frontend RBAC Contract

This document outlines the expectations for the frontend application regarding Role-Based Access Control (RBAC) in TransitOps.

## Canonical Roles
The backend actively validates identities against four canonical operational roles.
- `FLEET_MANAGER`: High-level oversight, fleet mutation, personnel management.
- `DISPATCHER`: Tactical trip management and assignment.
- `SAFETY_OFFICER`: Oversight of personnel safety status and maintenance logs.
- `FINANCIAL_ANALYST`: Operational cost tracking (fuel, expenses) and analytics.

## Backend Authorization Behavior
The backend uses a strict `authenticate` -> `authorize` middleware composition.
- The role is derived **exclusively** from the database record connected to the JWT `sub`.
- If an account is deactivated or the role changes in the database, the backend enforcement is immediate on the next API call.
- Modifying the local frontend state or JWT payload cannot bypass these protections.

## Error Handling
The backend will return distinct HTTP status codes based on the security failure.

### 401 Unauthorized (Authentication Failure)
Returned when:
- The `Authorization` header is missing or malformed.
- The token has expired (`TOKEN_EXPIRED`).
- The token signature is invalid (`INVALID_TOKEN`).
- The user account has been deleted (`AUTHENTICATED_USER_NOT_FOUND`).
**Expected Frontend Reaction**: Clear the session (destroy the JWT) and redirect the user to the login page.

### 403 Forbidden (Authorization Failure)
Returned when:
- The token is perfectly valid, but the user does not have the required role to access the endpoint.
- The user account has been deactivated (`ACCOUNT_INACTIVE`).
**Expected Frontend Reaction**: Present an access denied banner or redirect the user to their default safe route (e.g., Dashboard). Do not inherently destroy the session unless the code is specifically `ACCOUNT_INACTIVE`.

## Expected Frontend Modularity (UX Boundaries)
The frontend should proactively hide navigation items based on the user's role to prevent unnecessary 403 errors.

- **FLEET_MANAGER**: Full read visibility, full fleet/driver management.
- **DISPATCHER**: Focused on Trips, Trip Dispatcher workflows, read access to Vehicles/Drivers.
- **SAFETY_OFFICER**: Focused on Drivers, Maintenance, and read access to Vehicles.
- **FINANCIAL_ANALYST**: Focused on Fuel, Expenses, and high-level Analytics.

> **Warning**: Frontend route hiding is UX only. The backend remains authoritative and will actively reject unauthorized API requests via the `authorize` middleware.

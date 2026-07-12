# RBAC Integration Matrix

This document defines the exact role-based access control (RBAC) middleware composition expected for the TransitOps operational APIs. Because the operational routes were not present on the `auth` branch during the authentication foundation build, this matrix serves as the strict guide for integrating the `authorize` middleware post-merge.

## Implementation Guide

For each protected route in the backend branch, you must insert `authenticate` and `authorize(...ROLES)` before validation and controller execution.

Example Integration:
```javascript
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

// Applied to route:
router.post(
  '/:id/dispatch', 
  authenticate, 
  authorize(ROLES.DISPATCHER),
  validate(dispatchSchema),
  controller.dispatch
);
```

## Matrix (Pending Integration)

### Dashboard & Analytics
- `GET /api/dashboard`: `authenticate` (All Roles Allowed)
- `GET /api/analytics/overview`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST)`

### Vehicles
- `GET /api/vehicles`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER)`
- `GET /api/vehicles/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER)`
- `POST /api/vehicles`: `authenticate`, `authorize(ROLES.FLEET_MANAGER)`
- `PATCH /api/vehicles/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER)`
- `POST /api/vehicles/:id/retire`: `authenticate`, `authorize(ROLES.FLEET_MANAGER)`

### Drivers
- `GET /api/drivers`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER)`
- `GET /api/drivers/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER)`
- `POST /api/drivers`: `authenticate`, `authorize(ROLES.FLEET_MANAGER)`
- `PATCH /api/drivers/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER)`
- `POST /api/drivers/:id/suspend`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`
- `POST /api/drivers/:id/restore`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`

### Trips
- `GET /api/trips`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER)`
- `GET /api/trips/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER)`
- `POST /api/trips`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER)`
- `POST /api/trips/:id/dispatch`: `authenticate`, `authorize(ROLES.DISPATCHER)`
- `POST /api/trips/:id/complete`: `authenticate`, `authorize(ROLES.DISPATCHER)`
- `POST /api/trips/:id/cancel`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER)`

### Maintenance
- `GET /api/maintenance`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`
- `GET /api/maintenance/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`
- `POST /api/maintenance`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`
- `POST /api/maintenance/:id/complete`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER)`

### Fuel
- `GET /api/fuel`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST)`
- `POST /api/fuel`: `authenticate`, `authorize(ROLES.FINANCIAL_ANALYST)`

### Expenses
- `GET /api/expenses`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST)`
- `GET /api/expenses/:id`: `authenticate`, `authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST)`
- `POST /api/expenses`: `authenticate`, `authorize(ROLES.FINANCIAL_ANALYST)`

## Auth Routes (Already Implemented)
- `POST /api/auth/login`: PUBLIC (No middleware)
- `GET /api/auth/me`: `authenticate` (No `authorize` required)
- `POST /api/auth/logout`: `authenticate` (No `authorize` required)

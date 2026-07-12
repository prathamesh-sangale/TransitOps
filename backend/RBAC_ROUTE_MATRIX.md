# RBAC Route Matrix

This matrix defines the expected authorization boundaries for the TransitOps backend. These roles are conceptual and will be implemented within the `auth` branch using JWT and RBAC middleware.

## Expected Roles
- `FLEET_MANAGER`
- `DISPATCHER`
- `SAFETY_OFFICER`
- `FINANCIAL_ANALYST`

## Dashboard & Analytics
- `GET /api/dashboard`: Authenticated operational roles
- `GET /api/analytics/overview`: FLEET_MANAGER, FINANCIAL_ANALYST

## Vehicles
- `GET /api/vehicles`: FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER
- `GET /api/vehicles/:id`: FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER
- `POST /api/vehicles`: FLEET_MANAGER
- `PATCH /api/vehicles/:id`: FLEET_MANAGER
- `POST /api/vehicles/:id/retire`: FLEET_MANAGER

## Drivers
- `GET /api/drivers`: FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER
- `GET /api/drivers/:id`: FLEET_MANAGER, DISPATCHER, SAFETY_OFFICER
- `POST /api/drivers`: FLEET_MANAGER
- `PATCH /api/drivers/:id`: FLEET_MANAGER
- `POST /api/drivers/:id/suspend`: FLEET_MANAGER, SAFETY_OFFICER
- `POST /api/drivers/:id/restore`: FLEET_MANAGER, SAFETY_OFFICER

## Trips
- `GET /api/trips`: FLEET_MANAGER, DISPATCHER
- `GET /api/trips/:id`: FLEET_MANAGER, DISPATCHER
- `POST /api/trips`: FLEET_MANAGER, DISPATCHER
- `POST /api/trips/:id/dispatch`: DISPATCHER
- `POST /api/trips/:id/complete`: DISPATCHER
- `POST /api/trips/:id/cancel`: FLEET_MANAGER, DISPATCHER

## Maintenance
- `GET /api/maintenance`: FLEET_MANAGER, SAFETY_OFFICER
- `GET /api/maintenance/:id`: FLEET_MANAGER, SAFETY_OFFICER
- `POST /api/maintenance`: FLEET_MANAGER, SAFETY_OFFICER
- `POST /api/maintenance/:id/complete`: FLEET_MANAGER, SAFETY_OFFICER

## Fuel
- `GET /api/fuel`: FLEET_MANAGER, FINANCIAL_ANALYST
- `POST /api/fuel`: FINANCIAL_ANALYST

## Expenses
- `GET /api/expenses`: FLEET_MANAGER, FINANCIAL_ANALYST
- `GET /api/expenses/:id`: FLEET_MANAGER, FINANCIAL_ANALYST
- `POST /api/expenses`: FINANCIAL_ANALYST

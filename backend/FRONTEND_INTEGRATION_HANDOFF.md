# Frontend Integration Handoff

This document provides all necessary details for the frontend to consume the finalized `backend` operational APIs. 

## API Connectivity
- **Base Prefix**: `/api`
- **Default Port**: `5000` (e.g., `http://localhost:5000/api`)
- **Authentication**: Currently **PENDING**. Endpoints are accessible without JWTs. Once the `auth` branch is merged, standard `Authorization: Bearer <token>` headers will be required.

## Standard Response Wrappers
All successful resource responses use a standard wrapper:
```json
{
  "success": true,
  "data": { ... }
}
```

Collection endpoints use a standard wrapper with pagination metadata:
```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

Error responses are strongly typed:
```json
{
  "success": false,
  "error": {
    "code": "VEHICLE_ALREADY_ASSIGNED",
    "message": "Vehicle already has an active dispatched trip."
  }
}
```

## Field Mapping (CamelCase)
The database uses `snake_case` but the API strictly provides and accepts `camelCase`. 
Examples:
- `registration_number` ➔ `registrationNumber`
- `max_load_capacity` ➔ `maxLoadCapacity`
- `dispatched_at` ➔ `dispatchedAt`

## Expected HTTP Status Codes
- `200`: Successful Reads / Successful Updates / Successful Lifecycle Actions (Dispatch, Complete, Cancel)
- `201`: Successful Resource Creation
- `400`: Bad Request (Validation errors, Invalid UUIDs)
- `404`: Resource Not Found
- `409`: Conflict (Lifecycle conflicts, duplicate assignments)
- `500`: Internal Server Error

## Implemented Flows & Endpoint Summary

### Dashboard & Analytics
- `GET /api/dashboard`: Operational summary (vehicle/trip counts, active maintenance, recent trips).
- `GET /api/analytics/overview`: High-level analytics and operational cost summary.

### Vehicles
- `GET /api/vehicles`: List vehicles (Filters: `status`, `vehicleType`, `search`).
- `GET /api/vehicles/:id`: Details.
- `POST /api/vehicles`: Create.
- `PATCH /api/vehicles/:id`: Edit.
- `POST /api/vehicles/:id/retire`: Retire vehicle (fails if ON_TRIP).

### Drivers
- `GET /api/drivers`: List drivers (Filters: `status`, `search`).
- `GET /api/drivers/:id`: Details (computes dynamic `licenseCondition`).
- `POST /api/drivers`: Create.
- `PATCH /api/drivers/:id`: Edit.
- `POST /api/drivers/:id/suspend`: Suspend driver (fails if ON_TRIP).
- `POST /api/drivers/:id/restore`: Restore driver.

### Trips (Transactional Lifecycle)
- `GET /api/trips`: List trips (Filters: `status`, `vehicleId`, `driverId`, `search`).
- `GET /api/trips/:id`: Details.
- `POST /api/trips`: Create DRAFT trip.
- `POST /api/trips/:id/dispatch`: Dispatch trip (requires `vehicleId`, `driverId`). Locks entities to avoid race conditions.
- `POST /api/trips/:id/complete`: Complete dispatched trip.
- `POST /api/trips/:id/cancel`: Cancel draft or dispatched trip.

### Maintenance (Transactional Lifecycle)
- `GET /api/maintenance`: List maintenance (Filters: `status`, `vehicleId`).
- `GET /api/maintenance/:id`: Details.
- `POST /api/maintenance`: Create active maintenance.
- `POST /api/maintenance/:id/complete`: Complete maintenance.

### Fuel
- `GET /api/fuel`: List fuel logs.
- `POST /api/fuel`: Create fuel log.

### Expenses
- `GET /api/expenses`: List expenses.
- `POST /api/expenses`: Create expense.

## Null Value Contract
Optional relations (e.g. `vehicleId`, `driverId` on DRAFT trips) or missing timestamps (e.g. `completedAt`) are returned consistently as `null`.

## Lifecycle Safety
Direct modifications of `status`, `dispatchedAt`, `completedAt`, or active `vehicleId` via a generic `PATCH` request are ignored. The operational backend strictly guards these through dedicated lifecycle POST actions (e.g., `/dispatch`, `/complete`).

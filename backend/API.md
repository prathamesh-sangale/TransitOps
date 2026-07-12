# TransitOps Backend API Reference

Base Prefix: `/api`

## General
- `GET /health`: Health check endpoint. Returns operational status.

## Vehicles
- `GET /vehicles`: List vehicles. Supports `page`, `limit`, `status`, `vehicleType`, `search` (by registration number).
- `GET /vehicles/:id`: Get vehicle details.
- `POST /vehicles`: Create a vehicle. (Expects: `registrationNumber`, `vehicleType`, `maxLoadCapacity`, optional `odometer`).
- `PATCH /vehicles/:id`: Update vehicle fields.
- `POST /vehicles/:id/retire`: Retire a vehicle (checks for active trips).

## Drivers
- `GET /drivers`: List drivers. Supports `page`, `limit`, `status`, `search` (by name).
- `GET /drivers/:id`: Get driver details. Returns derived `licenseCondition` (VALID, EXPIRING_SOON, EXPIRED).
- `POST /drivers`: Create a driver.
- `PATCH /drivers/:id`: Update driver fields.
- `POST /drivers/:id/suspend`: Suspend a driver (checks for active trips).
- `POST /drivers/:id/restore`: Restore a suspended or off-duty driver to available.

## Trips
- `GET /trips`: List trips. Supports `page`, `limit`, `status`, `vehicleId`, `driverId`, `search` (by trip number).
- `GET /trips/:id`: Get trip details. Returns nested `vehicle` and `driver` summaries.
- `POST /trips`: Create a DRAFT trip.
- `POST /trips/:id/dispatch`: Dispatch a trip. Requires `vehicleId` and `driverId`. Uses strict transactional row-level locking.
- `POST /trips/:id/complete`: Complete a DISPATCHED trip. Releases vehicle and driver.
- `POST /trips/:id/cancel`: Cancel a DRAFT or DISPATCHED trip. Releases vehicle and driver if active.

## Maintenance
- `GET /maintenance`: List maintenance records. Supports `page`, `limit`, `status`, `vehicleId`.
- `GET /maintenance/:id`: Get maintenance details. Returns nested `vehicle` summary.
- `POST /maintenance`: Create an ACTIVE maintenance record. Sets vehicle to IN_SHOP via transaction.
- `POST /maintenance/:id/complete`: Complete maintenance. Sets vehicle back to AVAILABLE via transaction.

## Fuel Logs
- `GET /fuel`: List fuel logs. Supports `page`, `limit`, `vehicleId`.
- `POST /fuel`: Add a fuel log. Uses a database transaction to safely update the vehicle's odometer.

## Expenses
- `GET /expenses`: List expenses. Supports `page`, `limit`, `category`, `vehicleId`, `tripId`.
- `GET /expenses/:id`: Get expense details.
- `POST /expenses`: Create an expense. Validates cross-associations (vehicle & trip) if both exist.

## Dashboard & Analytics
- `GET /dashboard`: Aggregated dashboard summary (vehicleStats, tripStats, activeMaintenance count, recentTrips).
- `GET /analytics/overview`: Aggregated analytics (fleetStatusDistribution, tripStatusDistribution, driverStatusDistribution, operationalCostSummary).

> Note: All endpoints will be secured by JWT and RBAC middleware in the upcoming auth integration phase.

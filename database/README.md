# TransitOps Database Documentation

This directory contains the canonical relational data model and schema for the TransitOps application.

## Database Platform
- **Database:** Supabase PostgreSQL

## Core Tables
- `users`: Core authentication and authorization identities.
- `vehicles`: Physical fleet vehicles with tracking for capacities and odometer readings.
- `drivers`: Personnel assigned to trips, with safety scores and license tracking.
- `trips`: The central operational entity defining cargo movement between locations.
- `maintenance_records`: Logs for vehicle repairs and servicing.
- `fuel_logs`: Fuel transactions tied to specific vehicles.
- `expenses`: Operational costs, which can be general, or tied to specific vehicles and/or trips.

## Canonical Enums
- `user_role`: `FLEET_MANAGER`, `DISPATCHER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`
- `vehicle_status`: `AVAILABLE`, `ON_TRIP`, `IN_SHOP`, `RETIRED`
- `driver_status`: `AVAILABLE`, `ON_TRIP`, `OFF_DUTY`, `SUSPENDED`
- `trip_status`: `DRAFT`, `DISPATCHED`, `COMPLETED`, `CANCELLED`
- `maintenance_status`: `ACTIVE`, `COMPLETED`

## Key Relationships and Integrity Constraints
- Foreign keys typically use `ON DELETE RESTRICT` to preserve historical integrity. Deleting a vehicle or driver will not cascade-delete the trips or maintenance history.
- Partial unique indexes enforce critical operational boundaries:
  - `unique_active_trip_vehicle`: Ensures a vehicle can only have one `DISPATCHED` trip at a time.
  - `unique_active_trip_driver`: Ensures a driver can only have one `DISPATCHED` trip at a time.
  - `unique_active_maintenance`: Ensures a vehicle can only have one `ACTIVE` maintenance record at a time.
- Check constraints are heavily utilized to ensure valid domain values (e.g. `cost >= 0`, `cargo_weight > 0`).

## Timestamp Strategy and Triggers
- `TIMESTAMPTZ` is used for all timestamp events.
- `DATE` is used for calendar-based dates (e.g., `license_expiry`).
- An automatic trigger `update_updated_at_column()` handles maintaining `updated_at` timestamps on all core tables.

## Operational Business-Rule Boundary
The database is responsible for *structural integrity* (e.g., ensuring a vehicle is not doubly dispatched). The *transactional workflow* (e.g., updating a vehicle to `ON_TRIP` when a trip is `DISPATCHED`) is the explicit responsibility of the backend service layer. The database does not contain implicit triggers that modify adjacent table states.

## Supabase Security Boundary
TransitOps uses a **Custom JWT** authentication model implemented in the application backend layer. The database schema does not implement Supabase Row Level Security (RLS) bound to `auth.users`, as the backend services act as the trusted executor for database operations.

## Seed Data Usage
The `seeds/01_seed_data.sql` script provides testing data.
> **WARNING:** The `password_hash` values in the seed file are DEVELOPMENT-ONLY bcrypt hashes. **Never use them in production**.

## Supabase Execution Guide
This `schema.sql` acts as an authoritative fresh installation script. To apply it:
1. Open your Supabase project.
2. Open the SQL Editor.
3. Run the entire contents of `schema.sql`.
4. Verify successful execution of all tables, enums, triggers, and partial indexes.
5. Apply the `seeds/01_seed_data.sql` script **only** in development environments.
6. Verify the tables and constraints have successfully handled the seed data.
7. Ensure you **do not expose** Supabase service role credentials to the frontend. TransitOps uses custom backend JWTs.

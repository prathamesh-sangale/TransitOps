# Backend Data Contract

This document outlines the expected database structure and how it maps to backend API models.

## Expected API Mapping
The database uses professional `snake_case`, while the backend API should use `camelCase`.
- `registration_number` → `registrationNumber`
- `max_load_capacity` → `maxLoadCapacity`
- `license_number` → `licenseNumber`
- `license_expiry` → `licenseExpiry`
- `safety_score` → `safetyScore`
- `cargo_description` → `cargoDescription`
- `cargo_weight` → `cargoWeight`
- `planned_distance` → `plannedDistance`
- `vehicle_id` → `vehicleId`
- `driver_id` → `driverId`
- `trip_number` → `tripNumber`
- `dispatched_at` → `dispatchedAt`
- `completed_at` → `completedAt`
- `cancelled_at` → `cancelledAt`
- `cancellation_reason` → `cancellationReason`
- `maintenance_type` → `maintenanceType`
- `start_date` → `startDate`
- `fuel_quantity` → `fuelQuantity`
- `fuel_cost` → `fuelCost`
- `odometer_reading` → `odometerReading`
- `logged_at` → `loggedAt`
- `expense_date` → `expenseDate`
- `trip_id` → `tripId`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

## Core Tables

### users
- **Primary Key**: `id` (UUID)
- **Important Columns**: `name` (VARCHAR), `email` (VARCHAR), `password_hash` (TEXT), `role` (user_role enum), `is_active` (BOOLEAN)
- **Nullable Fields**: None
- **Default Values**: `id` = `gen_random_uuid()`, `is_active` = `TRUE`, `created_at` / `updated_at` = `NOW()`
- **Important Constraints**: `unique_users_email_lower` (case-insensitive unique email), `char_length(name) > 0`

### vehicles
- **Primary Key**: `id` (UUID)
- **Important Columns**: `registration_number` (VARCHAR), `vehicle_type` (VARCHAR), `max_load_capacity` (NUMERIC), `odometer` (NUMERIC), `status` (vehicle_status enum)
- **Nullable Fields**: None
- **Default Values**: `id` = `gen_random_uuid()`, `status` = `AVAILABLE`
- **Important Constraints**: `registration_number` is UNIQUE and > 0 char length. `max_load_capacity > 0`, `odometer >= 0`.
- **Important Indexes**: `idx_vehicles_status`

### drivers
- **Primary Key**: `id` (UUID)
- **Important Columns**: `name` (VARCHAR), `license_number` (VARCHAR), `license_expiry` (DATE), `safety_score` (NUMERIC), `status` (driver_status enum)
- **Nullable Fields**: None
- **Default Values**: `id` = `gen_random_uuid()`, `status` = `AVAILABLE`
- **Important Constraints**: `license_number` is UNIQUE. `safety_score` BETWEEN 0 AND 100.
- **Important Indexes**: `idx_drivers_status`

### trips
- **Primary Key**: `id` (UUID)
- **Important Columns**: `trip_number`, `origin`, `destination`, `cargo_description`, `cargo_weight`, `planned_distance`, `vehicle_id`, `driver_id`, `status` (trip_status enum), timestamps.
- **Nullable Fields**: `cargo_description`, `vehicle_id`, `driver_id`, `dispatched_at`, `completed_at`, `cancelled_at`, `cancellation_reason`
- **Default Values**: `status` = `DRAFT`
- **Foreign Keys**: `vehicle_id` REFERENCES vehicles (RESTRICT), `driver_id` REFERENCES drivers (RESTRICT)
- **Important Constraints**: `cargo_weight > 0`, `planned_distance > 0`. 
- **Important Indexes**: `unique_active_trip_vehicle` (WHERE status = 'DISPATCHED'), `unique_active_trip_driver` (WHERE status = 'DISPATCHED')

### maintenance_records
- **Primary Key**: `id` (UUID)
- **Important Columns**: `vehicle_id`, `maintenance_type`, `description`, `start_date`, `completed_at`, `cost`, `status` (maintenance_status enum)
- **Nullable Fields**: `description`, `completed_at`
- **Default Values**: `cost` = 0, `status` = `ACTIVE`
- **Foreign Keys**: `vehicle_id` REFERENCES vehicles (RESTRICT)
- **Important Constraints**: `cost >= 0`
- **Important Indexes**: `unique_active_maintenance` (WHERE status = 'ACTIVE')

### fuel_logs
- **Primary Key**: `id` (UUID)
- **Important Columns**: `vehicle_id`, `fuel_quantity`, `fuel_cost`, `odometer_reading`, `logged_at`
- **Nullable Fields**: None
- **Foreign Keys**: `vehicle_id` REFERENCES vehicles (RESTRICT)
- **Important Constraints**: `fuel_quantity > 0`, `fuel_cost >= 0`, `odometer_reading >= 0`

### expenses
- **Primary Key**: `id` (UUID)
- **Important Columns**: `category`, `description`, `amount`, `expense_date`, `vehicle_id`, `trip_id`
- **Nullable Fields**: `description`, `vehicle_id`, `trip_id`
- **Foreign Keys**: `vehicle_id` REFERENCES vehicles (RESTRICT), `trip_id` REFERENCES trips (RESTRICT)
- **Important Constraints**: `amount >= 0`

## Auth Data Handoff
- **Lookup Requirements**: Email lookup must be case-insensitive (use `LOWER(email)`).
- **Passwords**: Password hash is natively bcrypt-compatible.
- **Role Enforcement**: The role comes directly from the `users` table and must not be blindly supplied via a login request.
- **Inactive Users**: Ensure that `is_active = false` results in a blocked authentication flow.
- **JWT**: JWTs are not stored within the database schema itself, they are generated statelessly by the backend.

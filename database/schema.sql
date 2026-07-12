-- TransitOps Supabase PostgreSQL Schema

-- 1. Extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Enums
CREATE TYPE user_role AS ENUM (
    'FLEET_MANAGER',
    'DISPATCHER',
    'SAFETY_OFFICER',
    'FINANCIAL_ANALYST'
);

CREATE TYPE vehicle_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'IN_SHOP',
    'RETIRED'
);

CREATE TYPE driver_status AS ENUM (
    'AVAILABLE',
    'ON_TRIP',
    'OFF_DUTY',
    'SUSPENDED'
);

CREATE TYPE trip_status AS ENUM (
    'DRAFT',
    'DISPATCHED',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE maintenance_status AS ENUM (
    'ACTIVE',
    'COMPLETED'
);

-- 3. Trigger Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Tables

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL CHECK (char_length(name) > 0),
    email VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX unique_users_email_lower ON users (LOWER(email));

-- Vehicles Table
CREATE TABLE vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(registration_number) > 0),
    vehicle_type VARCHAR(100) NOT NULL,
    max_load_capacity NUMERIC NOT NULL CHECK (max_load_capacity > 0),
    odometer NUMERIC NOT NULL CHECK (odometer >= 0),
    status vehicle_status NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drivers Table
CREATE TABLE drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL CHECK (char_length(name) > 0),
    license_number VARCHAR(100) NOT NULL UNIQUE CHECK (char_length(license_number) > 0),
    license_expiry DATE NOT NULL,
    safety_score NUMERIC NOT NULL CHECK (safety_score >= 0 AND safety_score <= 100),
    status driver_status NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trips Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_number VARCHAR(100) UNIQUE,
    origin VARCHAR(255) NOT NULL,
    destination VARCHAR(255) NOT NULL,
    cargo_description TEXT,
    cargo_weight NUMERIC NOT NULL CHECK (cargo_weight > 0),
    planned_distance NUMERIC NOT NULL CHECK (planned_distance > 0),
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id UUID REFERENCES drivers(id) ON DELETE RESTRICT,
    status trip_status NOT NULL DEFAULT 'DRAFT',
    dispatched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maintenance Records Table
CREATE TABLE maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    maintenance_type VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    completed_at TIMESTAMPTZ,
    cost NUMERIC NOT NULL DEFAULT 0 CHECK (cost >= 0),
    status maintenance_status NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Fuel Logs Table
CREATE TABLE fuel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    fuel_quantity NUMERIC NOT NULL CHECK (fuel_quantity > 0),
    fuel_cost NUMERIC NOT NULL CHECK (fuel_cost >= 0),
    odometer_reading NUMERIC NOT NULL CHECK (odometer_reading >= 0),
    logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Expenses Table
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(100) NOT NULL,
    description TEXT,
    amount NUMERIC NOT NULL CHECK (amount >= 0),
    expense_date DATE NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE RESTRICT,
    trip_id UUID REFERENCES trips(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Indexes and Constraints

-- Prevent a vehicle from having more than one active dispatched trip
CREATE UNIQUE INDEX unique_active_trip_vehicle ON trips (vehicle_id) WHERE status = 'DISPATCHED';

-- Prevent a driver from having more than one active dispatched trip
CREATE UNIQUE INDEX unique_active_trip_driver ON trips (driver_id) WHERE status = 'DISPATCHED';

-- Prevent a vehicle from having more than one active maintenance record
CREATE UNIQUE INDEX unique_active_maintenance ON maintenance_records (vehicle_id) WHERE status = 'ACTIVE';

-- Other useful indexes for queries
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_trips_vehicle_id ON trips(vehicle_id);
CREATE INDEX idx_trips_driver_id ON trips(driver_id);
CREATE INDEX idx_maintenance_vehicle_id ON maintenance_records(vehicle_id);
CREATE INDEX idx_fuel_logs_vehicle_id ON fuel_logs(vehicle_id);
CREATE INDEX idx_expenses_vehicle_id ON expenses(vehicle_id);
CREATE INDEX idx_expenses_trip_id ON expenses(trip_id);

-- 6. Triggers for updated_at

CREATE TRIGGER set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_vehicles
BEFORE UPDATE ON vehicles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_drivers
BEFORE UPDATE ON drivers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_trips
BEFORE UPDATE ON trips
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_maintenance_records
BEFORE UPDATE ON maintenance_records
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_fuel_logs
BEFORE UPDATE ON fuel_logs
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_expenses
BEFORE UPDATE ON expenses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

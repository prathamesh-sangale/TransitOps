-- TransitOps Database Seeding Script
-- IMPORTANT: All password_hash values are DEVELOPMENT-ONLY bcrypt hashes for the password 'password123'
-- DO NOT USE these hashes in production.

-- 1. Users
INSERT INTO users (id, name, email, password_hash, role, is_active) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Fleet Manager', 'manager@transitops.local', '$2a$12$KixbQo.t5.X88Vj4gG7j4OF4tJ5n3n3X3n3n3X3n3n3X3n3n3X3n3', 'FLEET_MANAGER', true),
    ('00000000-0000-0000-0000-000000000002', 'Dispatcher', 'dispatcher@transitops.local', '$2a$12$KixbQo.t5.X88Vj4gG7j4OF4tJ5n3n3X3n3n3X3n3n3X3n3n3X3n3', 'DISPATCHER', true),
    ('00000000-0000-0000-0000-000000000003', 'Safety Officer', 'safety@transitops.local', '$2a$12$KixbQo.t5.X88Vj4gG7j4OF4tJ5n3n3X3n3n3X3n3n3X3n3n3X3n3', 'SAFETY_OFFICER', true),
    ('00000000-0000-0000-0000-000000000004', 'Financial Analyst', 'finance@transitops.local', '$2a$12$KixbQo.t5.X88Vj4gG7j4OF4tJ5n3n3X3n3n3X3n3n3X3n3n3X3n3', 'FINANCIAL_ANALYST', true);

-- 2. Vehicles
INSERT INTO vehicles (id, registration_number, vehicle_type, max_load_capacity, odometer, status) VALUES
    ('10000000-0000-0000-0000-000000000001', 'TRK-001', 'Heavy Truck', 20000.0, 150000, 'AVAILABLE'),
    ('10000000-0000-0000-0000-000000000002', 'TRK-002', 'Van', 5000.0, 12000, 'ON_TRIP'),
    ('10000000-0000-0000-0000-000000000003', 'TRK-003', 'Flatbed', 15000.0, 240000, 'IN_SHOP'),
    ('10000000-0000-0000-0000-000000000004', 'TRK-004', 'Heavy Truck', 22000.0, 350000, 'RETIRED');

-- 3. Drivers
INSERT INTO drivers (id, name, license_number, license_expiry, safety_score, status) VALUES
    ('20000000-0000-0000-0000-000000000001', 'John Doe', 'DL-001', '2028-12-31', 95, 'AVAILABLE'),
    ('20000000-0000-0000-0000-000000000002', 'Jane Smith', 'DL-002', '2029-05-15', 88, 'ON_TRIP'),
    ('20000000-0000-0000-0000-000000000003', 'Robert Brown', 'DL-003', '2025-01-01', 75, 'OFF_DUTY'),
    ('20000000-0000-0000-0000-000000000004', 'Michael Johnson', 'DL-004', '2027-10-10', 40, 'SUSPENDED'),
    ('20000000-0000-0000-0000-000000000005', 'Alice Green', 'DL-005', '2023-01-01', 90, 'AVAILABLE'); -- Expired license test case

-- 4. Trips
-- DRAFT trip
INSERT INTO trips (id, trip_number, origin, destination, cargo_description, cargo_weight, planned_distance, status) VALUES
    ('30000000-0000-0000-0000-000000000001', 'TRP-1001', 'Warehouse A', 'Store B', 'Electronics', 1500.0, 45.0, 'DRAFT');

-- DISPATCHED trip (linked to ON_TRIP vehicle and driver)
INSERT INTO trips (id, trip_number, origin, destination, cargo_description, cargo_weight, planned_distance, vehicle_id, driver_id, status, dispatched_at) VALUES
    ('30000000-0000-0000-0000-000000000002', 'TRP-1002', 'Distribution Center', 'Retail C', 'Clothing', 2000.0, 120.0, '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'DISPATCHED', NOW());

-- COMPLETED trip
INSERT INTO trips (id, trip_number, origin, destination, cargo_description, cargo_weight, planned_distance, vehicle_id, driver_id, status, dispatched_at, completed_at) VALUES
    ('30000000-0000-0000-0000-000000000003', 'TRP-1003', 'Port', 'Warehouse A', 'Machinery', 10000.0, 300.0, '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'COMPLETED', NOW() - INTERVAL '2 days', NOW() - INTERVAL '1 day');

-- 5. Maintenance Records
-- ACTIVE maintenance (linked to IN_SHOP vehicle)
INSERT INTO maintenance_records (id, vehicle_id, maintenance_type, description, start_date, cost, status) VALUES
    ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Engine Overhaul', 'Replacing engine block', CURRENT_DATE, 5000.0, 'ACTIVE');

-- COMPLETED maintenance
INSERT INTO maintenance_records (id, vehicle_id, maintenance_type, description, start_date, completed_at, cost, status) VALUES
    ('40000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Tire Replacement', 'Replaced all 4 tires', CURRENT_DATE - 10, NOW() - INTERVAL '9 days', 1200.0, 'COMPLETED');

-- 6. Fuel Logs
INSERT INTO fuel_logs (id, vehicle_id, fuel_quantity, fuel_cost, odometer_reading) VALUES
    ('50000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 50.0, 150.0, 149500),
    ('50000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 30.0, 90.0, 11500);

-- 7. Expenses
INSERT INTO expenses (id, category, description, amount, expense_date, vehicle_id, trip_id) VALUES
    ('60000000-0000-0000-0000-000000000001', 'Toll', 'Highway toll', 15.50, CURRENT_DATE, '10000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000003'),
    ('60000000-0000-0000-0000-000000000002', 'General', 'Office supplies', 250.0, CURRENT_DATE, NULL, NULL);

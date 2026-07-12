import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM fuel_logs WHERE 1=1';
  const params = [];

  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND vehicle_id = $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return parseInt(rows[0].count, 10);
};

export const findAll = async ({ limit, offset, filters = {} }) => {
  let query = `
    SELECT 
      f.id, f.fuel_quantity, f.fuel_cost, f.odometer_reading, f.logged_at,
      v.id as vehicle_id, v.registration_number as vehicle_registration_number
    FROM fuel_logs f
    LEFT JOIN vehicles v ON f.vehicle_id = v.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND f.vehicle_id = $${params.length}`;
  }

  query += ` ORDER BY f.logged_at DESC`;

  if (limit) {
    params.push(limit);
    query += ` LIMIT $${params.length}`;
  }
  if (offset !== undefined) {
    params.push(offset);
    query += ` OFFSET $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return rows;
};

export const create = async (data, client = db) => {
  const query = `
    INSERT INTO fuel_logs (vehicle_id, fuel_quantity, fuel_cost, odometer_reading, logged_at)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, vehicle_id, fuel_quantity, fuel_cost, odometer_reading, logged_at
  `;
  const values = [data.vehicleId, data.fuelQuantity, data.fuelCost, data.odometerReading, data.loggedAt || new Date().toISOString()];
  const { rows } = await client.query(query, values);
  return rows[0];
};

export const updateVehicleOdometer = async (vehicleId, odometerReading, client = db) => {
  const query = `
    UPDATE vehicles
    SET odometer = $2, updated_at = NOW()
    WHERE id = $1
  `;
  await client.query(query, [vehicleId, odometerReading]);
};


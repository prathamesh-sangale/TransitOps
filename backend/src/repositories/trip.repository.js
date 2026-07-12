import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM trips WHERE 1=1';
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND vehicle_id = $${params.length}`;
  }
  if (filters.driverId) {
    params.push(filters.driverId);
    query += ` AND driver_id = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND trip_number ILIKE $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return parseInt(rows[0].count, 10);
};

export const findAll = async ({ limit, offset, filters = {} }) => {
  let query = `
    SELECT 
      t.id, t.trip_number, t.origin, t.destination, t.status, t.dispatched_at, t.completed_at, t.created_at,
      v.id as vehicle_id, v.registration_number as vehicle_registration_number,
      d.id as driver_id, d.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND t.status = $${params.length}`;
  }
  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND t.vehicle_id = $${params.length}`;
  }
  if (filters.driverId) {
    params.push(filters.driverId);
    query += ` AND t.driver_id = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND t.trip_number ILIKE $${params.length}`;
  }

  query += ` ORDER BY t.created_at DESC`;

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

export const findById = async (id) => {
  const query = `
    SELECT 
      t.*,
      v.registration_number as vehicle_registration_number, v.vehicle_type as vehicle_type, v.status as vehicle_status,
      d.name as driver_name, d.license_number as driver_license_number, d.status as driver_status
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    WHERE t.id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

export const create = async (data, client = db) => {
  const query = `
    INSERT INTO trips (trip_number, origin, destination, cargo_description, cargo_weight, planned_distance, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
  `;
  const values = [
    data.tripNumber,
    data.origin,
    data.destination,
    data.cargoDescription || null,
    data.cargoWeight,
    data.plannedDistance,
    data.status || 'DRAFT'
  ];
  const { rows } = await client.query(query, values);
  return rows[0];
};

export const findByIdForUpdate = async (id, client = db) => {
  const query = `
    SELECT *
    FROM trips
    WHERE id = $1
    FOR UPDATE
  `;
  const { rows } = await client.query(query, [id]);
  return rows[0] || null;
};

export const updateAssignmentAndStatus = async (id, data, client = db) => {
  const query = `
    UPDATE trips
    SET 
      status = $2, 
      vehicle_id = $3, 
      driver_id = $4, 
      dispatched_at = $5,
      updated_at = NOW()
    WHERE id = $1
    RETURNING *
  `;
  const values = [
    id,
    data.status,
    data.vehicleId,
    data.driverId,
    data.dispatchedAt
  ];
  const { rows } = await client.query(query, values);
  return rows[0] || null;
};

export const updateStatus = async (id, data, client = db) => {
  // Can handle status, completed_at, cancelled_at, cancellation_reason
  const setClauses = [];
  const values = [id];
  let paramIndex = 2;
  
  if (data.status) {
    setClauses.push(`status = $${paramIndex++}`);
    values.push(data.status);
  }
  if (data.completedAt !== undefined) {
    setClauses.push(`completed_at = $${paramIndex++}`);
    values.push(data.completedAt);
  }
  if (data.cancelledAt !== undefined) {
    setClauses.push(`cancelled_at = $${paramIndex++}`);
    values.push(data.cancelledAt);
  }
  if (data.cancellationReason !== undefined) {
    setClauses.push(`cancellation_reason = $${paramIndex++}`);
    values.push(data.cancellationReason);
  }
  
  setClauses.push(`updated_at = NOW()`);
  
  const query = `
    UPDATE trips
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING *
  `;
  
  const { rows } = await client.query(query, values);
  return rows[0] || null;
};


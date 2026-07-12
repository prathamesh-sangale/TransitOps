import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM vehicles WHERE 1=1';
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
  if (filters.vehicleType) {
    params.push(filters.vehicleType);
    query += ` AND vehicle_type = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND registration_number ILIKE $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return parseInt(rows[0].count, 10);
};

export const findAll = async ({ limit, offset, filters = {} }) => {
  let query = `
    SELECT id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
    FROM vehicles WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
  if (filters.vehicleType) {
    params.push(filters.vehicleType);
    query += ` AND vehicle_type = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND registration_number ILIKE $${params.length}`;
  }

  query += ` ORDER BY created_at DESC`;

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
    SELECT id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
    FROM vehicles
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
};

export const create = async (data) => {
  const query = `
    INSERT INTO vehicles (registration_number, vehicle_type, max_load_capacity, odometer, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
  `;
  const values = [data.registrationNumber, data.vehicleType, data.maxLoadCapacity, data.odometer || 0, data.status || 'AVAILABLE'];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const updateById = async (id, updates) => {
  const keys = Object.keys(updates);
  if (keys.length === 0) return null;

  // Strictly controlled column mapping
  const allowedColumns = {
    registrationNumber: 'registration_number',
    vehicleType: 'vehicle_type',
    maxLoadCapacity: 'max_load_capacity',
    odometer: 'odometer'
  };

  const setClauses = [];
  const values = [id];
  let paramIndex = 2;

  for (const key of keys) {
    if (allowedColumns[key] !== undefined) {
      setClauses.push(`${allowedColumns[key]} = $${paramIndex}`);
      values.push(updates[key]);
      paramIndex++;
    }
  }

  if (setClauses.length === 0) return null;
  
  setClauses.push(`updated_at = NOW()`);

  const query = `
    UPDATE vehicles
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
  `;
  
  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

export const updateStatus = async (id, status, client = db) => {
  const query = `
    UPDATE vehicles
    SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
  `;
  const { rows } = await client.query(query, [id, status]);
  return rows[0] || null;
};

export const findByIdForUpdate = async (id, client = db) => {
  const query = `
    SELECT id, registration_number, vehicle_type, max_load_capacity, odometer, status, created_at, updated_at
    FROM vehicles
    WHERE id = $1
    FOR UPDATE
  `;
  const { rows } = await client.query(query, [id]);
  return rows[0] || null;
};


import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM maintenance_records WHERE 1=1';
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
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
      m.id, m.maintenance_type, m.start_date, m.completed_at, m.cost, m.status, m.created_at, m.updated_at,
      v.id as vehicle_id, v.registration_number as vehicle_registration_number
    FROM maintenance_records m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND m.status = $${params.length}`;
  }
  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND m.vehicle_id = $${params.length}`;
  }

  query += ` ORDER BY m.created_at DESC`;

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
      m.*,
      v.registration_number as vehicle_registration_number
    FROM maintenance_records m
    LEFT JOIN vehicles v ON m.vehicle_id = v.id
    WHERE m.id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

export const create = async (data, client = db) => {
  const query = `
    INSERT INTO maintenance_records (vehicle_id, maintenance_type, description, start_date, cost, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
  `;
  const values = [
    data.vehicleId,
    data.maintenanceType,
    data.description || null,
    data.startDate || new Date().toISOString(),
    data.cost || 0,
    data.status || 'ACTIVE'
  ];
  const { rows } = await client.query(query, values);
  return rows[0];
};

export const findByIdForUpdate = async (id, client = db) => {
  const query = `
    SELECT *
    FROM maintenance_records
    WHERE id = $1
    FOR UPDATE
  `;
  const { rows } = await client.query(query, [id]);
  return rows[0] || null;
};

export const updateStatus = async (id, data, client = db) => {
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
  
  setClauses.push(`updated_at = NOW()`);
  
  const query = `
    UPDATE maintenance_records
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING *
  `;
  
  const { rows } = await client.query(query, values);
  return rows[0] || null;
};


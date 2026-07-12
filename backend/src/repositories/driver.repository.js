import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM drivers WHERE 1=1';
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND name ILIKE $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return parseInt(rows[0].count, 10);
};

export const findAll = async ({ limit, offset, filters = {} }) => {
  let query = `
    SELECT id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
    FROM drivers WHERE 1=1
  `;
  const params = [];

  if (filters.status) {
    params.push(filters.status);
    query += ` AND status = $${params.length}`;
  }
  if (filters.search) {
    params.push(`%${filters.search}%`);
    query += ` AND name ILIKE $${params.length}`;
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
    SELECT id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
    FROM drivers
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
};

export const create = async (data) => {
  const query = `
    INSERT INTO drivers (name, license_number, license_expiry, safety_score, status)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
  `;
  const values = [data.name, data.licenseNumber, data.licenseExpiry, data.safetyScore || 100, data.status || 'AVAILABLE'];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const updateById = async (id, updates) => {
  const keys = Object.keys(updates);
  if (keys.length === 0) return null;

  const allowedColumns = {
    name: 'name',
    licenseNumber: 'license_number',
    licenseExpiry: 'license_expiry',
    safetyScore: 'safety_score'
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
    UPDATE drivers
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
  `;
  
  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

export const updateStatus = async (id, status, client = db) => {
  const query = `
    UPDATE drivers
    SET status = $2, updated_at = NOW()
    WHERE id = $1
    RETURNING id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
  `;
  const { rows } = await client.query(query, [id, status]);
  return rows[0] || null;
};

export const findByIdForUpdate = async (id, client = db) => {
  const query = `
    SELECT id, name, license_number, license_expiry, safety_score, status, created_at, updated_at
    FROM drivers
    WHERE id = $1
    FOR UPDATE
  `;
  const { rows } = await client.query(query, [id]);
  return rows[0] || null;
};


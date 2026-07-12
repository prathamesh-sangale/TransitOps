import { db } from '../config/database.js';

export const count = async (filters = {}) => {
  let query = 'SELECT COUNT(*) FROM expenses WHERE 1=1';
  const params = [];

  if (filters.category) {
    params.push(filters.category);
    query += ` AND category = $${params.length}`;
  }
  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND vehicle_id = $${params.length}`;
  }
  if (filters.tripId) {
    params.push(filters.tripId);
    query += ` AND trip_id = $${params.length}`;
  }

  const { rows } = await db.query(query, params);
  return parseInt(rows[0].count, 10);
};

export const findAll = async ({ limit, offset, filters = {} }) => {
  let query = `
    SELECT 
      e.id, e.category, e.description, e.amount, e.expense_date, e.created_at, e.updated_at,
      v.id as vehicle_id, v.registration_number as vehicle_registration_number,
      t.id as trip_id, t.trip_number as trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    WHERE 1=1
  `;
  const params = [];

  if (filters.category) {
    params.push(filters.category);
    query += ` AND e.category = $${params.length}`;
  }
  if (filters.vehicleId) {
    params.push(filters.vehicleId);
    query += ` AND e.vehicle_id = $${params.length}`;
  }
  if (filters.tripId) {
    params.push(filters.tripId);
    query += ` AND e.trip_id = $${params.length}`;
  }

  query += ` ORDER BY e.expense_date DESC`;

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
      e.*,
      v.registration_number as vehicle_registration_number,
      t.trip_number as trip_number
    FROM expenses e
    LEFT JOIN vehicles v ON e.vehicle_id = v.id
    LEFT JOIN trips t ON e.trip_id = t.id
    WHERE e.id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

export const create = async (data) => {
  const query = `
    INSERT INTO expenses (category, description, amount, expense_date, vehicle_id, trip_id)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, category, description, amount, expense_date, vehicle_id, trip_id, created_at, updated_at
  `;
  const values = [
    data.category,
    data.description || null,
    data.amount,
    data.expenseDate || new Date().toISOString(),
    data.vehicleId || null,
    data.tripId || null
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};


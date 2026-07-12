import { db } from '../config/database.js';

export const getVehicleStats = async () => {
  const query = `SELECT status, COUNT(*) as count FROM vehicles GROUP BY status`;
  const { rows } = await db.query(query);
  return rows;
};

export const getTripStats = async () => {
  const query = `SELECT status, COUNT(*) as count FROM trips GROUP BY status`;
  const { rows } = await db.query(query);
  return rows;
};

export const getActiveMaintenanceCount = async () => {
  const query = `SELECT COUNT(*) as count FROM maintenance_records WHERE status = 'ACTIVE'`;
  const { rows } = await db.query(query);
  return parseInt(rows[0].count, 10);
};

export const getRecentTrips = async (limit = 5) => {
  const query = `
    SELECT t.id, t.trip_number, t.status, v.registration_number as vehicle_registration_number, d.name as driver_name
    FROM trips t
    LEFT JOIN vehicles v ON t.vehicle_id = v.id
    LEFT JOIN drivers d ON t.driver_id = d.id
    ORDER BY t.created_at DESC
    LIMIT $1
  `;
  const { rows } = await db.query(query, [limit]);
  return rows;
};

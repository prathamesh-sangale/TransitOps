import { db } from '../config/database.js';

export const getOperationalCostSummary = async () => {
  const query = `
    SELECT 
      COALESCE(SUM(fuel_cost), 0) as total_fuel_cost,
      (SELECT COALESCE(SUM(cost), 0) FROM maintenance_records) as total_maintenance_cost,
      (SELECT COALESCE(SUM(amount), 0) FROM expenses) as total_expenses
    FROM fuel_logs
  `;
  const { rows } = await db.query(query);
  return rows[0];
};

export const getDriverStatusDistribution = async () => {
  const query = `SELECT status, COUNT(*) as count FROM drivers GROUP BY status`;
  const { rows } = await db.query(query);
  return rows;
};

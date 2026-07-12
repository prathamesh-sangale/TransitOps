import { db } from '../config/database.js';

/**
 * Executes a callback within a database transaction.
 * The callback receives a transaction client which should be used for queries.
 */
export const withTransaction = async (callback) => {
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

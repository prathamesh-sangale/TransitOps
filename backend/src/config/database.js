import pg from 'pg';

const { Pool } = pg;

// Temporary stub for the auth branch to allow user.repository to compile
// This will be replaced by the central backend branch configuration during merge.

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export const db = {
  query: (text, params) => pool.query(text, params),
  pool
};

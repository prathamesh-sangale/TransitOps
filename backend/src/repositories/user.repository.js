import { db } from '../config/database.js';

/**
 * Finds a user by their exact normalized email address.
 * Includes all essential fields needed for login verification.
 */
export const findByEmail = async (email) => {
  const query = `
    SELECT 
      id, 
      name, 
      email, 
      password_hash, 
      role, 
      is_active
    FROM users 
    WHERE email = $1
  `;
  const { rows } = await db.query(query, [email]);
  return rows[0] || null;
};

/**
 * Finds a user by their UUID.
 * Includes all essential fields needed for JWT subject verification.
 */
export const findById = async (id) => {
  const query = `
    SELECT 
      id, 
      name, 
      email, 
      role, 
      is_active
    FROM users 
    WHERE id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

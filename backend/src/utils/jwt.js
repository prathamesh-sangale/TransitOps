import jwt from 'jsonwebtoken';

// Note: environment variables will be centralized in config/env.js 
// We process it directly here temporarily or assume env.js is available.
// Since env.js does not exist on this branch, we will read directly from process.env for now,
// but validate that JWT_SECRET exists.

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

if (!JWT_SECRET && process.env.NODE_ENV !== 'test') {
  console.error('FATAL: JWT_SECRET environment variable is missing.');
  process.exit(1);
}

export const signAccessToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: 'HS256'
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET, {
    algorithms: ['HS256']
  });
};

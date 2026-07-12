import * as userRepository from '../repositories/user.repository.js';
import { comparePassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';

import { ROLES } from '../constants/roles.js';

const CANONICAL_ROLES = Object.values(ROLES);

export const login = async (email, password) => {
  // 1. Normalize email
  const normalizedEmail = email.trim().toLowerCase();

  // 2. Lookup user by email
  const user = await userRepository.findByEmail(normalizedEmail);

  // 3. Reject if user does not exist (using uniform credential error)
  if (!user) {
    throw {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password'
    };
  }

  // 4. Verify password
  const isValidPassword = await comparePassword(password, user.password_hash);
  if (!isValidPassword) {
    throw {
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password'
    };
  }

  // 5. Verify user is active
  if (!user.is_active) {
    throw {
      code: 'ACCOUNT_INACTIVE',
      message: 'This account has been deactivated.'
    };
  }

  // 6. Validate canonical role
  if (!CANONICAL_ROLES.includes(user.role)) {
    throw {
      code: 'INVALID_USER_IDENTITY',
      message: 'User identity configuration is invalid.'
    };
  }

  // 7. Generate JWT payload
  const token = signAccessToken({
    sub: user.id
  });

  // 8. Return safe user data + token (excluding password_hash)
  return {
    accessToken: token,
    tokenType: 'Bearer',
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.is_active
    }
  };
};

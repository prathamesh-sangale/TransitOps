import { verifyAccessToken } from '../utils/jwt.js';
import * as userRepository from '../repositories/user.repository.js';
import { z } from 'zod';

import { ROLES } from '../constants/roles.js';

const CANONICAL_ROLES = Object.values(ROLES);

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Valid authentication token required.'
        }
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Valid authentication token required.'
        }
      });
    }

    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (err) {
      return res.status(401).json({
        success: false,
        error: {
          code: err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'INVALID_TOKEN',
          message: err.name === 'TokenExpiredError' ? 'Token has expired.' : 'Invalid token.'
        }
      });
    }

    const sub = decoded.sub;
    
    // Validate sub is a UUID
    const uuidSchema = z.string().uuid();
    const result = uuidSchema.safeParse(sub);
    if (!result.success) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN',
          message: 'Invalid token subject.'
        }
      });
    }

    // Load active user from database to ensure up-to-date state
    const user = await userRepository.findById(sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATED_USER_NOT_FOUND',
          message: 'The user belonging to this token no longer exists.'
        }
      });
    }

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'This account has been deactivated.'
        }
      });
    }

    if (!CANONICAL_ROLES.includes(user.role)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'INVALID_USER_IDENTITY',
          message: 'User identity configuration is invalid.'
        }
      });
    }

    // Attach safe user object to request
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.is_active
    };

    next();
  } catch (error) {
    next(error);
  }
};

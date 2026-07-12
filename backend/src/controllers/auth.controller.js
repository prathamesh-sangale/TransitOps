import * as authService from '../services/auth.service.js';

/**
 * Handle POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle GET /api/auth/me
 */
export const getCurrentUser = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle POST /api/auth/logout
 */
export const logout = async (req, res, next) => {
  try {
    // Note: stateless logout
    return res.status(200).json({
      success: true,
      data: {
        message: 'Successfully logged out.'
      }
    });
  } catch (error) {
    next(error);
  }
};

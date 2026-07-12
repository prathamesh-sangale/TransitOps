/**
 * Role-Based Access Control Middleware
 * 
 * Factory function that accepts allowed roles and returns a middleware
 * to verify if the current authenticated user has permission to proceed.
 * 
 * Must be used AFTER `authenticate` middleware.
 * 
 * @param {...string} allowedRoles - Spread array of canonical roles (e.g., ROLES.FLEET_MANAGER)
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // 1. Verify that authenticate middleware successfully ran
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'AUTHENTICATION_REQUIRED',
          message: 'Valid authentication identity required before authorization.'
        }
      });
    }

    // 2. Extract current active database-backed role from req.user
    const currentRole = req.user.role;

    // 3. Reject unknown or undefined roles
    if (!currentRole) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action'
        }
      });
    }

    // 4. Compare current role against explicit allowlist
    if (!allowedRoles.includes(currentRole)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action'
        }
      });
    }

    // 5. Authorized to proceed
    next();
  };
};

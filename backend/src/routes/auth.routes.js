import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { loginSchema } from '../validators/auth.validator.js';

// Since the central validation middleware (validate.js) is missing on this branch,
// we will temporarily implement a basic validation interceptor for login.
const validateBody = (schema) => (req, res, next) => {
  const result = schema.safeParse({ body: req.body });
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: result.error.issues
      }
    });
  }
  next();
};

const router = Router();

router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);

export default router;

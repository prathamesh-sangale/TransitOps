import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/', authenticate, asyncHandler(dashboardController.getDashboard));

export default router;

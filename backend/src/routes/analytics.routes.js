import { Router } from 'express';
import * as analyticsController from '../controllers/analytics.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/overview', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), asyncHandler(analyticsController.getAnalyticsOverview));

export default router;

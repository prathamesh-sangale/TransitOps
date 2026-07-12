import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(dashboardController.getDashboard));

export default router;

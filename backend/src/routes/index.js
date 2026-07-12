import { Router } from 'express';
import { successResponse } from '../utils/apiResponse.js';

import vehicleRoutes from './vehicle.routes.js';
import driverRoutes from './driver.routes.js';
import tripRoutes from './trip.routes.js';
import maintenanceRoutes from './maintenance.routes.js';
import fuelRoutes from './fuel.routes.js';
import expenseRoutes from './expense.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = Router();

// Health endpoint
router.get('/health', (req, res) => {
  successResponse(res, { status: 'ok' });
});

// Domain routes
router.use('/vehicles', vehicleRoutes);
router.use('/drivers', driverRoutes);
router.use('/trips', tripRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/fuel', fuelRoutes);
router.use('/expenses', expenseRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

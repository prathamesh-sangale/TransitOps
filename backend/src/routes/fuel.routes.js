import { Router } from 'express';
import * as fuelController from '../controllers/fuel.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { paginationQuerySchema } from '../validators/common.validator.js';
import { createFuelLogSchema } from '../validators/mutation.validator.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), validate(paginationQuerySchema), asyncHandler(fuelController.getFuelLogs));
router.post('/', authenticate, authorize(ROLES.FINANCIAL_ANALYST), validate(createFuelLogSchema), asyncHandler(fuelController.createFuelLog));

export default router;

import { Router } from 'express';
import * as driverController from '../controllers/driver.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createDriverSchema, updateDriverSchema } from '../validators/mutation.validator.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER), validate(paginationQuerySchema), asyncHandler(driverController.getDrivers));
router.get('/:id', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(driverController.getDriver));

router.post('/', authenticate, authorize(ROLES.FLEET_MANAGER), validate(createDriverSchema), asyncHandler(driverController.createDriver));
router.patch('/:id', authenticate, authorize(ROLES.FLEET_MANAGER), validate(uuidParamSchema), validate(updateDriverSchema), asyncHandler(driverController.updateDriver));
router.post('/:id/suspend', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(driverController.suspendDriver));
router.post('/:id/restore', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(driverController.restoreDriver));

export default router;

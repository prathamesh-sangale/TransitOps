import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenance.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createMaintenanceSchema } from '../validators/mutation.validator.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(paginationQuerySchema), asyncHandler(maintenanceController.getMaintenanceRecords));
router.get('/:id', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(maintenanceController.getMaintenance));

router.post('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(createMaintenanceSchema), asyncHandler(maintenanceController.createMaintenance));
router.post('/:id/complete', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(maintenanceController.completeMaintenance));

export default router;

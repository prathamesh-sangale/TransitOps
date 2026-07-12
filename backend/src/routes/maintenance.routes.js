import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenance.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createMaintenanceSchema } from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(maintenanceController.getMaintenanceRecords));
router.get('/:id', validate(uuidParamSchema), asyncHandler(maintenanceController.getMaintenance));

router.post('/', validate(createMaintenanceSchema), asyncHandler(maintenanceController.createMaintenance));
router.post('/:id/complete', validate(uuidParamSchema), asyncHandler(maintenanceController.completeMaintenance));

export default router;

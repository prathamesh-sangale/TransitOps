import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/mutation.validator.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER), validate(paginationQuerySchema), asyncHandler(vehicleController.getVehicles));
router.get('/:id', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER, ROLES.SAFETY_OFFICER), validate(uuidParamSchema), asyncHandler(vehicleController.getVehicle));

router.post('/', authenticate, authorize(ROLES.FLEET_MANAGER), validate(createVehicleSchema), asyncHandler(vehicleController.createVehicle));
router.patch('/:id', authenticate, authorize(ROLES.FLEET_MANAGER), validate(uuidParamSchema), validate(updateVehicleSchema), asyncHandler(vehicleController.updateVehicle));
router.post('/:id/retire', authenticate, authorize(ROLES.FLEET_MANAGER), validate(uuidParamSchema), asyncHandler(vehicleController.retireVehicle));

export default router;

import { Router } from 'express';
import * as vehicleController from '../controllers/vehicle.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createVehicleSchema, updateVehicleSchema } from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(vehicleController.getVehicles));
router.get('/:id', validate(uuidParamSchema), asyncHandler(vehicleController.getVehicle));

router.post('/', validate(createVehicleSchema), asyncHandler(vehicleController.createVehicle));
router.patch('/:id', validate(uuidParamSchema), validate(updateVehicleSchema), asyncHandler(vehicleController.updateVehicle));
router.post('/:id/retire', validate(uuidParamSchema), asyncHandler(vehicleController.retireVehicle));

export default router;

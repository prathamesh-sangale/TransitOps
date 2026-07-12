import { Router } from 'express';
import * as fuelController from '../controllers/fuel.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { paginationQuerySchema } from '../validators/common.validator.js';
import { createFuelLogSchema } from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(fuelController.getFuelLogs));
router.post('/', validate(createFuelLogSchema), asyncHandler(fuelController.createFuelLog));

export default router;

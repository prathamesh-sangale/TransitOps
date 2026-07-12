import { Router } from 'express';
import * as driverController from '../controllers/driver.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createDriverSchema, updateDriverSchema } from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(driverController.getDrivers));
router.get('/:id', validate(uuidParamSchema), asyncHandler(driverController.getDriver));

router.post('/', validate(createDriverSchema), asyncHandler(driverController.createDriver));
router.patch('/:id', validate(uuidParamSchema), validate(updateDriverSchema), asyncHandler(driverController.updateDriver));
router.post('/:id/suspend', validate(uuidParamSchema), asyncHandler(driverController.suspendDriver));
router.post('/:id/restore', validate(uuidParamSchema), asyncHandler(driverController.restoreDriver));

export default router;

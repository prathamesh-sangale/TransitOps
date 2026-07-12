import { Router } from 'express';
import * as tripController from '../controllers/trip.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { 
  createTripSchema, 
  dispatchTripSchema, 
  cancelTripSchema 
} from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(tripController.getTrips));
router.get('/:id', validate(uuidParamSchema), asyncHandler(tripController.getTrip));

router.post('/', validate(createTripSchema), asyncHandler(tripController.createTrip));
router.post('/:id/dispatch', validate(uuidParamSchema), validate(dispatchTripSchema), asyncHandler(tripController.dispatchTrip));
router.post('/:id/complete', validate(uuidParamSchema), asyncHandler(tripController.completeTrip));
router.post('/:id/cancel', validate(uuidParamSchema), validate(cancelTripSchema), asyncHandler(tripController.cancelTrip));

export default router;

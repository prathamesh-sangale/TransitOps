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
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER), validate(paginationQuerySchema), asyncHandler(tripController.getTrips));
router.get('/:id', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER), validate(uuidParamSchema), asyncHandler(tripController.getTrip));

router.post('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER), validate(createTripSchema), asyncHandler(tripController.createTrip));
router.post('/:id/dispatch', authenticate, authorize(ROLES.DISPATCHER), validate(uuidParamSchema), validate(dispatchTripSchema), asyncHandler(tripController.dispatchTrip));
router.post('/:id/complete', authenticate, authorize(ROLES.DISPATCHER), validate(uuidParamSchema), asyncHandler(tripController.completeTrip));
router.post('/:id/cancel', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.DISPATCHER), validate(uuidParamSchema), validate(cancelTripSchema), asyncHandler(tripController.cancelTrip));

export default router;

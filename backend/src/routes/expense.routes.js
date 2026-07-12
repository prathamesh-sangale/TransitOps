import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createExpenseSchema } from '../validators/mutation.validator.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();

router.get('/', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), validate(paginationQuerySchema), asyncHandler(expenseController.getExpenses));
router.get('/:id', authenticate, authorize(ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST), validate(uuidParamSchema), asyncHandler(expenseController.getExpense));

router.post('/', authenticate, authorize(ROLES.FINANCIAL_ANALYST), validate(createExpenseSchema), asyncHandler(expenseController.createExpense));

export default router;

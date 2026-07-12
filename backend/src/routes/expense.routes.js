import { Router } from 'express';
import * as expenseController from '../controllers/expense.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { uuidParamSchema, paginationQuerySchema } from '../validators/common.validator.js';
import { createExpenseSchema } from '../validators/mutation.validator.js';

const router = Router();

router.get('/', validate(paginationQuerySchema), asyncHandler(expenseController.getExpenses));
router.get('/:id', validate(uuidParamSchema), asyncHandler(expenseController.getExpense));

router.post('/', validate(createExpenseSchema), asyncHandler(expenseController.createExpense));

export default router;

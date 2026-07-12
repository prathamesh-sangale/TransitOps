import * as expenseService from '../services/expense.service.js';
import { successResponse, collectionResponse } from '../utils/apiResponse.js';

export const getExpenses = async (req, res) => {
  const result = await expenseService.getExpenses(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const getExpense = async (req, res) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  successResponse(res, expense);
};

export const createExpense = async (req, res) => {
  const expense = await expenseService.createExpense(req.body);
  successResponse(res, expense, 201);
};


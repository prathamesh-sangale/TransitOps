import * as dashboardService from '../services/dashboard.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getDashboard = async (req, res) => {
  const summary = await dashboardService.getDashboardSummary();
  successResponse(res, summary);
};

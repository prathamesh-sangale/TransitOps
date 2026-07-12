import * as analyticsService from '../services/analytics.service.js';
import { successResponse } from '../utils/apiResponse.js';

export const getAnalyticsOverview = async (req, res) => {
  const overview = await analyticsService.getAnalyticsOverview();
  successResponse(res, overview);
};

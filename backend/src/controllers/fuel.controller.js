import * as fuelService from '../services/fuel.service.js';
import { collectionResponse } from '../utils/apiResponse.js';

export const getFuelLogs = async (req, res) => {
  const result = await fuelService.getFuelLogs(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const createFuelLog = async (req, res) => {
  const log = await fuelService.createFuelLog(req.body);
  successResponse(res, log, 201);
};


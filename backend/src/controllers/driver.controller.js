import * as driverService from '../services/driver.service.js';
import { successResponse, collectionResponse } from '../utils/apiResponse.js';

export const getDrivers = async (req, res) => {
  const result = await driverService.getDrivers(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const getDriver = async (req, res) => {
  const driver = await driverService.getDriverById(req.params.id);
  successResponse(res, driver);
};

export const createDriver = async (req, res) => {
  const driver = await driverService.createDriver(req.body);
  successResponse(res, driver, 201);
};

export const updateDriver = async (req, res) => {
  const driver = await driverService.updateDriver(req.params.id, req.body);
  successResponse(res, driver);
};

export const suspendDriver = async (req, res) => {
  const driver = await driverService.suspendDriver(req.params.id);
  successResponse(res, driver);
};

export const restoreDriver = async (req, res) => {
  const driver = await driverService.restoreDriver(req.params.id);
  successResponse(res, driver);
};


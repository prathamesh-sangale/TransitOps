import * as vehicleService from '../services/vehicle.service.js';
import { successResponse, collectionResponse } from '../utils/apiResponse.js';

export const getVehicles = async (req, res) => {
  const result = await vehicleService.getVehicles(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const getVehicle = async (req, res) => {
  const vehicle = await vehicleService.getVehicleById(req.params.id);
  successResponse(res, vehicle);
};

export const createVehicle = async (req, res) => {
  const vehicle = await vehicleService.createVehicle(req.body);
  successResponse(res, vehicle, 201);
};

export const updateVehicle = async (req, res) => {
  const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
  successResponse(res, vehicle);
};

export const retireVehicle = async (req, res) => {
  const vehicle = await vehicleService.retireVehicle(req.params.id);
  successResponse(res, vehicle);
};


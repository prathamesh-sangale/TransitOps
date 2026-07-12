import * as maintenanceService from '../services/maintenance.service.js';
import { successResponse, collectionResponse } from '../utils/apiResponse.js';

export const getMaintenanceRecords = async (req, res) => {
  const result = await maintenanceService.getMaintenanceRecords(req.query);
  collectionResponse(res, result.data, result.meta);
};

export const getMaintenance = async (req, res) => {
  const record = await maintenanceService.getMaintenanceById(req.params.id);
  successResponse(res, record);
};

export const createMaintenance = async (req, res) => {
  const record = await maintenanceService.createMaintenance(req.body);
  successResponse(res, record, 201);
};

export const completeMaintenance = async (req, res) => {
  const record = await maintenanceService.completeMaintenance(req.params.id);
  successResponse(res, record);
};


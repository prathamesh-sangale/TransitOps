import * as vehicleRepository from '../repositories/vehicle.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';

export const getVehicles = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    status: query.status,
    vehicleType: query.vehicleType,
    search: query.search
  };

  const total = await vehicleRepository.count(filters);
  const rows = await vehicleRepository.findAll({ limit, offset, filters });

  return {
    data: mapArrayToCamelCase(rows),
    meta: getPaginationMeta(page, limit, total)
  };
};

export const getVehicleById = async (id) => {
  const vehicle = await vehicleRepository.findById(id);
  if (!vehicle) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
  }
  return mapFieldsToCamelCase(vehicle);
};

export const createVehicle = async (data) => {
  // Normalize
  if (data.registrationNumber) {
    data.registrationNumber = data.registrationNumber.trim().toUpperCase();
  }
  
  const created = await vehicleRepository.create(data);
  return mapFieldsToCamelCase(created);
};

export const updateVehicle = async (id, data) => {
  // Normalize
  if (data.registrationNumber) {
    data.registrationNumber = data.registrationNumber.trim().toUpperCase();
  }

  const existing = await vehicleRepository.findById(id);
  if (!existing) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
  }

  const updated = await vehicleRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(400, 'INVALID_UPDATE', 'No valid fields provided for update');
  }

  return mapFieldsToCamelCase(updated);
};

export const retireVehicle = async (id) => {
  const existing = await vehicleRepository.findById(id);
  if (!existing) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
  }
  
  if (existing.status === 'RETIRED') {
    throw new ApiError(400, 'INVALID_OPERATION', 'Vehicle is already retired');
  }
  
  if (existing.status === 'ON_TRIP') {
    throw new ApiError(400, 'VEHICLE_ON_ACTIVE_TRIP', 'Cannot retire a vehicle that is currently on a trip');
  }

  // NOTE: If we need to strictly check `active DISPATCHED trip` we could query the trips repo, 
  // but ON_TRIP status on the vehicle is the domain safeguard.
  
  const updated = await vehicleRepository.updateStatus(id, 'RETIRED');
  return mapFieldsToCamelCase(updated);
};


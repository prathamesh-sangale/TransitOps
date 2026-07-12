import * as fuelRepository from '../repositories/fuel.repository.js';
import * as vehicleRepository from '../repositories/vehicle.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';
import { withTransaction } from '../utils/transaction.js';

export const getFuelLogs = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    vehicleId: query.vehicleId
  };

  const total = await fuelRepository.count(filters);
  const rows = await fuelRepository.findAll({ limit, offset, filters });

  const formattedRows = rows.map(row => {
    const data = mapFieldsToCamelCase(row);
    if (data.vehicleId) {
      data.vehicle = { id: data.vehicleId, registrationNumber: data.vehicleRegistrationNumber };
      delete data.vehicleRegistrationNumber;
    }
    return data;
  });

  return {
    data: formattedRows,
    meta: getPaginationMeta(page, limit, total)
  };
};

export const createFuelLog = async (data) => {
  // Validate vehicle exists and check odometer
  const vehicle = await vehicleRepository.findById(data.vehicleId);
  if (!vehicle) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
  }

  // Check odometer regression
  if (data.odometerReading < vehicle.odometer) {
    throw new ApiError(400, 'INVALID_DATA', 'Fuel log odometer reading cannot be less than current vehicle odometer');
  }

  // Execute in transaction
  const created = await withTransaction(async (client) => {
    const log = await fuelRepository.create(data, client);
    if (data.odometerReading > vehicle.odometer) {
      await fuelRepository.updateVehicleOdometer(data.vehicleId, data.odometerReading, client);
    }
    return log;
  });

  return mapFieldsToCamelCase(created);
};

import * as maintenanceRepository from '../repositories/maintenance.repository.js';
import * as vehicleRepository from '../repositories/vehicle.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';
import { withTransaction } from '../utils/transaction.js';

export const getMaintenanceRecords = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    status: query.status,
    vehicleId: query.vehicleId
  };

  const total = await maintenanceRepository.count(filters);
  const rows = await maintenanceRepository.findAll({ limit, offset, filters });

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

export const getMaintenanceById = async (id) => {
  const record = await maintenanceRepository.findById(id);
  if (!record) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Maintenance record not found');
  }
  const data = mapFieldsToCamelCase(record);
  if (data.vehicleId) {
    data.vehicle = { id: data.vehicleId, registrationNumber: data.vehicleRegistrationNumber };
    delete data.vehicleRegistrationNumber;
  }
  return data;
};

export const createMaintenance = async (data) => {
  return await withTransaction(async (client) => {
    // 1. Lock Vehicle
    const vehicle = await vehicleRepository.findByIdForUpdate(data.vehicleId, client);
    if (!vehicle) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');

    if (vehicle.status === 'ON_TRIP') {
      throw new ApiError(409, 'VEHICLE_ON_ACTIVE_TRIP', 'Vehicle is currently on a trip');
    }
    if (vehicle.status === 'RETIRED') {
      throw new ApiError(409, 'VEHICLE_RETIRED', 'Retired vehicles cannot enter maintenance');
    }
    if (vehicle.status === 'IN_SHOP') {
      throw new ApiError(409, 'VEHICLE_ALREADY_IN_MAINTENANCE', 'Vehicle is already in maintenance');
    }

    // 2. Create Maintenance
    const created = await maintenanceRepository.create(data, client);

    // 3. Update Vehicle Status
    await vehicleRepository.updateStatus(data.vehicleId, 'IN_SHOP', client);

    return mapFieldsToCamelCase(created);
  });
};

export const completeMaintenance = async (id) => {
  return await withTransaction(async (client) => {
    // 1. Lock Maintenance
    const record = await maintenanceRepository.findByIdForUpdate(id, client);
    if (!record) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Maintenance record not found');
    if (record.status !== 'ACTIVE') {
      throw new ApiError(409, 'MAINTENANCE_NOT_COMPLETABLE', 'Only ACTIVE maintenance can be completed');
    }

    // 2. Lock Vehicle
    const vehicle = await vehicleRepository.findByIdForUpdate(record.vehicle_id, client);
    if (!vehicle) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
    
    if (vehicle.status !== 'IN_SHOP') {
      throw new ApiError(409, 'OPERATIONAL_INCONSISTENCY', 'Vehicle is not IN_SHOP');
    }

    // 3. Update Maintenance
    const updated = await maintenanceRepository.updateStatus(id, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    }, client);

    // 4. Update Vehicle Status
    await vehicleRepository.updateStatus(record.vehicle_id, 'AVAILABLE', client);

    return mapFieldsToCamelCase(updated);
  });
};


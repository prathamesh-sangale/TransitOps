import * as driverRepository from '../repositories/driver.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';

const determineLicenseCondition = (expiryDate) => {
  if (!expiryDate) return 'UNKNOWN';
  const now = new Date();
  const expiry = new Date(expiryDate);
  if (expiry < now) return 'EXPIRED';
  
  // Expiring soon if within 30 days
  const thirtyDays = new Date(now);
  thirtyDays.setDate(thirtyDays.getDate() + 30);
  if (expiry <= thirtyDays) return 'EXPIRING_SOON';
  
  return 'VALID';
};

export const getDrivers = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    status: query.status,
    search: query.search
  };

  const total = await driverRepository.count(filters);
  const rows = await driverRepository.findAll({ limit, offset, filters });

  const formattedRows = rows.map(row => {
    const data = mapFieldsToCamelCase(row);
    data.licenseCondition = determineLicenseCondition(data.licenseExpiry);
    return data;
  });

  return {
    data: formattedRows,
    meta: getPaginationMeta(page, limit, total)
  };
};

export const getDriverById = async (id) => {
  const driver = await driverRepository.findById(id);
  if (!driver) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
  }
  const data = mapFieldsToCamelCase(driver);
  data.licenseCondition = determineLicenseCondition(data.licenseExpiry);
  return data;
};

export const createDriver = async (data) => {
  if (data.licenseNumber) {
    data.licenseNumber = data.licenseNumber.trim();
  }
  
  const created = await driverRepository.create(data);
  const result = mapFieldsToCamelCase(created);
  result.licenseCondition = determineLicenseCondition(result.licenseExpiry);
  return result;
};

export const updateDriver = async (id, data) => {
  if (data.licenseNumber) {
    data.licenseNumber = data.licenseNumber.trim();
  }

  const existing = await driverRepository.findById(id);
  if (!existing) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
  }

  const updated = await driverRepository.updateById(id, data);
  if (!updated) {
    throw new ApiError(400, 'INVALID_UPDATE', 'No valid fields provided for update');
  }

  const result = mapFieldsToCamelCase(updated);
  result.licenseCondition = determineLicenseCondition(result.licenseExpiry);
  return result;
};

export const suspendDriver = async (id) => {
  const existing = await driverRepository.findById(id);
  if (!existing) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
  }
  
  if (existing.status === 'SUSPENDED') {
    return mapFieldsToCamelCase(existing);
  }
  
  if (existing.status === 'ON_TRIP') {
    throw new ApiError(400, 'DRIVER_ON_ACTIVE_TRIP', 'Cannot suspend a driver that is currently on a trip');
  }

  const updated = await driverRepository.updateStatus(id, 'SUSPENDED');
  const result = mapFieldsToCamelCase(updated);
  result.licenseCondition = determineLicenseCondition(result.licenseExpiry);
  return result;
};

export const restoreDriver = async (id) => {
  const existing = await driverRepository.findById(id);
  if (!existing) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
  }
  
  if (existing.status !== 'SUSPENDED' && existing.status !== 'OFF_DUTY') {
    throw new ApiError(400, 'INVALID_OPERATION', 'Driver is already available or on a trip');
  }
  
  const updated = await driverRepository.updateStatus(id, 'AVAILABLE');
  const result = mapFieldsToCamelCase(updated);
  result.licenseCondition = determineLicenseCondition(result.licenseExpiry);
  return result;
};


import * as tripRepository from '../repositories/trip.repository.js';
import * as vehicleRepository from '../repositories/vehicle.repository.js';
import * as driverRepository from '../repositories/driver.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';
import { withTransaction } from '../utils/transaction.js';
import crypto from 'crypto';

export const getTrips = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    status: query.status,
    vehicleId: query.vehicleId,
    driverId: query.driverId,
    search: query.search
  };

  const total = await tripRepository.count(filters);
  const rows = await tripRepository.findAll({ limit, offset, filters });

  const formattedRows = rows.map(row => {
    const data = mapFieldsToCamelCase(row);
    // Nest vehicle and driver concisely
    if (data.vehicleId) {
      data.vehicle = { id: data.vehicleId, registrationNumber: data.vehicleRegistrationNumber };
      delete data.vehicleRegistrationNumber;
    }
    if (data.driverId) {
      data.driver = { id: data.driverId, name: data.driverName };
      delete data.driverName;
    }
    return data;
  });

  return {
    data: formattedRows,
    meta: getPaginationMeta(page, limit, total)
  };
};

export const getTripById = async (id) => {
  const trip = await tripRepository.findById(id);
  if (!trip) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Trip not found');
  }
  const data = mapFieldsToCamelCase(trip);
  
  if (data.vehicleId) {
    data.vehicle = {
      id: data.vehicleId,
      registrationNumber: data.vehicleRegistrationNumber,
      vehicleType: data.vehicleType,
      status: data.vehicleStatus
    };
    delete data.vehicleRegistrationNumber;
    delete data.vehicleType;
    delete data.vehicleStatus;
  }
  
  if (data.driverId) {
    data.driver = {
      id: data.driverId,
      name: data.driverName,
      licenseNumber: data.driverLicenseNumber,
      status: data.driverStatus
    };
    delete data.driverName;
    delete data.driverLicenseNumber;
    delete data.driverStatus;
  }
  
  return data;
};

// Generate deterministic Trip ID: TRP-YYYYMMDD-HEX
const generateTripNumber = () => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const hex = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `TRP-${date}-${hex}`;
};

export const createTrip = async (data) => {
  data.tripNumber = generateTripNumber();
  data.status = 'DRAFT';
  const created = await tripRepository.create(data);
  return mapFieldsToCamelCase(created);
};

export const dispatchTrip = async (id, data) => {
  return await withTransaction(async (client) => {
    // 1. Lock Trip
    const trip = await tripRepository.findByIdForUpdate(id, client);
    if (!trip) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Trip not found');
    if (trip.status !== 'DRAFT') throw new ApiError(409, 'TRIP_NOT_DISPATCHABLE', 'Only DRAFT trips can be dispatched');

    // 2. Lock Vehicle
    const vehicle = await vehicleRepository.findByIdForUpdate(data.vehicleId, client);
    if (!vehicle) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
    if (vehicle.status !== 'AVAILABLE') throw new ApiError(409, 'VEHICLE_NOT_AVAILABLE', 'Vehicle is not available');
    if (Number(trip.cargo_weight) > Number(vehicle.max_load_capacity)) {
      throw new ApiError(409, 'VEHICLE_CAPACITY_EXCEEDED', 'Cargo weight exceeds vehicle capacity');
    }

    // 3. Lock Driver
    const driver = await driverRepository.findByIdForUpdate(data.driverId, client);
    if (!driver) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
    if (driver.status !== 'AVAILABLE') throw new ApiError(409, 'DRIVER_NOT_AVAILABLE', 'Driver is not available');
    
    // Check license expiry
    const today = new Date().toISOString().split('T')[0];
    if (driver.license_expiry < today) {
      throw new ApiError(409, 'DRIVER_LICENSE_EXPIRED', 'Driver license is expired');
    }

    // 4. Updates
    const updatedTrip = await tripRepository.updateAssignmentAndStatus(id, {
      status: 'DISPATCHED',
      vehicleId: data.vehicleId,
      driverId: data.driverId,
      dispatchedAt: new Date().toISOString()
    }, client);

    await vehicleRepository.updateStatus(data.vehicleId, 'ON_TRIP', client);
    await driverRepository.updateStatus(data.driverId, 'ON_TRIP', client);

    return mapFieldsToCamelCase(updatedTrip);
  });
};

export const completeTrip = async (id) => {
  return await withTransaction(async (client) => {
    // 1. Lock Trip
    const trip = await tripRepository.findByIdForUpdate(id, client);
    if (!trip) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Trip not found');
    if (trip.status !== 'DISPATCHED') throw new ApiError(409, 'TRIP_NOT_COMPLETABLE', 'Only DISPATCHED trips can be completed');

    // 2. Lock Vehicle
    const vehicle = await vehicleRepository.findByIdForUpdate(trip.vehicle_id, client);
    if (!vehicle) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Vehicle not found');
    if (vehicle.status !== 'ON_TRIP') throw new ApiError(409, 'OPERATIONAL_INCONSISTENCY', 'Vehicle is not ON_TRIP');

    // 3. Lock Driver
    const driver = await driverRepository.findByIdForUpdate(trip.driver_id, client);
    if (!driver) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Driver not found');
    if (driver.status !== 'ON_TRIP') throw new ApiError(409, 'OPERATIONAL_INCONSISTENCY', 'Driver is not ON_TRIP');

    // 4. Updates
    const updatedTrip = await tripRepository.updateStatus(id, {
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    }, client);

    await vehicleRepository.updateStatus(trip.vehicle_id, 'AVAILABLE', client);
    await driverRepository.updateStatus(trip.driver_id, 'AVAILABLE', client);

    return mapFieldsToCamelCase(updatedTrip);
  });
};

export const cancelTrip = async (id, data) => {
  return await withTransaction(async (client) => {
    // 1. Lock Trip
    const trip = await tripRepository.findByIdForUpdate(id, client);
    if (!trip) throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Trip not found');
    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
      throw new ApiError(409, 'TRIP_NOT_CANCELLABLE', 'Completed or cancelled trips cannot be cancelled');
    }

    const updates = {
      status: 'CANCELLED',
      cancelledAt: new Date().toISOString(),
      cancellationReason: data.reason || null
    };

    // If dispatched, we must lock and release vehicle/driver
    if (trip.status === 'DISPATCHED') {
      const vehicle = await vehicleRepository.findByIdForUpdate(trip.vehicle_id, client);
      if (vehicle && vehicle.status === 'ON_TRIP') {
        await vehicleRepository.updateStatus(trip.vehicle_id, 'AVAILABLE', client);
      } else {
        throw new ApiError(409, 'OPERATIONAL_INCONSISTENCY', 'Vehicle is not ON_TRIP');
      }

      const driver = await driverRepository.findByIdForUpdate(trip.driver_id, client);
      if (driver && driver.status === 'ON_TRIP') {
        await driverRepository.updateStatus(trip.driver_id, 'AVAILABLE', client);
      } else {
        throw new ApiError(409, 'OPERATIONAL_INCONSISTENCY', 'Driver is not ON_TRIP');
      }
    }

    // 2. Update Trip
    const updatedTrip = await tripRepository.updateStatus(id, updates, client);
    return mapFieldsToCamelCase(updatedTrip);
  });
};


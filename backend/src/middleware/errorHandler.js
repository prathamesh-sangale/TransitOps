import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'Something went wrong on the server.';
  let details = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.code) {
    // Basic PostgreSQL error mapping
    switch (err.code) {
      case '22P02':
        statusCode = 400;
        code = 'INVALID_DATA_FORMAT';
        message = 'Invalid data format provided (e.g. invalid UUID).';
        break;
      case '23505':
        statusCode = 409;
        code = 'CONFLICT';
        message = 'A resource with this unique value already exists.';
        if (err.constraint === 'vehicles_registration_number_key') {
          code = 'VEHICLE_REGISTRATION_EXISTS';
          message = 'A vehicle with this registration number already exists.';
        } else if (err.constraint === 'drivers_license_number_key') {
          code = 'DRIVER_LICENSE_EXISTS';
          message = 'A driver with this license number already exists.';
        } else if (err.constraint === 'trips_vehicle_active_assignment_idx' || err.constraint?.includes('active_vehicle_trip')) {
          code = 'VEHICLE_ALREADY_ASSIGNED';
          message = 'Vehicle already has an active dispatched trip.';
        } else if (err.constraint === 'trips_driver_active_assignment_idx' || err.constraint?.includes('active_driver_trip')) {
          code = 'DRIVER_ALREADY_ASSIGNED';
          message = 'Driver already has an active dispatched trip.';
        } else if (err.constraint === 'maintenance_vehicle_active_idx' || err.constraint?.includes('active_maintenance')) {
          code = 'VEHICLE_ALREADY_IN_MAINTENANCE';
          message = 'Vehicle already has an active maintenance record.';
        }
        break;
      case '23503':
        statusCode = 400;
        code = 'FOREIGN_KEY_VIOLATION';
        message = 'Referenced resource does not exist.';
        break;
      case '23514':
        statusCode = 400;
        code = 'CHECK_VIOLATION';
        message = 'Input violates a database check constraint.';
        break;
    }
  }

  const response = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      ...(env.NODE_ENV === 'development' && { stack: err.stack })
    }
  };

  res.status(statusCode).json(response);
};

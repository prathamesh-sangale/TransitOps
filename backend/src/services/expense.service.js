import * as expenseRepository from '../repositories/expense.repository.js';
import * as vehicleRepository from '../repositories/vehicle.repository.js';
import * as tripRepository from '../repositories/trip.repository.js';
import { getPaginationOptions, getPaginationMeta } from '../utils/pagination.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';
import { ApiError } from '../utils/ApiError.js';

export const getExpenses = async (query) => {
  const { page, limit, offset } = getPaginationOptions(query);
  const filters = {
    category: query.category,
    vehicleId: query.vehicleId,
    tripId: query.tripId
  };

  const total = await expenseRepository.count(filters);
  const rows = await expenseRepository.findAll({ limit, offset, filters });

  const formattedRows = rows.map(row => {
    const data = mapFieldsToCamelCase(row);
    if (data.vehicleId) {
      data.vehicle = { id: data.vehicleId, registrationNumber: data.vehicleRegistrationNumber };
      delete data.vehicleRegistrationNumber;
    }
    if (data.tripId) {
      data.trip = { id: data.tripId, tripNumber: data.tripNumber };
    }
    return data;
  });

  return {
    data: formattedRows,
    meta: getPaginationMeta(page, limit, total)
  };
};

export const getExpenseById = async (id) => {
  const expense = await expenseRepository.findById(id);
  if (!expense) {
    throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Expense not found');
  }
  const data = mapFieldsToCamelCase(expense);
  if (data.vehicleId) {
    data.vehicle = { id: data.vehicleId, registrationNumber: data.vehicleRegistrationNumber };
    delete data.vehicleRegistrationNumber;
  }
  if (data.tripId) {
    data.trip = { id: data.tripId, tripNumber: data.tripNumber };
  }
  return data;
};

export const createExpense = async (data) => {
  // Validate associations if provided
  if (data.vehicleId) {
    const vehicle = await vehicleRepository.findById(data.vehicleId);
    if (!vehicle) {
      throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Referenced vehicle not found');
    }
  }

  if (data.tripId) {
    const trip = await tripRepository.findById(data.tripId);
    if (!trip) {
      throw new ApiError(404, 'RESOURCE_NOT_FOUND', 'Referenced trip not found');
    }
    
    // Check association consistency if both provided
    if (data.vehicleId && trip.vehicle_id && trip.vehicle_id !== data.vehicleId) {
      throw new ApiError(400, 'INVALID_DATA', 'Expense vehicle does not match trip vehicle');
    }
  }

  const created = await expenseRepository.create(data);
  return mapFieldsToCamelCase(created);
};


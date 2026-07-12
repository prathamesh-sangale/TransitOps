import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    registrationNumber: z.string().trim().min(1, 'Registration number is required'),
    vehicleType: z.string().trim().min(1, 'Vehicle type is required'),
    maxLoadCapacity: z.number().positive('Max load capacity must be positive'),
    odometer: z.number().min(0, 'Odometer cannot be negative').optional()
  }).strict()
});

export const updateVehicleSchema = z.object({
  body: z.object({
    registrationNumber: z.string().trim().min(1).optional(),
    vehicleType: z.string().trim().min(1).optional(),
    maxLoadCapacity: z.number().positive().optional(),
    odometer: z.number().min(0).optional()
  }).strict()
});

export const createDriverSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1, 'Name is required'),
    licenseNumber: z.string().trim().min(1, 'License number is required'),
    licenseExpiry: z.string().date('Invalid date format for license expiry'),
    safetyScore: z.number().min(0).max(100).optional()
  }).strict()
});

export const updateDriverSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).optional(),
    licenseNumber: z.string().trim().min(1).optional(),
    licenseExpiry: z.string().date().optional(),
    safetyScore: z.number().min(0).max(100).optional()
  }).strict()
});

export const createFuelLogSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    fuelQuantity: z.number().positive('Fuel quantity must be positive'),
    fuelCost: z.number().min(0, 'Fuel cost cannot be negative'),
    odometerReading: z.number().min(0, 'Odometer reading cannot be negative'),
    loggedAt: z.string().datetime().optional()
  }).strict()
});

export const createExpenseSchema = z.object({
  body: z.object({
    category: z.string().trim().min(1, 'Category is required'),
    description: z.string().trim().optional(),
    amount: z.number().min(0, 'Amount cannot be negative'),
    expenseDate: z.string().date().optional(),
    vehicleId: z.string().uuid().optional(),
    tripId: z.string().uuid().optional()
  }).strict()
});

export const createTripSchema = z.object({
  body: z.object({
    origin: z.string().trim().min(1, 'Origin is required'),
    destination: z.string().trim().min(1, 'Destination is required'),
    cargoDescription: z.string().trim().optional(),
    cargoWeight: z.number().positive('Cargo weight must be greater than zero'),
    plannedDistance: z.number().positive('Planned distance must be greater than zero')
  }).strict()
});

export const dispatchTripSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    driverId: z.string().uuid('Invalid driver ID')
  }).strict()
});

export const cancelTripSchema = z.object({
  body: z.object({
    reason: z.string().trim().optional()
  }).strict()
});

export const createMaintenanceSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid('Invalid vehicle ID'),
    maintenanceType: z.string().trim().min(1, 'Maintenance type is required'),
    description: z.string().trim().optional(),
    startDate: z.string().datetime().optional(),
    cost: z.number().min(0, 'Cost cannot be negative').optional()
  }).strict()
});


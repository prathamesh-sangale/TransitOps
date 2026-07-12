import * as dashboardRepository from '../repositories/dashboard.repository.js';
import { mapArrayToCamelCase } from '../utils/fieldMapper.js';

export const getDashboardSummary = async () => {
  const [vehicleStats, tripStats, activeMaintenance, recentTrips] = await Promise.all([
    dashboardRepository.getVehicleStats(),
    dashboardRepository.getTripStats(),
    dashboardRepository.getActiveMaintenanceCount(),
    dashboardRepository.getRecentTrips()
  ]);

  return {
    vehicleStats: mapArrayToCamelCase(vehicleStats),
    tripStats: mapArrayToCamelCase(tripStats),
    activeMaintenance,
    recentTrips: mapArrayToCamelCase(recentTrips)
  };
};

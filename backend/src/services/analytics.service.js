import * as analyticsRepository from '../repositories/analytics.repository.js';
import * as dashboardRepository from '../repositories/dashboard.repository.js';
import { mapArrayToCamelCase, mapFieldsToCamelCase } from '../utils/fieldMapper.js';

export const getAnalyticsOverview = async () => {
  const [
    fleetStatusDistribution,
    tripStatusDistribution,
    driverStatusDistribution,
    operationalCostSummary
  ] = await Promise.all([
    dashboardRepository.getVehicleStats(),
    dashboardRepository.getTripStats(),
    analyticsRepository.getDriverStatusDistribution(),
    analyticsRepository.getOperationalCostSummary()
  ]);

  return {
    fleetStatusDistribution: mapArrayToCamelCase(fleetStatusDistribution),
    tripStatusDistribution: mapArrayToCamelCase(tripStatusDistribution),
    driverStatusDistribution: mapArrayToCamelCase(driverStatusDistribution),
    operationalCostSummary: mapFieldsToCamelCase(operationalCostSummary)
  };
};

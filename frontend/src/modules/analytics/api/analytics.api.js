import { mockDataStore } from '../../../lib/mockDataStore';

const IS_MOCK = true;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsApi = {
  getOverview: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(800);
      
      const { vehicles, trips } = mockDataStore;

      // 1. Fleet Utilization Calculation
      const totalVehicles = vehicles.length;
      const onTripVehicles = vehicles.filter(v => v.status === 'ON_TRIP').length;
      const availableVehicles = vehicles.filter(v => v.status === 'AVAILABLE').length;
      
      // We'll define utilization loosely as ON_TRIP / Total Non-Retired for this mock
      const activeFleet = vehicles.filter(v => v.status !== 'RETIRED').length;
      const fleetUtilization = activeFleet > 0 ? Math.round((onTripVehicles / activeFleet) * 100) : 0;
      
      // 2. Avg Fuel Efficiency (Mocked logic, default 8.4)
      const avgFuelEfficiency = 8.4;

      // 3. Operational Cost (Mocked calculation based on trips)
      const baseCost = 34000;
      const tripCount = trips.length;
      const operationalCost = baseCost + (tripCount * 125); 

      // 4. Avg Vehicle ROI (Mocked logic)
      const avgVehicleROI = 14.2;

      // Fleet utilization trend (Mocked data for chart)
      const utilizationTrend = [
        { name: 'Jan', actual: 65, target: 80 },
        { name: 'Feb', actual: 68, target: 80 },
        { name: 'Mar', actual: 72, target: 80 },
        { name: 'Apr', actual: 78, target: 80 },
        { name: 'May', actual: 80, target: 80 },
        { name: 'Jun', actual: fleetUtilization, target: 80 },
      ];

      // Operational costs breakdown (Mocked data for donut)
      const costBreakdown = [
        { name: 'Fuel', value: 22145, color: '#1D4ED8' },
        { name: 'Maintenance', value: 11925, color: '#7f2500' } // Using tertiary-like color
      ];

      // Top Vehicles by ROI (Mock derived from vehicles)
      const topVehicles = vehicles
        .filter(v => v.status !== 'RETIRED')
        .slice(0, 5)
        .map((v, i) => ({
          id: v.id,
          registration: v.registration,
          roi: 15 + (4 - i) * 1.5, // Mocked ROI variation
          status: v.status,
          type: v.type
        }));

      return {
        success: true,
        data: {
          kpis: {
            fleetUtilization,
            avgFuelEfficiency,
            operationalCost,
            avgVehicleROI
          },
          charts: {
            utilizationTrend,
            costBreakdown
          },
          topVehicles
        }
      };
    }
    // Future real API call
    // const response = await axios.get('/api/analytics/overview', { params: filters });
    // return response.data;
  }
};

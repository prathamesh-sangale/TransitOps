import axios from 'axios';

const MOCK_DASHBOARD_DATA = {
  kpis: {
    activeVehicles: 42,
    totalVehicles: 50,
    activeTrips: 18,
    pendingMaintenance: 5,
    availableDrivers: 12
  },
  fleetStatus: [
    { id: 'V-101', status: 'ACTIVE', type: 'Heavy Truck', location: 'Route A' },
    { id: 'V-102', status: 'MAINTENANCE', type: 'Van', location: 'Garage' },
    { id: 'V-103', status: 'IDLE', type: 'Heavy Truck', location: 'Depot' },
    { id: 'V-104', status: 'ACTIVE', type: 'Van', location: 'Route B' },
    { id: 'V-105', status: 'ACTIVE', type: 'Light Truck', location: 'Route C' },
  ],
  recentActivity: [
    { id: 1, type: 'TRIP_STARTED', description: 'Trip #4092 started by John D.', time: '10 mins ago' },
    { id: 2, type: 'MAINTENANCE_LOGGED', description: 'V-102 flagged for brake check', time: '1 hour ago' },
    { id: 3, type: 'TRIP_COMPLETED', description: 'Trip #4088 completed', time: '2 hours ago' },
  ]
};

const IS_MOCK = true;

export const dashboardApi = {
  getOverview: async (filters) => {
    if (IS_MOCK) {
      await new Promise(resolve => setTimeout(resolve, 600)); // Simulate network
      return { success: true, data: MOCK_DASHBOARD_DATA };
    } else {
      const response = await axios.get('/api/dashboard', { params: filters });
      return response.data;
    }
  }
};

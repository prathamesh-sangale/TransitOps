import axios from 'axios';
import { mockDataStore } from '../../../lib/mockDataStore';

const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const tripApi = {
  getTrips: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(600);
      let results = [...mockDataStore.trips];
      
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter(t => t.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(t => 
          t.id.toLowerCase().includes(query) || 
          t.origin.toLowerCase().includes(query) ||
          t.destination.toLowerCase().includes(query)
        );
      }
      
      // Populate vehicle and driver data for UI
      const populatedResults = results.map(trip => {
        const vehicle = trip.vehicleId ? mockDataStore.vehicles.find(v => v.id === trip.vehicleId) : null;
        const driver = trip.driverId ? mockDataStore.drivers.find(d => d.id === trip.driverId) : null;
        return { ...trip, vehicle, driver };
      });

      return { success: true, data: populatedResults };
    }
    const response = await axios.get('/api/trips', { params: filters });
    return response.data;
  },

  getTripById: async (id) => {
    if (IS_MOCK) {
      await delay(500);
      const trip = mockDataStore.trips.find(t => t.id === id);
      if (!trip) throw new Error('Trip not found');
      
      const vehicle = trip.vehicleId ? mockDataStore.vehicles.find(v => v.id === trip.vehicleId) : null;
      const driver = trip.driverId ? mockDataStore.drivers.find(d => d.id === trip.driverId) : null;
      
      return { success: true, data: { ...trip, vehicle, driver } };
    }
    const response = await axios.get(`/api/trips/${id}`);
    return response.data;
  },

  createTrip: async (tripData) => {
    if (IS_MOCK) {
      await delay(800);
      const newTrip = {
        ...tripData,
        id: `TR-${Math.floor(Math.random() * 9000) + 1000}`,
        status: 'DRAFT',
        vehicleId: null,
        driverId: null,
        dispatchedAt: null,
      };
      mockDataStore.trips.push(newTrip);
      return { success: true, data: newTrip };
    }
    const response = await axios.post('/api/trips', tripData);
    return response.data;
  },

  dispatchTrip: async (id, { vehicleId, driverId }) => {
    if (IS_MOCK) {
      await delay(1000); // Simulate complex validation delay
      const tripIndex = mockDataStore.trips.findIndex(t => t.id === id);
      if (tripIndex === -1) throw new Error('Trip not found');
      
      const vehicleIndex = mockDataStore.vehicles.findIndex(v => v.id === vehicleId);
      if (vehicleIndex === -1) throw new Error('Vehicle not found');
      
      const driverIndex = mockDataStore.drivers.findIndex(d => d.id === driverId);
      if (driverIndex === -1) throw new Error('Driver not found');

      // Update states
      mockDataStore.trips[tripIndex] = {
        ...mockDataStore.trips[tripIndex],
        status: 'DISPATCHED',
        vehicleId,
        driverId,
        dispatchedAt: new Date().toISOString()
      };
      mockDataStore.vehicles[vehicleIndex].status = 'ON_TRIP';
      mockDataStore.drivers[driverIndex].status = 'ON_TRIP';

      return { success: true, data: mockDataStore.trips[tripIndex] };
    }
    const response = await axios.post(`/api/trips/${id}/dispatch`, { vehicleId, driverId });
    return response.data;
  },

  completeTrip: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const tripIndex = mockDataStore.trips.findIndex(t => t.id === id);
      if (tripIndex === -1) throw new Error('Trip not found');
      
      const trip = mockDataStore.trips[tripIndex];
      if (trip.status !== 'DISPATCHED') throw new Error('Only dispatched trips can be completed');

      // Update states
      mockDataStore.trips[tripIndex].status = 'COMPLETED';
      
      if (trip.vehicleId) {
        const vehicleIndex = mockDataStore.vehicles.findIndex(v => v.id === trip.vehicleId);
        if (vehicleIndex !== -1) mockDataStore.vehicles[vehicleIndex].status = 'AVAILABLE';
      }
      if (trip.driverId) {
        const driverIndex = mockDataStore.drivers.findIndex(d => d.id === trip.driverId);
        if (driverIndex !== -1) mockDataStore.drivers[driverIndex].status = 'AVAILABLE';
      }

      return { success: true, data: mockDataStore.trips[tripIndex] };
    }
    const response = await axios.post(`/api/trips/${id}/complete`);
    return response.data;
  },

  cancelTrip: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const tripIndex = mockDataStore.trips.findIndex(t => t.id === id);
      if (tripIndex === -1) throw new Error('Trip not found');
      
      const trip = mockDataStore.trips[tripIndex];
      
      mockDataStore.trips[tripIndex].status = 'CANCELLED';
      
      // Release resources if dispatched
      if (trip.vehicleId) {
        const vehicleIndex = mockDataStore.vehicles.findIndex(v => v.id === trip.vehicleId);
        if (vehicleIndex !== -1) mockDataStore.vehicles[vehicleIndex].status = 'AVAILABLE';
      }
      if (trip.driverId) {
        const driverIndex = mockDataStore.drivers.findIndex(d => d.id === trip.driverId);
        if (driverIndex !== -1) mockDataStore.drivers[driverIndex].status = 'AVAILABLE';
      }

      return { success: true, data: mockDataStore.trips[tripIndex] };
    }
    const response = await axios.post(`/api/trips/${id}/cancel`);
    return response.data;
  }
};

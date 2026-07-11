import axios from 'axios';
import { mockDataStore } from '../../../lib/mockDataStore';

const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vehicleApi = {
  getVehicles: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(600);
      let results = [...mockDataStore.vehicles];
      
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter(v => v.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(v => 
          v.id.toLowerCase().includes(query) || 
          v.registration.toLowerCase().includes(query)
        );
      }
      
      return { success: true, data: results };
    }
    const response = await axios.get('/api/vehicles', { params: filters });
    return response.data;
  },

  getVehicleById: async (id) => {
    if (IS_MOCK) {
      await delay(500);
      const vehicle = mockDataStore.vehicles.find(v => v.id === id);
      if (!vehicle) throw new Error('Vehicle not found');
      return { success: true, data: vehicle };
    }
    const response = await axios.get(`/api/vehicles/${id}`);
    return response.data;
  },

  createVehicle: async (vehicleData) => {
    if (IS_MOCK) {
      await delay(800);
      const newVehicle = {
        ...vehicleData,
        id: `V-${Math.floor(Math.random() * 900) + 100}`,
        status: vehicleData.status || 'AVAILABLE',
      };
      mockDataStore.vehicles.push(newVehicle);
      return { success: true, data: newVehicle };
    }
    const response = await axios.post('/api/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, updateData) => {
    if (IS_MOCK) {
      await delay(800);
      const index = mockDataStore.vehicles.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockDataStore.vehicles[index] = { ...mockDataStore.vehicles[index], ...updateData };
      return { success: true, data: mockDataStore.vehicles[index] };
    }
    const response = await axios.patch(`/api/vehicles/${id}`, updateData);
    return response.data;
  },

  retireVehicle: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const index = mockDataStore.vehicles.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      mockDataStore.vehicles[index].status = 'RETIRED';
      return { success: true, data: mockDataStore.vehicles[index] };
    }
    const response = await axios.post(`/api/vehicles/${id}/retire`);
    return response.data;
  }
};

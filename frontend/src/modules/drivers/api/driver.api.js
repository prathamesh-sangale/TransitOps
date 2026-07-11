import axios from 'axios';
import { mockDataStore } from '../../../lib/mockDataStore';

const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const driverApi = {
  getDrivers: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(600);
      let results = [...mockDataStore.drivers];
      
      if (filters.status && filters.status !== 'ALL') {
        results = results.filter(d => d.status === filters.status);
      }
      if (filters.search) {
        const query = filters.search.toLowerCase();
        results = results.filter(d => 
          d.name.toLowerCase().includes(query) || 
          d.licenseNumber.toLowerCase().includes(query)
        );
      }
      
      return { success: true, data: results };
    }
    const response = await axios.get('/api/drivers', { params: filters });
    return response.data;
  },

  getDriverById: async (id) => {
    if (IS_MOCK) {
      await delay(500);
      const driver = mockDataStore.drivers.find(d => d.id === id);
      if (!driver) throw new Error('Driver not found');
      return { success: true, data: driver };
    }
    const response = await axios.get(`/api/drivers/${id}`);
    return response.data;
  },

  createDriver: async (driverData) => {
    if (IS_MOCK) {
      await delay(800);
      const newDriver = {
        ...driverData,
        id: `D-${Math.floor(Math.random() * 900) + 100}`,
        status: driverData.status || 'AVAILABLE',
      };
      mockDataStore.drivers.push(newDriver);
      return { success: true, data: newDriver };
    }
    const response = await axios.post('/api/drivers', driverData);
    return response.data;
  },

  updateDriver: async (id, updateData) => {
    if (IS_MOCK) {
      await delay(800);
      const index = mockDataStore.drivers.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      mockDataStore.drivers[index] = { ...mockDataStore.drivers[index], ...updateData };
      return { success: true, data: mockDataStore.drivers[index] };
    }
    const response = await axios.patch(`/api/drivers/${id}`, updateData);
    return response.data;
  },

  suspendDriver: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const index = mockDataStore.drivers.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      mockDataStore.drivers[index].status = 'SUSPENDED';
      return { success: true, data: mockDataStore.drivers[index] };
    }
    const response = await axios.post(`/api/drivers/${id}/suspend`);
    return response.data;
  }
};

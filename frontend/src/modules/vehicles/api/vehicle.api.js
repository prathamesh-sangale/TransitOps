import axios from 'axios';

// Mock data
let MOCK_VEHICLES = [
  { id: 'V-101', registration: 'MH-12-TX-8842', type: 'Heavy Truck', capacity: '15000 kg', odometer: 45020, status: 'AVAILABLE', location: 'Depot A' },
  { id: 'V-102', registration: 'MH-14-AB-1234', type: 'Van', capacity: '2000 kg', odometer: 12050, status: 'ON_TRIP', location: 'Route B' },
  { id: 'V-103', registration: 'MH-04-XY-9999', type: 'Light Truck', capacity: '5000 kg', odometer: 32100, status: 'IN_SHOP', location: 'Garage 1' },
  { id: 'V-104', registration: 'KA-01-EE-5555', type: 'Heavy Truck', capacity: '18000 kg', odometer: 88000, status: 'AVAILABLE', location: 'Depot B' },
  { id: 'V-105', registration: 'DL-09-CD-7777', type: 'Heavy Truck', capacity: '15000 kg', odometer: 155000, status: 'RETIRED', location: 'Scrapyard' },
];

const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const vehicleApi = {
  getVehicles: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(600);
      let results = [...MOCK_VEHICLES];
      
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
      const vehicle = MOCK_VEHICLES.find(v => v.id === id);
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
      MOCK_VEHICLES.push(newVehicle);
      return { success: true, data: newVehicle };
    }
    const response = await axios.post('/api/vehicles', vehicleData);
    return response.data;
  },

  updateVehicle: async (id, updateData) => {
    if (IS_MOCK) {
      await delay(800);
      const index = MOCK_VEHICLES.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      MOCK_VEHICLES[index] = { ...MOCK_VEHICLES[index], ...updateData };
      return { success: true, data: MOCK_VEHICLES[index] };
    }
    const response = await axios.patch(`/api/vehicles/${id}`, updateData);
    return response.data;
  },

  retireVehicle: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const index = MOCK_VEHICLES.findIndex(v => v.id === id);
      if (index === -1) throw new Error('Vehicle not found');
      MOCK_VEHICLES[index].status = 'RETIRED';
      return { success: true, data: MOCK_VEHICLES[index] };
    }
    const response = await axios.post(`/api/vehicles/${id}/retire`);
    return response.data;
  }
};

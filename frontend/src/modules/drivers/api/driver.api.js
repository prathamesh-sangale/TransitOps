import axios from 'axios';

// Mock data
let MOCK_DRIVERS = [
  { id: 'D-301', name: 'Marcus Thorne', licenseNumber: 'DL-9988-7766', licenseExpiry: '2026-10-15', safetyScore: 94, status: 'AVAILABLE' },
  { id: 'D-302', name: 'Sarah Jenkins', licenseNumber: 'DL-1122-3344', licenseExpiry: '2024-08-01', safetyScore: 88, status: 'ON_TRIP' },
  { id: 'D-303', name: 'David Chen', licenseNumber: 'DL-5544-3322', licenseExpiry: '2023-12-10', safetyScore: 72, status: 'SUSPENDED' },
  { id: 'D-304', name: 'Elena Rodriguez', licenseNumber: 'DL-8877-6655', licenseExpiry: '2027-01-20', safetyScore: 98, status: 'OFF_DUTY' },
];

const IS_MOCK = true;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const driverApi = {
  getDrivers: async (filters = {}) => {
    if (IS_MOCK) {
      await delay(600);
      let results = [...MOCK_DRIVERS];
      
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
      const driver = MOCK_DRIVERS.find(d => d.id === id);
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
      MOCK_DRIVERS.push(newDriver);
      return { success: true, data: newDriver };
    }
    const response = await axios.post('/api/drivers', driverData);
    return response.data;
  },

  updateDriver: async (id, updateData) => {
    if (IS_MOCK) {
      await delay(800);
      const index = MOCK_DRIVERS.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      MOCK_DRIVERS[index] = { ...MOCK_DRIVERS[index], ...updateData };
      return { success: true, data: MOCK_DRIVERS[index] };
    }
    const response = await axios.patch(`/api/drivers/${id}`, updateData);
    return response.data;
  },

  suspendDriver: async (id) => {
    if (IS_MOCK) {
      await delay(800);
      const index = MOCK_DRIVERS.findIndex(d => d.id === id);
      if (index === -1) throw new Error('Driver not found');
      MOCK_DRIVERS[index].status = 'SUSPENDED';
      return { success: true, data: MOCK_DRIVERS[index] };
    }
    const response = await axios.post(`/api/drivers/${id}/suspend`);
    return response.data;
  }
};

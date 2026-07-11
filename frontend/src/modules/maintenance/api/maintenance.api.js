import { mockDataStore } from '../../../lib/mockDataStore';

const MOCK_DELAY = 500;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const maintenanceApi = {
  getMaintenanceRecords: async (filters = {}) => {
    await delay(MOCK_DELAY);
    let records = [...mockDataStore.maintenance];
    
    if (filters.status) {
      records = records.filter(r => r.status === filters.status);
    }
    
    return { success: true, data: records };
  },

  getMaintenanceRecordById: async (id) => {
    await delay(MOCK_DELAY);
    const record = mockDataStore.maintenance.find(r => r.id === id);
    if (!record) throw new Error('Maintenance record not found');
    
    const vehicle = mockDataStore.vehicles.find(v => v.id === record.vehicleId);
    return { success: true, data: { ...record, vehicle } };
  },

  createMaintenanceRecord: async (recordData) => {
    await delay(MOCK_DELAY);
    
    const newRecord = {
      id: `M-${Math.floor(Math.random() * 10000)}`,
      ...recordData,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    mockDataStore.maintenance.push(newRecord);

    // Coordinate state: Vehicle goes to IN_SHOP
    const vehicle = mockDataStore.vehicles.find(v => v.id === recordData.vehicleId);
    if (vehicle) {
      vehicle.status = 'IN_SHOP';
    }

    return { success: true, data: newRecord };
  },

  completeMaintenanceRecord: async (id) => {
    await delay(MOCK_DELAY);
    const record = mockDataStore.maintenance.find(r => r.id === id);
    if (!record) throw new Error('Maintenance record not found');

    record.status = 'COMPLETED';
    record.completedAt = new Date().toISOString();

    // Coordinate state: Vehicle goes back to AVAILABLE (assuming not retired)
    const vehicle = mockDataStore.vehicles.find(v => v.id === record.vehicleId);
    if (vehicle && vehicle.status === 'IN_SHOP') {
      vehicle.status = 'AVAILABLE';
    }

    return { success: true, data: record };
  }
};

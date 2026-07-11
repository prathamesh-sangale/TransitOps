export const mockDataStore = {
  vehicles: [
    { id: 'V-101', registration: 'MH-12-TX-8842', type: 'Heavy Truck', capacity: '15000', odometer: 45020, status: 'AVAILABLE', location: 'Depot A' },
    { id: 'V-102', registration: 'MH-14-AB-1234', type: 'Van', capacity: '2000', odometer: 12050, status: 'ON_TRIP', location: 'Route B' },
    { id: 'V-103', registration: 'MH-04-XY-9999', type: 'Light Truck', capacity: '5000', odometer: 32100, status: 'IN_SHOP', location: 'Garage 1' },
    { id: 'V-104', registration: 'KA-01-EE-5555', type: 'Heavy Truck', capacity: '18000', odometer: 88000, status: 'AVAILABLE', location: 'Depot B' },
    { id: 'V-105', registration: 'DL-09-CD-7777', type: 'Heavy Truck', capacity: '15000', odometer: 155000, status: 'RETIRED', location: 'Scrapyard' },
  ],
  drivers: [
    { id: 'D-301', name: 'Marcus Thorne', licenseNumber: 'DL-9988-7766', licenseExpiry: '2026-10-15', safetyScore: 94, status: 'AVAILABLE' },
    { id: 'D-302', name: 'Sarah Jenkins', licenseNumber: 'DL-1122-3344', licenseExpiry: '2024-08-01', safetyScore: 88, status: 'ON_TRIP' },
    { id: 'D-303', name: 'David Chen', licenseNumber: 'DL-5544-3322', licenseExpiry: '2023-12-10', safetyScore: 72, status: 'SUSPENDED' },
    { id: 'D-304', name: 'Elena Rodriguez', licenseNumber: 'DL-8877-6655', licenseExpiry: '2027-01-20', safetyScore: 98, status: 'OFF_DUTY' },
  ],
  trips: [
    { 
      id: 'TR-8492', 
      origin: 'Warehouse North', 
      destination: 'Port Sector 7', 
      cargoDescription: 'Electronics & Hardware',
      cargoWeight: '12000',
      plannedDistance: '45',
      status: 'DISPATCHED',
      vehicleId: 'V-102',
      driverId: 'D-302',
      dispatchedAt: '2024-07-11T10:00:00Z',
    },
    { 
      id: 'TR-8493', 
      origin: 'Depot B', 
      destination: 'City Center Hub', 
      cargoDescription: 'Perishables',
      cargoWeight: '4000',
      plannedDistance: '15',
      status: 'DRAFT',
      vehicleId: null,
      driverId: null,
      dispatchedAt: null,
    }
  ]
};

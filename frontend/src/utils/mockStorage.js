const DEFAULT_DRIVERS = [
  {
    id: 'DRV-001',
    name: 'Robert Downey',
    licenseNumber: 'DL-4C-10293',
    vehicleAssigned: 'Toyota Innova (KA-03-MM-1234)',
    status: 'Available',
    rating: 4.9,
    completedRides: 284,
    phone: '+91 98765 43210',
    email: 'robert.d@ridesync.com',
    avatar: 'RD'
  },
  {
    id: 'DRV-002',
    name: 'Scarlett Johansson',
    licenseNumber: 'KA-51-M-9876',
    vehicleAssigned: 'Tata Winger (KA-51-WW-4321)',
    status: 'On Trip',
    rating: 4.8,
    completedRides: 198,
    phone: '+91 98765 43211',
    email: 'scarlett.j@ridesync.com',
    avatar: 'SJ'
  },
  {
    id: 'DRV-003',
    name: 'Chris Evans',
    licenseNumber: 'MH-02-C-5432',
    vehicleAssigned: 'Mahindra XUV500 (MH-02-XX-8765)',
    status: 'Offline',
    rating: 4.7,
    completedRides: 312,
    phone: '+91 98765 43212',
    email: 'chris.e@ridesync.com',
    avatar: 'CE'
  },
  {
    id: 'DRV-004',
    name: 'Mark Ruffalo',
    licenseNumber: 'KA-01-D-7654',
    vehicleAssigned: 'Honda City (KA-01-HC-1122)',
    status: 'Available',
    rating: 4.6,
    completedRides: 143,
    phone: '+91 98765 43213',
    email: 'mark.r@ridesync.com',
    avatar: 'MR'
  }
];

const DEFAULT_VEHICLES = [
  {
    registrationNumber: 'KA-03-MM-1234',
    model: 'Toyota Innova',
    type: 'SUV',
    capacity: 7,
    driverAssigned: 'Robert Downey',
    status: 'Active',
    maintenanceStatus: 'Serviced',
    image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80'
  },
  {
    registrationNumber: 'KA-51-WW-4321',
    model: 'Tata Winger',
    type: 'Van',
    capacity: 12,
    driverAssigned: 'Scarlett Johansson',
    status: 'Active',
    maintenanceStatus: 'Serviced',
    image: 'https://images.unsplash.com/photo-1532581291347-9c39cf10a73c?auto=format&fit=crop&w=400&q=80'
  },
  {
    registrationNumber: 'MH-02-XX-8765',
    model: 'Mahindra XUV500',
    type: 'SUV',
    capacity: 7,
    driverAssigned: 'Chris Evans',
    status: 'Active',
    maintenanceStatus: 'Needs Service',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'
  },
  {
    registrationNumber: 'KA-01-HC-1122',
    model: 'Honda City',
    type: 'Sedan',
    capacity: 4,
    driverAssigned: 'Mark Ruffalo',
    status: 'Active',
    maintenanceStatus: 'Serviced',
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=400&q=80'
  }
];

export function getMockDrivers() {
  const drivers = localStorage.getItem('ridesync_drivers');
  if (!drivers) {
    localStorage.setItem('ridesync_drivers', JSON.stringify(DEFAULT_DRIVERS));
    return DEFAULT_DRIVERS;
  }
  return JSON.parse(drivers);
}

export function saveMockDrivers(drivers) {
  localStorage.setItem('ridesync_drivers', JSON.stringify(drivers));
}

export function getMockVehicles() {
  const vehicles = localStorage.getItem('ridesync_vehicles');
  if (!vehicles) {
    localStorage.setItem('ridesync_vehicles', JSON.stringify(DEFAULT_VEHICLES));
    return DEFAULT_VEHICLES;
  }
  return JSON.parse(vehicles);
}

export function saveMockVehicles(vehicles) {
  localStorage.setItem('ridesync_vehicles', JSON.stringify(vehicles));
}

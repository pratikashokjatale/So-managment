export interface Facility {
  id: string;
  name: string;
  category: string;
  status: 'Operational' | 'In Use' | 'Maintenance' | 'Inactive';
  price: string;
  slots: string;
  color: string;
  description: string;
  managerName: string;
  managerContact: string;
  iconName: string;
  createdAt: string;
}

const DEFAULT_FACILITIES: Facility[] = [
  { 
    id: 'fac-1', 
    name: 'Squash Court', 
    category: 'Sports', 
    status: 'Operational', 
    price: '₹200/hr', 
    slots: '5/12 Booked', 
    color: '#1d4ed8',
    description: 'Standard sizing indoor squash court with professional flooring and equipment.',
    managerName: 'Alex Rivera',
    managerContact: '+91 98765 43210',
    iconName: 'SportsTennis',
    createdAt: '2026-01-15'
  },
  { 
    id: 'fac-2', 
    name: 'Table Tennis', 
    category: 'Sports', 
    status: 'Operational', 
    price: '₹100/hr', 
    slots: '8/12 Booked', 
    color: '#10b981',
    description: 'Double table tennis setups with top-tier paddles and net assemblies.',
    managerName: 'Sarah Jenkins',
    managerContact: '+91 98765 43211',
    iconName: 'SportsTennis',
    createdAt: '2026-01-16'
  },
  { 
    id: 'fac-3', 
    name: 'Home Theatre', 
    category: 'Leisure', 
    status: 'In Use', 
    price: '₹500/show', 
    slots: 'Live Slot Taken', 
    color: '#7c3aed',
    description: '4K Dolby Atmos surround sound mini multiplex theater setup.',
    managerName: 'Mike Miller',
    managerContact: '+91 98765 43212',
    iconName: 'Movie',
    createdAt: '2026-01-17'
  },
  { 
    id: 'fac-4', 
    name: 'Grand Gym', 
    category: 'Fitness', 
    status: 'Operational', 
    price: 'Included', 
    slots: '15/30 Capacity', 
    color: '#ea580c',
    description: 'Full layout cardiovascular, strength training, and aerobics gymnasium.',
    managerName: 'Chris Evans',
    managerContact: '+91 98765 43213',
    iconName: 'FitnessCenter',
    createdAt: '2026-01-18'
  },
  { 
    id: 'fac-5', 
    name: 'Steam & Sauna', 
    category: 'Wellness', 
    status: 'Maintenance', 
    price: '₹300/session', 
    slots: 'Closed', 
    color: '#ef4444',
    description: 'Premium temperature controlled wet steam and dry cedar sauna units.',
    managerName: 'Elena Rostova',
    managerContact: '+91 98765 43214',
    iconName: 'Spa',
    createdAt: '2026-01-19'
  },
  { 
    id: 'fac-6', 
    name: 'Yoga Studio', 
    category: 'Fitness', 
    status: 'Operational', 
    price: '₹150/class', 
    slots: '10/20 Enrolled', 
    color: '#db2777',
    description: 'Quiet meditative spaces equipped with premium mats and aromatherapy diffusers.',
    managerName: 'Aria Sharma',
    managerContact: '+91 98765 43215',
    iconName: 'SelfImprovement',
    createdAt: '2026-01-20'
  },
  { 
    id: 'fac-7', 
    name: 'Olympic Swimming Pool', 
    category: 'Leisure', 
    status: 'Operational', 
    price: 'Included', 
    slots: '8/25 Swimmers', 
    color: '#06b6d4',
    description: 'Beautiful temperature-controlled infinity-edge Olympic swimming pool.',
    managerName: 'Marcus Phelps',
    managerContact: '+91 98765 43217',
    iconName: 'Pool',
    createdAt: '2026-01-22'
  },
  { 
    id: 'fac-8', 
    name: 'Marbella Central Park', 
    category: 'Wellness', 
    status: 'Operational', 
    price: 'Included', 
    slots: 'Open Access', 
    color: '#16a34a',
    description: 'Lush green jogging tracks, sitting alcoves, and flower beds for relaxation.',
    managerName: 'Robert Green',
    managerContact: '+91 98765 43218',
    iconName: 'Park',
    createdAt: '2026-01-23'
  }
];

const STORAGE_KEY = 'marbella_facilities';

const isBrowser = typeof window !== 'undefined';

const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'sports':
      return '#1d4ed8';
    case 'fitness':
      return '#ea580c';
    case 'leisure':
      return '#7c3aed';
    case 'wellness':
      return '#db2777';
    default:
      return '#4b5563';
  }
};

export function getFacilities(): Facility[] {
  if (!isBrowser) return DEFAULT_FACILITIES;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACILITIES));
    return DEFAULT_FACILITIES;
  }
  try {
    const parsed = JSON.parse(data) as Facility[];
    // Proactively reset cache if it lacks the new 'Pool' icon or fac-7
    if (!parsed.some(f => f.iconName === 'Pool')) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACILITIES));
      return DEFAULT_FACILITIES;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_FACILITIES));
    return DEFAULT_FACILITIES;
  }
}

export function saveFacilities(facilities: Facility[]) {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(facilities));
  }
}

export function getFacilityById(id: string): Facility | undefined {
  const facilities = getFacilities();
  return facilities.find(f => f.id === id);
}

export function saveFacility(facility: Omit<Facility, 'createdAt' | 'id' | 'color'> & { id?: string }): Facility {
  const facilities = getFacilities();
  let savedFacility: Facility;

  const color = getCategoryColor(facility.category);

  if (facility.id) {
    // Edit
    const index = facilities.findIndex(f => f.id === facility.id);
    const existing = facilities[index];
    savedFacility = {
      ...existing,
      ...facility,
      color,
      id: facility.id,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0]
    };
    facilities[index] = savedFacility;
  } else {
    // Add new
    savedFacility = {
      ...facility,
      color,
      id: `fac-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    facilities.push(savedFacility);
  }

  saveFacilities(facilities);
  return savedFacility;
}

export function toggleFacilityStatus(id: string, active: boolean): Facility {
  const facility = getFacilityById(id);
  if (!facility) throw new Error('Facility not found');

  const newStatus = active ? 'Operational' : 'Inactive';
  return saveFacility({
    ...facility,
    status: newStatus
  });
}

export function deleteFacility(id: string) {
  const facilities = getFacilities();
  const filtered = facilities.filter(f => f.id !== id);
  saveFacilities(filtered);
}

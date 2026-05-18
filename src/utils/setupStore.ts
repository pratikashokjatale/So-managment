export interface Project {
  id: string;
  name: string;
  code: string;
  location: string;
  status: 'Active' | 'Inactive';
  description: string;
  createdAt: string;
}

export interface Tower {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  floorsCount: number;
  status: 'Active' | 'Inactive';
  description: string;
  createdAt: string;
}

export interface Flat {
  id: string;
  projectId: string;
  projectName: string;
  towerId: string;
  towerName: string;
  number: string;
  floor: string;
  type: '1BHK' | '2BHK' | '3BHK' | '4BHK' | 'Studio' | 'Penthouse';
  status: 'Vacant' | 'Occupied' | 'Maintenance';
  ownerName?: string;
  createdAt: string;
}

const DEFAULT_PROJECTS: Project[] = [
  {
    id: 'prj-1',
    name: 'Marbella Club',
    code: 'MC01',
    location: 'Goa, India',
    status: 'Active',
    description: 'High-end luxury resort style clubhouse and residences.',
    createdAt: '2026-01-10'
  },
  {
    id: 'prj-2',
    name: 'Skyline Heights',
    code: 'SH02',
    location: 'Mumbai, India',
    status: 'Active',
    description: 'Modern premium high-rise residences with panoramic views.',
    createdAt: '2026-02-15'
  },
  {
    id: 'prj-3',
    name: 'Palm Oasis Residency',
    code: 'PO03',
    location: 'Goa, India',
    status: 'Active',
    description: 'Exclusive sea-facing villas and premium clubhouse complexes.',
    createdAt: '2026-03-01'
  },
  {
    id: 'prj-4',
    name: 'Emerald Green Estate',
    code: 'EG04',
    location: 'Pune, India',
    status: 'Active',
    description: 'Lush green ecological living spaces with smart automated amenities.',
    createdAt: '2026-03-10'
  }
];

const DEFAULT_TOWERS: Tower[] = [
  {
    id: 'twr-1',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    name: 'Tower A',
    floorsCount: 12,
    status: 'Active',
    description: 'Premium beachfront facing tower.',
    createdAt: '2026-01-11'
  },
  {
    id: 'twr-2',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    name: 'Tower B',
    floorsCount: 10,
    status: 'Active',
    description: 'Luxury residences near clubhouse.',
    createdAt: '2026-01-12'
  },
  {
    id: 'twr-3',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    name: 'East Wing',
    floorsCount: 25,
    status: 'Active',
    description: 'Sunrise-facing premium flats.',
    createdAt: '2026-02-16'
  },
  {
    id: 'twr-4',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    name: 'West Wing',
    floorsCount: 25,
    status: 'Active',
    description: 'Sunset view elite suites.',
    createdAt: '2026-02-17'
  },
  {
    id: 'twr-5',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    name: 'Oasis Block A',
    floorsCount: 8,
    status: 'Active',
    description: 'Breathtaking sea panoramic suites.',
    createdAt: '2026-03-02'
  },
  {
    id: 'twr-6',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    name: 'Oasis Block B',
    floorsCount: 8,
    status: 'Active',
    description: 'Modern luxury boutique flats.',
    createdAt: '2026-03-03'
  },
  {
    id: 'twr-7',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    name: 'Emerald Wing A',
    floorsCount: 15,
    status: 'Active',
    description: 'Eco-designed energy-saving suites.',
    createdAt: '2026-03-11'
  },
  {
    id: 'twr-8',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    name: 'Emerald Wing B',
    floorsCount: 15,
    status: 'Active',
    description: 'Smart automated luxury flat series.',
    createdAt: '2026-03-12'
  }
];

const DEFAULT_FLATS: Flat[] = [
  {
    id: 'flt-1',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    towerId: 'twr-1',
    towerName: 'Tower A',
    number: '101',
    floor: '1st Floor',
    type: '3BHK',
    status: 'Occupied',
    ownerName: 'John Doe',
    createdAt: '2026-01-15'
  },
  {
    id: 'flt-2',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    towerId: 'twr-1',
    towerName: 'Tower A',
    number: '102',
    floor: '1st Floor',
    type: '2BHK',
    status: 'Vacant',
    ownerName: '',
    createdAt: '2026-01-16'
  },
  {
    id: 'flt-3',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    towerId: 'twr-2',
    towerName: 'Tower B',
    number: '201',
    floor: '2nd Floor',
    type: '3BHK',
    status: 'Occupied',
    ownerName: 'Jane Smith',
    createdAt: '2026-01-17'
  },
  {
    id: 'flt-4',
    projectId: 'prj-1',
    projectName: 'Marbella Club',
    towerId: 'twr-2',
    towerName: 'Tower B',
    number: '202',
    floor: '2nd Floor',
    type: '4BHK',
    status: 'Maintenance',
    ownerName: 'Mike Johnson',
    createdAt: '2026-01-18'
  },
  {
    id: 'flt-5',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    towerId: 'twr-3',
    towerName: 'East Wing',
    number: '1201',
    floor: '12th Floor',
    type: 'Penthouse',
    status: 'Occupied',
    ownerName: 'Robert Brown',
    createdAt: '2026-02-20'
  },
  {
    id: 'flt-6',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    towerId: 'twr-3',
    towerName: 'East Wing',
    number: '1202',
    floor: '12th Floor',
    type: '3BHK',
    status: 'Vacant',
    ownerName: '',
    createdAt: '2026-02-21'
  },
  {
    id: 'flt-7',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    towerId: 'twr-4',
    towerName: 'West Wing',
    number: '1501',
    floor: '15th Floor',
    type: 'Studio',
    status: 'Occupied',
    ownerName: 'Emily Davis',
    createdAt: '2026-02-22'
  },
  {
    id: 'flt-8',
    projectId: 'prj-2',
    projectName: 'Skyline Heights',
    towerId: 'twr-4',
    towerName: 'West Wing',
    number: '1502',
    floor: '15th Floor',
    type: '2BHK',
    status: 'Maintenance',
    ownerName: '',
    createdAt: '2026-02-23'
  },
  {
    id: 'flt-9',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    towerId: 'twr-5',
    towerName: 'Oasis Block A',
    number: '301',
    floor: '3rd Floor',
    type: '3BHK',
    status: 'Occupied',
    ownerName: 'Alice Walker',
    createdAt: '2026-03-05'
  },
  {
    id: 'flt-10',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    towerId: 'twr-5',
    towerName: 'Oasis Block A',
    number: '302',
    floor: '3rd Floor',
    type: '2BHK',
    status: 'Vacant',
    ownerName: '',
    createdAt: '2026-03-06'
  },
  {
    id: 'flt-11',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    towerId: 'twr-6',
    towerName: 'Oasis Block B',
    number: '401',
    floor: '4th Floor',
    type: 'Studio',
    status: 'Occupied',
    ownerName: 'Frank Sinatra',
    createdAt: '2026-03-07'
  },
  {
    id: 'flt-12',
    projectId: 'prj-3',
    projectName: 'Palm Oasis Residency',
    towerId: 'twr-6',
    towerName: 'Oasis Block B',
    number: '402',
    floor: '4th Floor',
    type: '3BHK',
    status: 'Maintenance',
    ownerName: '',
    createdAt: '2026-03-08'
  },
  {
    id: 'flt-13',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    towerId: 'twr-7',
    towerName: 'Emerald Wing A',
    number: '501',
    floor: '5th Floor',
    type: '4BHK',
    status: 'Occupied',
    ownerName: 'David Miller',
    createdAt: '2026-03-15'
  },
  {
    id: 'flt-14',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    towerId: 'twr-7',
    towerName: 'Emerald Wing A',
    number: '502',
    floor: '5th Floor',
    type: '2BHK',
    status: 'Vacant',
    ownerName: '',
    createdAt: '2026-03-16'
  },
  {
    id: 'flt-15',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    towerId: 'twr-8',
    towerName: 'Emerald Wing B',
    number: '601',
    floor: '6th Floor',
    type: 'Penthouse',
    status: 'Occupied',
    ownerName: 'Eva Green',
    createdAt: '2026-03-17'
  },
  {
    id: 'flt-16',
    projectId: 'prj-4',
    projectName: 'Emerald Green Estate',
    towerId: 'twr-8',
    towerName: 'Emerald Wing B',
    number: '602',
    floor: '6th Floor',
    type: '3BHK',
    status: 'Vacant',
    ownerName: '',
    createdAt: '2026-03-18'
  }
];

// Helper to safely access localStorage
const isBrowser = typeof window !== 'undefined';

export const getProjects = (): Project[] => {
  if (!isBrowser) return DEFAULT_PROJECTS;
  const data = localStorage.getItem('setup_projects');
  if (!data) {
    localStorage.setItem('setup_projects', JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
  try {
    const parsed = JSON.parse(data) as Project[];
    if (!parsed.some(p => p.id === 'prj-4')) {
      localStorage.setItem('setup_projects', JSON.stringify(DEFAULT_PROJECTS));
      return DEFAULT_PROJECTS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('setup_projects', JSON.stringify(DEFAULT_PROJECTS));
    return DEFAULT_PROJECTS;
  }
};

export const saveProject = (project: Omit<Project, 'createdAt' | 'id'> & { id?: string }): Project => {
  const projects = getProjects();
  let savedProject: Project;

  if (project.id) {
    // Edit
    const index = projects.findIndex(p => p.id === project.id);
    const existing = projects[index];
    savedProject = {
      ...existing,
      ...project,
      id: project.id,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0]
    };
    projects[index] = savedProject;
  } else {
    // Add new
    savedProject = {
      ...project,
      id: 'prj-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    projects.push(savedProject);
  }

  localStorage.setItem('setup_projects', JSON.stringify(projects));
  return savedProject;
};

export const deleteProject = (id: string): void => {
  const projects = getProjects().filter(p => p.id !== id);
  localStorage.setItem('setup_projects', JSON.stringify(projects));

  // Cascade delete towers and flats
  const towers = getTowers().filter(t => t.projectId !== id);
  localStorage.setItem('setup_towers', JSON.stringify(towers));

  const flats = getFlats().filter(f => f.projectId !== id);
  localStorage.setItem('setup_flats', JSON.stringify(flats));
};

export const getTowers = (): Tower[] => {
  if (!isBrowser) return DEFAULT_TOWERS;
  const data = localStorage.getItem('setup_towers');
  if (!data) {
    localStorage.setItem('setup_towers', JSON.stringify(DEFAULT_TOWERS));
    return DEFAULT_TOWERS;
  }
  try {
    const parsed = JSON.parse(data) as Tower[];
    if (!parsed.some(t => t.id === 'twr-8')) {
      localStorage.setItem('setup_towers', JSON.stringify(DEFAULT_TOWERS));
      return DEFAULT_TOWERS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('setup_towers', JSON.stringify(DEFAULT_TOWERS));
    return DEFAULT_TOWERS;
  }
};

export const saveTower = (tower: Omit<Tower, 'createdAt' | 'projectName' | 'id'> & { id?: string }): Tower => {
  const towers = getTowers();
  const projects = getProjects();
  const project = projects.find(p => p.id === tower.projectId);
  const projectName = project ? project.name : 'Unknown Project';

  let savedTower: Tower;

  if (tower.id) {
    // Edit
    const index = towers.findIndex(t => t.id === tower.id);
    const existing = towers[index];
    savedTower = {
      ...existing,
      ...tower,
      id: tower.id,
      projectName,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0]
    };
    towers[index] = savedTower;
  } else {
    // Add new
    savedTower = {
      ...tower,
      id: 'twr-' + Date.now(),
      projectName,
      createdAt: new Date().toISOString().split('T')[0]
    };
    towers.push(savedTower);
  }

  localStorage.setItem('setup_towers', JSON.stringify(towers));
  return savedTower;
};

export const deleteTower = (id: string): void => {
  const towers = getTowers().filter(t => t.id !== id);
  localStorage.setItem('setup_towers', JSON.stringify(towers));

  // Cascade delete flats
  const flats = getFlats().filter(f => f.towerId !== id);
  localStorage.setItem('setup_flats', JSON.stringify(flats));
};

export const getFlats = (): Flat[] => {
  if (!isBrowser) return DEFAULT_FLATS;
  const data = localStorage.getItem('setup_flats');
  if (!data) {
    localStorage.setItem('setup_flats', JSON.stringify(DEFAULT_FLATS));
    return DEFAULT_FLATS;
  }
  try {
    const parsed = JSON.parse(data) as Flat[];
    if (!parsed.some(f => f.id === 'flt-16')) {
      localStorage.setItem('setup_flats', JSON.stringify(DEFAULT_FLATS));
      return DEFAULT_FLATS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem('setup_flats', JSON.stringify(DEFAULT_FLATS));
    return DEFAULT_FLATS;
  }
};

export const saveFlat = (flat: Omit<Flat, 'createdAt' | 'projectName' | 'towerName' | 'id'> & { id?: string }): Flat => {
  const flats = getFlats();
  const projects = getProjects();
  const towers = getTowers();

  const project = projects.find(p => p.id === flat.projectId);
  const projectName = project ? project.name : 'Unknown Project';

  const tower = towers.find(t => t.id === flat.towerId);
  const towerName = tower ? tower.name : 'Unknown Tower';

  let savedFlat: Flat;

  if (flat.id) {
    // Edit
    const index = flats.findIndex(f => f.id === flat.id);
    const existing = flats[index];
    savedFlat = {
      ...existing,
      ...flat,
      id: flat.id,
      projectName,
      towerName,
      createdAt: existing?.createdAt || new Date().toISOString().split('T')[0]
    };
    flats[index] = savedFlat;
  } else {
    // Add new
    savedFlat = {
      ...flat,
      id: 'flt-' + Date.now(),
      projectName,
      towerName,
      createdAt: new Date().toISOString().split('T')[0]
    };
    flats.push(savedFlat);
  }

  localStorage.setItem('setup_flats', JSON.stringify(flats));
  return savedFlat;
};

export const deleteFlat = (id: string): void => {
  const flats = getFlats().filter(f => f.id !== id);
  localStorage.setItem('setup_flats', JSON.stringify(flats));
};

import { getFacilities } from './facilityStore';

export interface Staff {
  id: string;
  name: string;
  avatar: string;
  department: string;
  phone: string;
  email: string;
  cardNo: string;
  status: 'Active' | 'Inactive';
  joiningDate: string;
  address: string;
  emergencyContact: string;
  facilityId: string;
  facilityName: string;
}

const DEFAULT_STAFF: Staff[] = [
  { 
    id: 'staff-1', 
    name: 'Sumanth Kumar', 
    avatar: 'https://i.pravatar.cc/150?u=21', 
    department: 'Security', 
    phone: '9876500001', 
    email: 'sumanth.k@society.com',
    cardNo: 'CM21001', 
    status: 'Active',
    joiningDate: '2023-01-12',
    address: '123, Marbella Club, Road No. 5, Jubilee Hills, Hyderabad',
    emergencyContact: '9876511111',
    facilityId: 'fac-1',
    facilityName: 'Squash Court'
  },
  { 
    id: 'staff-2', 
    name: 'Suresh Yadav', 
    avatar: 'https://i.pravatar.cc/150?u=22', 
    department: 'Housekeeping', 
    phone: '9876500002', 
    email: 'suresh.y@society.com',
    cardNo: 'CM21002', 
    status: 'Active',
    joiningDate: '2023-05-15',
    address: '456, Marbella Gardens, Gachibowli, Hyderabad',
    emergencyContact: '9876522222',
    facilityId: 'fac-8',
    facilityName: 'Marbella Central Park'
  },
  { 
    id: 'staff-3', 
    name: 'Amit Singh', 
    avatar: 'https://i.pravatar.cc/150?u=23', 
    department: 'Maintenance', 
    phone: '9876500003', 
    email: 'amit.s@society.com',
    cardNo: 'CM21003', 
    status: 'Active',
    joiningDate: '2024-02-10',
    address: '789, Green Meadows, Madhapur, Hyderabad',
    emergencyContact: '9876533333',
    facilityId: 'fac-4',
    facilityName: 'Grand Gym'
  },
  { 
    id: 'staff-4', 
    name: 'Vikram Patel', 
    avatar: 'https://i.pravatar.cc/150?u=24', 
    department: 'Front Office', 
    phone: '9876500004', 
    email: 'vikram.p@society.com',
    cardNo: 'CM21004', 
    status: 'Inactive',
    joiningDate: '2024-08-01',
    address: '101, Marbella Heights, Kondapur, Hyderabad',
    emergencyContact: '9876544444',
    facilityId: 'fac-3',
    facilityName: 'Home Theatre'
  },
  { 
    id: 'staff-5', 
    name: 'Deepak Sharma', 
    avatar: 'https://i.pravatar.cc/150?u=25', 
    department: 'Security', 
    phone: '9876500005', 
    email: 'deepak.s@society.com',
    cardNo: 'CM21005', 
    status: 'Active',
    joiningDate: '2023-11-20',
    address: '202, Marbella Premium, Banjara Hills, Hyderabad',
    emergencyContact: '9876555555',
    facilityId: 'fac-7',
    facilityName: 'Olympic Swimming Pool'
  }
];

const STORAGE_KEY = 'marbella_staff';
const isBrowser = typeof window !== 'undefined';

export function getStaffList(): Staff[] {
  if (!isBrowser) return DEFAULT_STAFF;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
    return DEFAULT_STAFF;
  }
  try {
    return JSON.parse(data) as Staff[];
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STAFF));
    return DEFAULT_STAFF;
  }
}

export function saveStaffList(list: Staff[]) {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

export function getStaffById(id: string): Staff | undefined {
  const list = getStaffList();
  return list.find(s => s.id === id);
}

export function saveStaff(staffData: Omit<Staff, 'cardNo' | 'id'> & { id?: string }): Staff {
  const list = getStaffList();
  const facilities = getFacilities();
  const facility = facilities.find(f => f.id === staffData.facilityId);
  const facilityName = facility ? facility.name : 'General Duty';

  let saved: Staff;

  if (staffData.id && staffData.id !== 'add') {
    // Edit mode
    const index = list.findIndex(s => s.id === staffData.id);
    const existing = list[index];
    saved = {
      ...existing,
      ...staffData,
      facilityName,
      id: staffData.id,
      cardNo: existing?.cardNo || `CM21${String(list.length + 1).padStart(3, '0')}`
    };
    list[index] = saved;
  } else {
    // Add mode
    const serial = list.length + 1;
    const cardNo = `CM21${String(serial).padStart(3, '0')}`;
    saved = {
      ...staffData,
      facilityName,
      id: `staff-${Date.now()}`,
      cardNo
    };
    list.push(saved);
  }

  saveStaffList(list);
  return saved;
}

export function deleteStaff(id: string) {
  const list = getStaffList();
  const filtered = list.filter(s => s.id !== id);
  saveStaffList(filtered);
}

export function toggleStaffStatus(id: string): Staff {
  const staff = getStaffById(id);
  if (!staff) throw new Error('Staff member not found');

  const newStatus = staff.status === 'Active' ? 'Inactive' : 'Active';
  return saveStaff({
    ...staff,
    status: newStatus
  });
}

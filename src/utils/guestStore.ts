export interface Guest {
  id: string;
  name: string;
  avatar: string;
  resident: string;
  apartment: string;
  date: string;
  fromDate: string;
  dueDate: string;
  status: 'Checked In' | 'Upcoming' | 'Checked Out' | 'Pending' | 'Rejected';
  validity: string;
  otpStatus: 'Approved' | 'Pending' | 'OTP Verified' | 'Waiting for Master' | 'Rejected';
  purpose: string;
  address: string;
  aadhaarFile?: string;
  aadhaarSize?: string;
  rejectionReason?: string;
}

const DEFAULT_GUESTS: Guest[] = [
  { 
    id: 'gst-1', 
    name: 'Alice Walker', 
    avatar: 'https://i.pravatar.cc/150?u=11', 
    resident: 'John Doe', 
    apartment: 'Marbella Club • Tower A • Flat 101', 
    date: '16 May 2026', 
    fromDate: '2026-05-16', 
    dueDate: '2026-05-21', 
    status: 'Checked In', 
    validity: '5 Days Left', 
    otpStatus: 'Approved', 
    purpose: 'Family Visit', 
    address: '123 Beach Rd, Goa',
    aadhaarFile: 'aadhaar_alice.pdf',
    aadhaarSize: '1.2 MB'
  },
  { 
    id: 'gst-2', 
    name: 'Bob Smith', 
    avatar: 'https://i.pravatar.cc/150?u=12', 
    resident: 'Jane Smith', 
    apartment: 'Marbella Club • Tower B • Flat 201', 
    date: '17 May 2026', 
    fromDate: '2026-05-17', 
    dueDate: '2026-05-24', 
    status: 'Upcoming', 
    validity: '7 Days Left', 
    otpStatus: 'Pending', 
    purpose: 'Friend Visit', 
    address: '456 Hill Top, Mumbai',
    aadhaarFile: 'aadhaar_bob.pdf',
    aadhaarSize: '1.5 MB'
  },
  { 
    id: 'gst-3', 
    name: 'Charlie Brown', 
    avatar: 'https://i.pravatar.cc/150?u=13', 
    resident: 'Mike Johnson', 
    apartment: 'Marbella Club • Tower B • Flat 202', 
    date: '15 May 2026', 
    fromDate: '2026-05-15', 
    dueDate: '2026-05-16', 
    status: 'Checked Out', 
    validity: 'Expired', 
    otpStatus: 'Approved', 
    purpose: 'Maintenance Call', 
    address: '789 Palm Avenue, Pune',
    aadhaarFile: 'aadhaar_charlie.pdf',
    aadhaarSize: '1.1 MB'
  },
  { 
    id: 'gst-4', 
    name: 'David Miller', 
    avatar: 'https://i.pravatar.cc/150?u=14', 
    resident: 'John Doe', 
    apartment: 'Marbella Club • Tower A • Flat 101', 
    date: '18 May 2026', 
    fromDate: '2026-05-18', 
    dueDate: '2026-05-20', 
    status: 'Pending', 
    validity: '2 Days Left', 
    otpStatus: 'OTP Verified', 
    purpose: 'Business Discussion', 
    address: '101 Sector 4, Bangalore',
    aadhaarFile: 'aadhaar_david.pdf',
    aadhaarSize: '1.8 MB'
  },
  { 
    id: 'gst-5', 
    name: 'Eva Green', 
    avatar: 'https://i.pravatar.cc/150?u=15', 
    resident: 'Jane Smith', 
    apartment: 'Marbella Club • Tower B • Flat 201', 
    date: '19 May 2026', 
    fromDate: '2026-05-19', 
    dueDate: '2026-05-20', 
    status: 'Pending', 
    validity: '1 Day Left', 
    otpStatus: 'Waiting for Master', 
    purpose: 'Home Delivery', 
    address: '302 Park Lane, Delhi',
    aadhaarFile: 'aadhaar_eva.pdf',
    aadhaarSize: '1.4 MB'
  },
  { 
    id: 'gst-6', 
    name: 'Frank Ocean', 
    avatar: 'https://i.pravatar.cc/150?u=16', 
    resident: 'Jane Smith', 
    apartment: 'Marbella Club • Tower B • Flat 201', 
    date: '19 May 2026', 
    fromDate: '2026-05-19', 
    dueDate: '2026-05-22', 
    status: 'Pending', 
    validity: '3 Days Left', 
    otpStatus: 'OTP Verified', 
    purpose: 'Friend Visit', 
    address: 'Sector 5, Pune',
    aadhaarFile: 'aadhaar_frank.pdf',
    aadhaarSize: '1.6 MB'
  },
  { 
    id: 'gst-7', 
    name: 'Grace Hopper', 
    avatar: 'https://i.pravatar.cc/150?u=17', 
    resident: 'Mike Johnson', 
    apartment: 'Marbella Club • Tower B • Flat 202', 
    date: '20 May 2026', 
    fromDate: '2026-05-20', 
    dueDate: '2026-05-21', 
    status: 'Pending', 
    validity: '1 Day Left', 
    otpStatus: 'Waiting for Master', 
    purpose: 'Maintenance Call', 
    address: 'Hitech City, Hyderabad',
    aadhaarFile: 'aadhaar_grace.pdf',
    aadhaarSize: '2.1 MB'
  },
  { 
    id: 'gst-8', 
    name: 'Henry Cavill', 
    avatar: 'https://i.pravatar.cc/150?u=18', 
    resident: 'John Doe', 
    apartment: 'Marbella Club • Tower A • Flat 101', 
    date: '20 May 2026', 
    fromDate: '2026-05-20', 
    dueDate: '2026-05-25', 
    status: 'Pending', 
    validity: '5 Days Left', 
    otpStatus: 'Pending', 
    purpose: 'Home Delivery', 
    address: 'Kensington, London',
    aadhaarFile: 'aadhaar_henry.pdf',
    aadhaarSize: '1.9 MB'
  }
];

const STORAGE_KEY = 'marbella_guests';

export function getGuests(): Guest[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUESTS));
    return DEFAULT_GUESTS;
  }
  try {
    const parsed = JSON.parse(data) as Guest[];
    const hasGst8 = parsed.some(g => g.id === 'gst-8');
    if (!hasGst8) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUESTS));
      return DEFAULT_GUESTS;
    }
    return parsed;
  } catch (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_GUESTS));
    return DEFAULT_GUESTS;
  }
}

export function saveGuests(guests: Guest[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
}

export function getGuestById(id: string): Guest | undefined {
  const guests = getGuests();
  return guests.find(g => g.id === id);
}

export function addGuest(guest: Omit<Guest, 'id' | 'date' | 'avatar' | 'status' | 'otpStatus' | 'validity'> & { avatar?: string }): Guest {
  const guests = getGuests();
  
  const start = new Date(guest.fromDate);
  const end = new Date(guest.dueDate);
  const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const validity = diffDays > 0 ? `${diffDays} Days Left` : 'Expired';

  const newGuest: Guest = {
    ...guest,
    id: `gst-${Date.now()}`,
    avatar: guest.avatar || `https://i.pravatar.cc/150?u=${Math.floor(Math.random() * 50)}`,
    date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    status: 'Upcoming',
    otpStatus: 'Pending',
    validity
  };

  guests.push(newGuest);
  saveGuests(guests);
  return newGuest;
}

export function updateGuest(id: string, guestData: Partial<Guest>): Guest {
  const guests = getGuests();
  const index = guests.findIndex(g => g.id === id);
  if (index === -1) throw new Error('Guest not found');

  let validity = guests[index].validity;
  const fromDate = guestData.fromDate || guests[index].fromDate;
  const dueDate = guestData.dueDate || guests[index].dueDate;
  if (fromDate && dueDate) {
    const start = new Date(fromDate);
    const end = new Date(dueDate);
    const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    validity = diffDays > 0 ? `${diffDays} Days Left` : 'Expired';
  }

  const updatedGuest: Guest = {
    ...guests[index],
    ...guestData,
    validity
  };

  guests[index] = updatedGuest;
  saveGuests(guests);
  return updatedGuest;
}

export function approveGuestRequest(id: string): Guest {
  return updateGuest(id, { status: 'Checked In', otpStatus: 'Approved' });
}

export function rejectGuestRequest(id: string, reason: string): Guest {
  return updateGuest(id, { status: 'Rejected', otpStatus: 'Rejected', rejectionReason: reason });
}

export function deleteGuest(id: string) {
  const guests = getGuests();
  const filtered = guests.filter(g => g.id !== id);
  saveGuests(filtered);
}

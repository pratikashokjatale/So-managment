import { api, handleApiError } from "@/utils/axios";

export interface UsersReportParams {
  format?: 'json' | 'excel';
  status?: 'ACTIVE' | 'PENDING' | 'SUSPENDED' | 'INACTIVE';
  role?: 'RESIDENT' | 'GUEST' | 'STAFF' | 'ADMIN' | 'SUPER_ADMIN';
  fromDate?: string;
  toDate?: string;
}

export interface BookingsReportParams {
  format?: 'json' | 'excel';
  bookingStatus?: 'CONFIRMED' | 'PENDING_APPROVAL' | 'CANCELLED' | 'CHECKED_IN' | 'NO_SHOW';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'NOT_REQUIRED';
  facilityId?: string;
  projectId?: string;
  userId?: string;
  date?: string;
  fromDate?: string;
  toDate?: string;
}

export interface PaymentsReportParams {
  format?: 'json' | 'excel';
  paymentStatus?: 'SUCCESS' | 'FAILED' | 'PENDING';
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SubscriptionsReportParams {
  format?: 'json' | 'excel';
  subscriptionStatus?: 'ACTIVE' | 'PENDING_APPROVAL' | 'CANCELLED' | 'EXPIRED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  facilityId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StaffReportParams {
  format?: 'json' | 'excel';
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';
  projectId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StaffAttendanceReportParams {
  format?: 'json' | 'excel';
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  staffId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FacilityAccessReportParams {
  format?: 'json' | 'excel';
  facilityId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface EmergencyAlertsReportParams {
  format?: 'json' | 'excel';
  status?: 'PENDING' | 'RESPONDED' | 'RESOLVED';
  fromDate?: string;
  toDate?: string;
}

export interface IssuesReportParams {
  format?: 'json' | 'excel';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  fromDate?: string;
  toDate?: string;
}

const getReportWithBlobSupport = async (endpoint: string, params?: any) => {
  try {
    const isExcel = params?.format === "excel";
    const res = await api.get(endpoint, {
      params,
      ...(isExcel ? { responseType: "blob" } : {}),
    });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUsersReportApi = (params?: UsersReportParams) => {
  return getReportWithBlobSupport("reports/users", params);
};

export const getBookingsReportApi = (params?: BookingsReportParams) => {
  return getReportWithBlobSupport("reports/bookings", params);
};

export const getPaymentsReportApi = (params?: PaymentsReportParams) => {
  return getReportWithBlobSupport("reports/payments", params);
};

export const getSubscriptionsReportApi = (params?: SubscriptionsReportParams) => {
  return getReportWithBlobSupport("reports/subscriptions", params);
};

export const getStaffReportApi = (params?: StaffReportParams) => {
  return getReportWithBlobSupport("reports/staff", params);
};

export const getStaffAttendanceReportApi = (params?: StaffAttendanceReportParams) => {
  return getReportWithBlobSupport("reports/staff-attendance", params);
};

export const getFacilityAccessReportApi = (params?: FacilityAccessReportParams) => {
  return getReportWithBlobSupport("reports/facility-access", params);
};

export const getEmergencyAlertsReportApi = (params?: EmergencyAlertsReportParams) => {
  return getReportWithBlobSupport("reports/emergency-alerts", params);
};

export const getIssuesReportApi = (params?: IssuesReportParams) => {
  return getReportWithBlobSupport("reports/issues", params);
};

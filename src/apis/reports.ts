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
  bookingStatus?: 'CONFIRMED' | 'PENDING_APPROVAL' | 'REJECTED' | 'CANCELLED' | 'CHECKED_IN' | 'COMPLETED' | 'NO_SHOW';
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
  paymentStatus?: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
  status?: 'SUCCESS' | 'FAILED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SubscriptionsReportParams {
  format?: 'json' | 'excel';
  subscriptionStatus?: 'PENDING_PAYMENT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'EXPIRED' | 'CANCELLED' | 'REJECTED';
  paymentStatus?: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'NOT_REQUIRED';
  facilityId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StaffReportParams {
  format?: 'json' | 'excel';
  status?: 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE' | 'SUSPENDED' | 'TERMINATED';
  projectId?: string;
  facilityId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface StaffAttendanceReportParams {
  format?: 'json' | 'excel';
  status?: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  staffId?: string;
  facilityId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface FacilityAccessReportParams {
  format?: 'json' | 'excel';
  facilityId?: string;
  userId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface EmergencyAlertsReportParams {
  format?: 'json' | 'excel';
  status?: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CANCELLED' | 'FALSE_ALARM';
  userId?: string;
  projectId?: string;
  fromDate?: string;
  toDate?: string;
}

export interface IssuesReportParams {
  format?: 'json' | 'excel';
  status?: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'REJECTED' | 'CANCELLED';
  userId?: string;
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

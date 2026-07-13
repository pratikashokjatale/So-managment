import { api, handleApiError } from "@/utils/axios";

export interface DashboardParams {
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
  fromDate?: string;
  toDate?: string;
  days?: number;
}

export const getDashboardApi = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/overview", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDashbordRevenue = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/revenue-trends", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDashbordFacility = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/facility-stats", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserDemographicsApi = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/user-demographics", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPaymentMethodsStatsApi = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/payment-methods", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getStaffAttendanceStatsApi = async (params?: DashboardParams) => {
  try {
    const res = await api.get("dashboard/staff-attendance", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
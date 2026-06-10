import { api, handleApiError } from "@/utils/axios";

export interface DashboardTrendsParams {
  days?: number;
}

export const getDashboardApi = async () => {
  try {
    const res = await api.get("dashboard/overview");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDashbordRevenue = async (params?: DashboardTrendsParams) => {
  try {
    const res = await api.get("dashboard/revenue-trends", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getDashbordFacility = async () => {
  try {
    const res = await api.get("dashboard/facility-stats");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserDemographicsApi = async () => {
  try {
    const res = await api.get("dashboard/user-demographics");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPaymentMethodsStatsApi = async (params?: DashboardTrendsParams) => {
  try {
    const res = await api.get("dashboard/payment-methods", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getStaffAttendanceStatsApi = async (params?: DashboardTrendsParams) => {
  try {
    const res = await api.get("dashboard/staff-attendance", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
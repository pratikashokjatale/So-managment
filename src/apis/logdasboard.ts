import { handleApiError, api } from "@/utils/axios";

export const getStaffAttendanceStatsApi = async (params?: any) => {
  try {
    const res = await api.get("activity-logs", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
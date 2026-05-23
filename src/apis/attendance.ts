import { api, handleApiError } from "@/utils/axios";

export interface GetAttendanceParams {
  staffId?: string;
  facilityId?: string;
  status?: string;
  syncStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface RecordAttendancePayload {
  staffId: string;
  facilityId?: string;
  attendanceDate: string;
  checkInAt?: string;
  checkOutAt?: string | null;
  status?: string;
  method?: string;
  accessZone?: string;
  sourceDeviceId?: string;
  syncStatus?: string;
  notes?: string;
}

export const getAttendanceListApi = async (params?: GetAttendanceParams) => {
  try {
    const res = await api.get("staff/attendance", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const recordAttendanceApi = async (data: RecordAttendancePayload) => {
  try {
    const res = await api.post("staff/attendance", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAttendanceApi = async (attendanceId: string, data: Partial<RecordAttendancePayload>) => {
  try {
    const res = await api.patch(`staff/attendance/${attendanceId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAttendanceApi = async (attendanceId: string) => {
  try {
    const res = await api.delete(`staff/attendance/${attendanceId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

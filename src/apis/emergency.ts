import { api, handleApiError } from "@/utils/axios";

export interface GetEmergencyParams {
  status?: "OPEN" | "ACKNOWLEDGED" | "RESOLVED" | "CANCELLED" | "FALSE_ALARM";
  type?: string;
  severity?: string;
  userId?: string;
  flatId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface AcknowledgeAlertPayload {
  notes: string;
}

export interface ResolveAlertPayload {
  status: "RESOLVED" | "FALSE_ALARM";
  resolutionNotes: string;
}

export interface CancelAlertPayload {
  cancellationReason: string;
}

export const getEmergencyApi = async (params?: GetEmergencyParams) => {
  try {
    const res = await api.get("emergency", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getEmergencyDetailsApi = async (id: string) => {
  try {
    const res = await api.get(`emergency/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const acknowledgeEmergencyApi = async (
  id: string,
  data: AcknowledgeAlertPayload,
) => {
  try {
    const res = await api.patch(`emergency/${id}/acknowledge`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resolveEmergencyApi = async (
  id: string,
  data: ResolveAlertPayload,
) => {
  try {
    const res = await api.patch(`emergency/${id}/resolve`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelEmergencyApi = async (
  id: string,
  data: CancelAlertPayload,
) => {
  try {
    const res = await api.patch(`emergency/${id}/cancel`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

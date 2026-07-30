import { api, handleApiError } from "@/utils/axios";

export const createVipPassApi = async (data: {
  projectId: string;
  guestName: string;
  guestPhone?: string;
  guestEmail?: string;
  depositAmount: number;
  depositCollected: boolean;
  validHours: number;
  notes?: string;
}) => {
  try {
    const res = await api.post("vip-passes", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getVipPassesApi = async (params?: any) => {
  try {
    const res = await api.get("vip-passes", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getVipPassByIdApi = async (id: string) => {
  try {
    const res = await api.get(`vip-passes/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyVipPassApi = async (data: {
  accessQrToken: string;
  accessZone: string;
  sourceDeviceId: string;
}) => {
  try {
    const res = await api.post("vip-passes/verify", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelVipPassApi = async (id: string, reason: string) => {
  try {
    const res = await api.patch(`vip-passes/${id}/cancel`, { reason });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

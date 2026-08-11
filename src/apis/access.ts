import { api, handleApiError } from "@/utils/axios";

export interface VerifyAccessPayload {
  accessScope: "SOCIETY_ENTRY" | "FACILITY_ACCESS";
  accessQrToken: string;
  accessZone: string;
  sourceDeviceId?: string;
  facilityId?: string;
  attendanceAction?: "CHECK_IN" | "CHECK_OUT";
}

export const verifyAccessApi = async (payload: VerifyAccessPayload) => {
  try {
    const res = await api.post("/access/verify", payload);
    return res.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

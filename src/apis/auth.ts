import { api, handleApiError } from "@/utils/axios";

export const loginApi = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post("/v1/api/auth/login", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMeApi = async () => {
  try {
    const res = await api.get("/v1/api/auth/me");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

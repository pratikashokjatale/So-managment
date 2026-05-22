import { api, handleApiError } from "@/utils/axios";

export const loginApi = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post("auth/login", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMeApi = async () => {
  try {
    const res = await api.get("auth/me");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const forgotPasswordApi = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post("auth/forgot-password", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const resetPasswordApi = async (data: Record<string, unknown>) => {
  try {
    const res = await api.post("auth/reset-password", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const refreshTokenApi = async (refreshToken: string) => {
  try {
    const res = await api.post("auth/refresh", { refreshToken });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const logoutApi = async (refreshToken: string) => {
  try {
    const res = await api.post("auth/logout", { refreshToken });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};



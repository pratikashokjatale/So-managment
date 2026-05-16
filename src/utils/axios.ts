import axios, { type AxiosError, type AxiosResponse } from "axios";
import { getCookie, clearCookies, getRefreshToken, setCookies, setRefreshToken } from "../utils/cookies";
import { API_URL } from "../lib/config";
import { clearSession, getSession, getSessionRefreshToken } from "./session";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 1200000, // 20 minutes
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie() || getSession()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      try {
        const refreshToken = getRefreshToken() || getSessionRefreshToken()
        const res: any = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken })
        if (res?.accessToken) {
          api.defaults.headers.common.Authorization = `Bearer ${res.accessToken}`;
          setCookies(res.accessToken);
          setRefreshToken(res?.refreshToken);
        }
      } catch (error) {
        clearCookies();
        clearSession()
      }

    }

    if (error.response?.status === 403) {
      console.error("Access forbidden");
    }

    if (
      typeof error.response?.status === "number" &&
      error.response.status >= 500
    ) {
      console.error("Server error occurred");
    }

    return Promise.reject(error);
  }
);

export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export const handleApiError = (error: any): ApiError => {
  if (error.response) {
    const message =
      error.response.data?.error || error.response.data?.errors?.[0]?.msg;

    return new ApiError(message, error.response?.status, error.response?.data);
  } else if (error.request) {
    return new ApiError("Network error - no response received", 0);
  } else {
    return new ApiError(error.message, 0);
  }
};

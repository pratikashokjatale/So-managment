import axios, { type AxiosError, type AxiosResponse } from "axios";
import { getCookie, clearCookies, getRefreshToken, setCookies, setRefreshToken } from "../utils/cookies";
import { API_URL } from "../lib/config";
import { clearSession, getSession, getSessionRefreshToken } from "./session";

// Create axios instance
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
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
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // Skip refresh logic for auth endpoints to prevent loops
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = getRefreshToken() || getSessionRefreshToken();
        if (refreshToken) {
          const res: any = await axios.post(`${API_URL}/api/v1/auth/refresh`, { refreshToken });

          const newAccessToken =
            res?.data?.data?.tokens?.accessToken ||
            res?.data?.data?.accessToken ||
            res?.data?.tokens?.accessToken ||
            res?.data?.accessToken ||
            res?.tokens?.accessToken ||
            res?.accessToken;

          const newRefreshToken =
            res?.data?.data?.tokens?.refreshToken ||
            res?.data?.data?.refreshToken ||
            res?.data?.tokens?.refreshToken ||
            res?.data?.refreshToken ||
            res?.tokens?.refreshToken;

          if (newAccessToken) {
            // Update global default + stored token
            api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
            setCookies(newAccessToken);
            if (newRefreshToken) setRefreshToken(newRefreshToken);

            // Patch the retried request header directly
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${newAccessToken}`,
            };
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Refresh token expired or invalid, redirecting to login:', refreshError);
      }

      // Refresh failed or no refresh token — clear session and redirect to login
      clearCookies();
      clearSession();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 403) {
      console.error('Access forbidden');
    }

    if (typeof error.response?.status === 'number' && error.response.status >= 500) {
      console.error('Server error occurred');
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
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data?.errors?.[0]?.msg ||
      "An error occurred";

    return new ApiError(message, error.response?.status, error.response?.data);
  } else if (error.request) {
    return new ApiError("Network error - no response received", 0);
  } else {
    return new ApiError(error.message, 0);
  }
};

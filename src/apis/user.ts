import { api, handleApiError } from "@/utils/axios";

export interface ListUsersParams {
  page?: number;
  limit?: number; 
  search?: string;
  status?: string;
  role?: string;
  flatId?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  phone: string;
  password?: string;
  projectId?: string;
  towerId?: string;
  floorNumber?: string;
  flatNumber?: string;
  flatType?: string;
  stayEndsAt?: string | null;
  profilePhotoUrl?: string;
  aadhaarNumber?: string;
  aadhaarDocumentUrl?: string;
  aadhaarDocumentFileName?: string;
  aadhaarDocumentSize?: number;
  role?: string;
  accountRole?: string;
  flatId?: string | null;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  accountRole?: string;
  stayEndsAt?: string | null;
  status?: string;
  flatId?: string | null;
  profilePhotoUrl?: string | null;
}

export const getUsersApi = async (params?: ListUsersParams) => {
  try {
    const res = await api.get("users", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserDetailsApi = async (userId: string) => {
  try {
    const res = await api.get(`users/${userId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createUserApi = async (data: CreateUserPayload) => {
  try {
    const res = await api.post("users", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateUserApi = async (userId: string, data: UpdateUserPayload) => {
  try {
    const res = await api.patch(`users/${userId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUserApi = async (userId: string, reason?: string) => {
  try {
    const res = await api.delete(`users/${userId}`, { data: { reason } });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserQrApi = async (userId: string) => {
  try {
    const res = await api.get(`users/${userId}/access-qr`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getMyQrApi = async () => {
  try {
    const res = await api.get("access/my-qr");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

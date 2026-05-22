import { api, handleApiError } from "@/utils/axios";

export interface GetTowersParams {
  page?: number;
  limit?: number;
}

export interface CreateTowerPayload {
  name: string;
  description?: string;
  totalFloors: number;
}

export interface UpdateTowerPayload {
  name?: string;
  description?: string;
  totalFloors?: number;
  status?: string;
}

export const getTowersApi = async (projectId: string, params?: GetTowersParams) => {
  try {
    const res = await api.get(`projects/${projectId}/towers`, { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getTowerDetailsApi = async (towerId: string) => {
  try {
    const res = await api.get(`towers/${towerId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createTowerApi = async (projectId: string, data: CreateTowerPayload) => {
  try {
    const res = await api.post(`projects/${projectId}/towers`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTowerApi = async (towerId: string, data: UpdateTowerPayload) => {
  try {
    const res = await api.patch(`towers/${towerId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

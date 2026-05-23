import { api, handleApiError } from "@/utils/axios";

export interface GetFlatsParams {
  page?: number;
  limit?: number;
  status?: string;
}


export const getFlatsApi = async (towerId: string, params?: GetFlatsParams) => {
  try {
    const res = await api.get(`towers/${towerId}/flats`, { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFlatDetailsApi = async (flatId: string) => {
  try {
    const res = await api.get(`flats/${flatId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface CreateFlatPayload {
  flatNumber: string;
  floorNumber: string;
  flatType: string;
  occupancyType: string;
  status: string;
}

export interface UpdateFlatPayload {
  flatNumber?: string;
  floorNumber?: string;
  flatType?: string;
  occupancyType?: string;
  status?: string;
}

export const createFlatApi = async (towerId: string, data: CreateFlatPayload) => {
  try {
    const res = await api.post(`towers/${towerId}/flats`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateFlatApi = async (flatId: string, data: UpdateFlatPayload) => {
  try {
    const res = await api.patch(`flats/${flatId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface ListFlatsParams {
  page?: number;
  limit?: number;
  projectId?: string;
  towerId?: string;
  status?: string;
}

export const getAllFlatsApi = async (params?: ListFlatsParams) => {
  try {
    const res = await api.get("flats", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


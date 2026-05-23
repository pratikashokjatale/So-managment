import { api, handleApiError } from "@/utils/axios";

export const addGuestApi = async (data: any) => {
  try {
    const res = await api.post(`guests`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


export const editGuestApi = async (data: any) => {
  try {
    const res = await api.patch(`guests`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
import { api, handleApiError } from "@/utils/axios";

export const uploadDocumentApi = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("enrollment/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const url = res?.data?.data?.url || res?.data?.url || res?.data;
    if (!url) throw new Error("Upload succeeded but no URL returned");
    return url as string;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getGuestsApi = async (params?: any) => {
  try {
    const res = await api.get(`users`, { params: { ...params, role: "GUEST" } });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const addGuestApi = async (data: any) => {
  try {
    const res = await api.post(`users`, { ...data, role: "GUEST" });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const editGuestApi = async (id: string, data: any) => {
  try {
    const res = await api.patch(`users/${id}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const approveGuestApi = async (id: string) => {
  try {
    const res = await api.patch(`users/${id}`, { status: "ACTIVE" });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const rejectGuestApi = async (id: string, reason?: string) => {
  try {
    const res = await api.patch(`users/${id}`, { status: "SUSPENDED", rejectReason: reason });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
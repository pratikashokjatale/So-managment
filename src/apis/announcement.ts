import { api, handleApiError } from "@/utils/axios";

export interface CreateAnnouncementPayload {
  projectId: string | null;
  title: string;
  category: string;
  body: string;
  imageUrls?: string[];
  attachmentUrls?: string[];
  audienceRoles: string[];
  priority: string;
  pinned?: boolean;
  startsAt: string;
  expiresAt: string;
  publishNow?: boolean;
}

export interface GetAnnouncementsParams {
  page?: number;
  limit?: number;
  category?: string;
  priority?: string;
  projectId?: string | null;
  search?: string;
}

export const getAnnouncementsApi = async (params?: GetAnnouncementsParams) => {
  try {
    const res = await api.get("announcements", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAnnouncementDetailsApi = async (id: string) => {
  try {
    const res = await api.get(`announcements/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAnnouncementApi = async (data: CreateAnnouncementPayload) => {
  try {
    const res = await api.post("announcements", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAnnouncementApi = async (id: string, data: Partial<CreateAnnouncementPayload>) => {
  try {
    const res = await api.patch(`announcements/${id}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAnnouncementApi = async (id: string) => {
  try {
    const res = await api.delete(`announcements/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

import { api, handleApiError } from "@/utils/axios";

export interface CreateFamilyMemberPayload {
  name: string;
  relationship: string;
  email?: string;
  phone?: string;
  password?: string;
  dateOfBirth?: string;
  idType?: string;
  idNumber?: string;
  accessLevel?: string;
  notes?: string;
}

export interface UpdateFamilyMemberPayload {
  name?: string;
  relationship?: string;
  status?: string;
  accessLevel?: string;
}

export const getFamilyMembersApi = async (userId: string, params?: { includeInactive?: boolean }) => {
  try {
    const res = await api.get(`family/${userId}/members`, { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createFamilyMemberApi = async (userId: string, data: CreateFamilyMemberPayload) => {
  try {
    const res = await api.post(`family/${userId}/members`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFamilyMemberDetailsApi = async (familyMemberId: string) => {
  try {
    const res = await api.get(`family/members/${familyMemberId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateFamilyMemberApi = async (familyMemberId: string, data: UpdateFamilyMemberPayload) => {
  try {
    const res = await api.patch(`family/members/${familyMemberId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteFamilyMemberApi = async (familyMemberId: string) => {
  try {
    const res = await api.delete(`family/members/${familyMemberId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

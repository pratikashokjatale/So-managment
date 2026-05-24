import { api, handleApiError } from "@/utils/axios";

export interface GetStaffParams {
  department?: string;
  status?: string;
  facilityId?: string;
  employmentType?: string;
  
  page?: number;
  limit?: number; 
}

export interface CreateStaffPayload {
  name: string;
  phone: string;
  email?: string;
  department?: string;
  facilityId?: string;
  designation?: string;
  employmentType?: string;
  joiningDate: string;
  status?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  shiftStart?: string;
  shiftEnd?: string;
  workDays?: string[];
  allowedZones?: string[];
  accessLevel?: string;
  attendanceMode?: string;
  profilePhotoUrl?: string;
  idProofType?: string;
  idProofNumber?: string;
  notes?: string;
  userId?: string;
}

export const getStaffListApi = async (params?: GetStaffParams) => {
  try {
    const res = await api.get("staff", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getStaffDetailsApi = async (id: string) => {
  try {
    const res = await api.get(`staff/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createStaffApi = async (data: CreateStaffPayload) => {
  try {
    const res = await api.post("staff", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateStaffApi = async (id: string, data: Partial<CreateStaffPayload>) => {
  try {
    const res = await api.patch(`staff/${id}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteStaffApi = async (id: string) => {
  try {
    const res = await api.delete(`staff/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

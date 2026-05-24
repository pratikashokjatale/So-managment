import { api, handleApiError } from "@/utils/axios";

export interface GetFacilitiesParams {
  category?: string;
  status?: string;
  isActive?: boolean;
  pricingModel?: string;
  
  page?: number;
  limit?: number; 
}

export interface CreateFacilityPayload {
  name: string;
  code: string;
  category: string;
  iconKey?: string;
  description?: string;
  location?: string;
  floor?: string;
  status?: string;
  isActive?: boolean;
  pricingModel?: string;
  priceAmount?: number;
  priceCurrency?: string;
  priceLabel?: string;
  bookingMode?: string;
  totalSlots?: number;
  bookedSlots?: number;
  capacity?: number;
  openingTime?: string;
  closingTime?: string;
  availableDays?: string[];
  advanceBookingDays?: number;
  cancellationHours?: number;
  requiresApproval?: boolean;
  managerName?: string;
  managerContact?: string;
  rules?: string;
  images?: string[];
  sortOrder?: number;
}

export const getFacilityStatsApi = async () => {
  try {
    const res = await api.get("facilities/stats");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFacilitiesApi = async (params?: GetFacilitiesParams) => {
  try {
    const res = await api.get("facilities", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getFacilityDetailsApi = async (id: string) => {
  try {
    const res = await api.get(`facilities/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createFacilityApi = async (data: CreateFacilityPayload) => {
  try {
    const res = await api.post("facilities", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateFacilityApi = async (id: string, data: Partial<CreateFacilityPayload>) => {
  try {
    const res = await api.patch(`facilities/${id}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteFacilityApi = async (id: string) => {
  try {
    const res = await api.delete(`facilities/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

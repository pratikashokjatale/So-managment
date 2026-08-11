import { api, handleApiError } from "@/utils/axios";

export interface AnalyticsCommonParams {
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface AnalyticsPaginationParams extends AnalyticsCommonParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface AnalyticsOverviewResponse {
  success: boolean;
  data: {
    filters: {
      projectId?: string;
      dateFrom?: string;
      dateTo?: string;
    };
    totals: {
      projects: number;
      flats: number;
      occupiedFlats: number;
      occupancyRate: number;
      activeMembers: number;
      bookings: number;
      activeSubscriptions: number;
      revenue: number;
      accessEvents: number;
    };
    activeVipPasses?: number;
    daily?: {
      accessEventsByHour?: Record<string, number>;
      [key: string]: any;
    };
    [key: string]: any;
  };
}


export interface BookingsByActivityItem {
  facilityId: string;
  facilityName: string;
  category: string;
  bookings: number;
}

export interface BookingsByActivityResponse {
  items: BookingsByActivityItem[];
  pagination: {
    page: number;
    limit: number;
  };
}

export interface RevenueByActivityItem {
  facilityId: string;
  facilityName: string;
  category: string;
  revenue: number;
}

export interface RevenueByActivityResponse {
  items: RevenueByActivityItem[];
  pagination: {
    page: number;
    limit: number;
  };
}

export interface AccessEventItem {
  id: string;
  accessDate: string;
  accessAt: string;
  accessType: string;
  accessZone: string;
  facilityId: string;
  facilityName: string;
  userId: string;
  userName: string;
  userRole: string;
  cardNumber: string;
  projectId: string;
}

export interface AccessEventsResponse {
  items: AccessEventItem[];
  pagination: {
    page: number;
    limit: number;
  };
}

export const getAnalyticsOverviewApi = async (params?: AnalyticsCommonParams): Promise<AnalyticsOverviewResponse> => {
  try {
    const res = await api.get("analytics/overview", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAnalyticsBookingsByActivityApi = async (params?: AnalyticsPaginationParams): Promise<BookingsByActivityResponse> => {
  try {
    const res = await api.get("analytics/bookings-by-activity", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAnalyticsRevenueByActivityApi = async (params?: AnalyticsPaginationParams): Promise<RevenueByActivityResponse> => {
  try {
    const res = await api.get("analytics/revenue-by-activity", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAnalyticsAccessEventsApi = async (params?: AnalyticsPaginationParams): Promise<AccessEventsResponse> => {
  try {
    const res = await api.get("analytics/access-events", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

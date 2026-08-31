import { api, handleApiError } from "@/utils/axios";

export type BanquetStatus = "TENTATIVE" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type BanquetDepositStatus = "NOT_REQUIRED" | "PENDING" | "COLLECTED" | "REFUNDED";
export type BanquetTimeline = "UPCOMING" | "PAST" | "ALL";

export interface BanquetBookingPayload {
  projectId?: string;
  eventDate: string;
  eventTitle: string;
  expectedGuests: number;
  hostName: string;
  residentIdentifier?: string;
  securityDepositAmount?: number;
  depositStatus?: BanquetDepositStatus;
  startTime?: string;
  endTime?: string;
  status?: BanquetStatus;
  notes?: string;
}

export interface BanquetBookingsParams {
  projectId: string;
  timeline?: BanquetTimeline;
  status?: BanquetStatus;
  depositStatus?: BanquetDepositStatus;
  hostUserId?: string;
  flatId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  format?: "excel";
}

const request = async <T>(run: () => Promise<{ data: T }>) => {
  try { return (await run()).data; } catch (error) { throw handleApiError(error); }
};

export const getBanquetBookingsApi = (params: BanquetBookingsParams) =>
  request(() => api.get("manager/banquet/bookings", { params }));
export const exportBanquetBookingsApi = (params: BanquetBookingsParams) =>
  request<Blob>(() => api.get("manager/banquet/bookings", { params: { ...params, timeline: "ALL", format: "excel" }, responseType: "blob" }));
export const createBanquetBookingApi = (data: BanquetBookingPayload & { projectId: string }) =>
  request(() => api.post("manager/banquet/bookings", data));
export const updateBanquetBookingApi = (id: string, data: BanquetBookingPayload) =>
  request(() => api.patch(`manager/banquet/bookings/${id}`, data));
export const updateBanquetStatusApi = (id: string, data: { status: BanquetStatus; notes?: string }) =>
  request(() => api.patch(`manager/banquet/bookings/${id}/status`, data));
export const cancelBanquetBookingApi = (id: string, reason?: string) =>
  request(() => api.delete(`manager/banquet/bookings/${id}`, { data: { reason } }));

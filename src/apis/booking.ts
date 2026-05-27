import { api, handleApiError } from "@/utils/axios";

export interface GetBookingsParams {
  facilityId?: string;
  userId?: string;
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface CancelBookingPayload {
  reason?: string;
}

export interface RejectBookingPayload {
  reason?: string;
}

export interface UpdateBookingPaymentPayload {
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

export const getBookingsApi = async (params?: GetBookingsParams) => {
  try {
    const res = await api.get("bookings", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBookingDetailsApi = async (bookingId: string) => {
  try {
    const res = await api.get(`bookings/${bookingId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelBookingApi = async (bookingId: string, data?: CancelBookingPayload) => {
  try {
    const res = await api.patch(`bookings/${bookingId}/cancel`, data || {});
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const approveBookingApi = async (bookingId: string) => {
  try {
    const res = await api.patch(`bookings/${bookingId}/approve`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const rejectBookingApi = async (bookingId: string, data?: RejectBookingPayload) => {
  try {
    const res = await api.patch(`bookings/${bookingId}/reject`, data || {});
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateBookingPaymentApi = async (bookingId: string, data: UpdateBookingPaymentPayload) => {
  try {
    const res = await api.patch(`bookings/${bookingId}/payment-status`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

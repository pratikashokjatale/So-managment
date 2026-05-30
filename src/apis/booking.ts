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

export interface GetSlotsParams {
  facilityId: string;
  date: string; // YYYY-MM-DD
  slotMinutes?: 30 | 45 | 60 | 90 | 120;
}

export interface CreateBookingPayload {
  facilityId: string;
  bookingDate: string;
  startTime: string;  // HH:MM
  endTime: string;    // HH:MM
  attendeeCount?: number;
  guestCount?: number;
  bookedForType?: "SELF" | "OTHER";
  userId?: string;
  notes?: string;
}

export const getSlotsApi = async (params: GetSlotsParams) => {
  try {
    const res = await api.get("bookings/slots", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createBookingApi = async (data: CreateBookingPayload) => {
  try {
    const res = await api.post("bookings", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

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

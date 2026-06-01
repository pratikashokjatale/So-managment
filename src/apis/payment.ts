import { api, handleApiError } from "@/utils/axios";

export interface CreateManualPaymentPayload {
  payableType: 'BOOKING' | 'SUBSCRIPTION';
  payableId: string;
  provider: 'MANUAL' | 'RAZORPAY' | 'STRIPE' | 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'WALLET';
  method?: string;
  idempotencyKey?: string;
  notes?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface GetPaymentsParams {
  payableType?: 'BOOKING' | 'SUBSCRIPTION';
  payableId?: string;
  userId?: string;
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  provider?: 'MANUAL' | 'RAZORPAY' | 'STRIPE' | 'CASH' | 'UPI' | 'BANK_TRANSFER' | 'WALLET';
  page?: number;
  limit?: number;
}

export interface UpdatePaymentStatusPayload {
  status: 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  providerPaymentId?: string;
  method?: string;
  notes?: string;
}

export const createManualPaymentApi = async (data: CreateManualPaymentPayload) => {
  try {
    const res = await api.post("payments", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPaymentsApi = async (params?: GetPaymentsParams) => {
  try {
    const res = await api.get("payments", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPaymentDetailsApi = async (paymentId: string) => {
  try {
    const res = await api.get(`payments/${paymentId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updatePaymentStatusApi = async (paymentId: string, data: UpdatePaymentStatusPayload) => {
  try {
    const res = await api.patch(`payments/${paymentId}/status`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

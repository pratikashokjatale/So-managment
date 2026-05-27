import { api, handleApiError } from "@/utils/axios";

export interface CreatePlanPayload {
  facilityId: string;
  name: string;
  code: string;
  description?: string;
  durationDays: number;
  priceAmount: number;
  priceCurrency: string;
  requiresApproval?: boolean;
  maxUsesPerDay?: number | null;
}

export interface UpdatePlanPayload {
  name?: string;
  description?: string;
  durationDays?: number;
  priceAmount?: number;
  priceCurrency?: string;
  requiresApproval?: boolean;
  maxUsesPerDay?: number | null;
  isActive?: boolean;
}

export interface CreateSubscriptionPayload {
  planId: string;
}

export interface UpdateSubscriptionPaymentPayload {
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
}

export interface RejectSubscriptionPayload {
  reason: string;
}

// Subscription Plans APIs
export const getSubscriptionPlansApi = async (facilityId: string, isActive?: boolean) => {
  try {
    const params = isActive !== undefined ? { facilityId, isActive } : { facilityId };
    const res = await api.get("subscriptions/plans", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createSubscriptionPlanApi = async (data: CreatePlanPayload) => {
  try {
    const res = await api.post("subscriptions/plans", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateSubscriptionPlanApi = async (planId: string, data: UpdatePlanPayload) => {
  try {
    const res = await api.patch(`subscriptions/plans/${planId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Subscriptions APIs
export const createSubscriptionApi = async (data: CreateSubscriptionPayload) => {
  try {
    const res = await api.post("subscriptions", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSubscriptionsApi = async (params?: { userId?: string; facilityId?: string; status?: string }) => {
  try {
    const res = await api.get("subscriptions", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSubscriptionDetailsApi = async (subscriptionId: string) => {
  try {
    const res = await api.get(`subscriptions/${subscriptionId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateSubscriptionPaymentApi = async (subscriptionId: string, data: UpdateSubscriptionPaymentPayload) => {
  try {
    const res = await api.patch(`subscriptions/${subscriptionId}/payment-status`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const approveSubscriptionApi = async (subscriptionId: string) => {
  try {
    const res = await api.patch(`subscriptions/${subscriptionId}/approve`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const rejectSubscriptionApi = async (subscriptionId: string, data: RejectSubscriptionPayload) => {
  try {
    const res = await api.patch(`subscriptions/${subscriptionId}/reject`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelSubscriptionApi = async (subscriptionId: string) => {
  try {
    const res = await api.patch(`subscriptions/${subscriptionId}/cancel`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

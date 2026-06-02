import { api, handleApiError } from "@/utils/axios";

export interface WalletTransactionsParams {
  userId?: string;
  type?: 'CREDIT' | 'DEBIT' | 'REFUND' | 'ADJUSTMENT';
  page?: number;
  limit?: number;
}

export interface CreateWalletRechargeOrderPayload {
  amount: number;
  notes?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: any;
}

export interface VerifyWalletRechargePayload {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface AdminRechargeUserWalletPayload {
  amount: number;
  method: 'MANUAL' | 'CASH' | 'UPI' | 'BANK_TRANSFER';
  referenceId?: string;
  remarks?: string;
}

export const getWalletApi = async () => {
  try {
    const res = await api.get("wallet/me");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getWalletTransactionsApi = async (params?: WalletTransactionsParams) => {
  try {
    const res = await api.get("wallet/transactions", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createWalletRechargeOrderApi = async (data: CreateWalletRechargeOrderPayload) => {
  try {
    const res = await api.post("wallet/recharge/razorpay/order", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const verifyWalletRechargeApi = async (data: VerifyWalletRechargePayload) => {
  try {
    const res = await api.post("wallet/recharge/razorpay/verify", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const adminRechargeUserWalletApi = async (userId: string, data: AdminRechargeUserWalletPayload) => {
  try {
    const res = await api.post(`wallet/admin/users/${userId}/recharge`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAdminUserWalletApi = async (userId: string) => {
  try {
    const res = await api.get(`wallet/admin/users/${userId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

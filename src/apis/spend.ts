import { api, handleApiError } from "@/utils/axios";

export type SpendCategory = "GROCERY" | "UTILITIES" | "SUPPLIES" | "HOUSEKEEPING" | "MAINTENANCE" | "MISCELLANEOUS";
export type SpendStatus = "ACTIVE" | "VOID" | "ALL";

export interface SpendSummaryParams {
  projectId: string;
  dateFrom: string;
  dateTo: string;
}

export interface SpendExpensesParams {
  projectId: string;
  category?: SpendCategory;
  status?: SpendStatus;
  vendor?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  format?: "excel";
}

export interface CreateSpendExpensePayload {
  projectId: string;
  expenseDate: string;
  category: SpendCategory;
  vendorName: string;
  description: string;
  amount: number;
  billNumber?: string;
  receiptUrl?: string;
}

export const getSpendSummaryApi = async (params: SpendSummaryParams) => {
  try {
    return (await api.get("manager/spend/summary", { params })).data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getSpendExpensesApi = async (params: SpendExpensesParams) => {
  try {
    return (await api.get("manager/spend/expenses", { params })).data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createSpendExpenseApi = async (data: CreateSpendExpensePayload) => {
  try {
    return (await api.post("manager/spend/expenses", data)).data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const exportSpendExpensesApi = async (params: SpendExpensesParams) => {
  try {
    return (await api.get("manager/spend/expenses", {
      params: { ...params, format: "excel" },
      responseType: "blob",
    })).data as Blob;
  } catch (error) {
    throw handleApiError(error);
  }
};

import { api, handleApiError } from "@/utils/axios";

export interface GetIssuesParams {
  type?: "ISSUE" | "FEEDBACK";
  category?:
    | "MAINTENANCE"
    | "HOUSEKEEPING"
    | "SECURITY"
    | "FACILITY"
    | "BOOKING"
    | "PAYMENT"
    | "STAFF"
    | "APP"
    | "OTHER";
  status?:
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | "REJECTED"
    | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  userId?: string;
  flatId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}

export interface UpdateStatusPayload {
  status:
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED"
    | "REJECTED"
    | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedTo?: string;
  adminNotes?: string;
  resolutionNotes?: string;
}

export interface CancelIssuePayload {
  reason: string;
}

export const getIssuesApi = async (params?: GetIssuesParams) => {
  try {
    const res = await api.get("issues", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getIssueDetailsApi = async (id: string) => {
  try {
    const res = await api.get(`issues/${id}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateIssueStatusApi = async (
  id: string,
  data: UpdateStatusPayload,
) => {
  try {
    const res = await api.patch(`issues/${id}/status`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const cancelIssueApi = async (id: string, data: CancelIssuePayload) => {
  try {
    const res = await api.patch(`issues/${id}/cancel`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

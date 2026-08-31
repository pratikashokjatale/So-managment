import { api, handleApiError } from "@/utils/axios";

export type ManagerRequestStatus = "OPEN" | "WITH_CRM" | "WITH_PURCHASE" | "APPROVED" | "REJECTED" | "FULFILLED" | "CANCELLED";
export type ManagerRequestUrgency = "LOW" | "NORMAL" | "HIGH" | "URGENT";
export type ManagerRequestDepartment = "CRM" | "PURCHASE" | "MANAGER";

export interface ManagerRequestPayload {
  projectId?: string;
  title: string;
  quantity: number;
  urgency: ManagerRequestUrgency;
  targetDepartment: ManagerRequestDepartment;
  referenceLink?: string;
  note?: string;
  attachmentUrls?: string[];
  adminNotes?: string;
}

export interface ManagerRequestsParams {
  projectId: string;
  status?: ManagerRequestStatus;
  urgency?: ManagerRequestUrgency;
  targetDepartment?: ManagerRequestDepartment;
  createdBy?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  format?: "excel";
}

const run = async <T>(request: () => Promise<{ data: T }>) => {
  try { return (await request()).data; } catch (error) { throw handleApiError(error); }
};

export const getManagerRequestsSummaryApi = (params: { projectId: string; dateFrom: string; dateTo: string }) => run(() => api.get("manager/requests/summary", { params }));
export const getManagerRequestsApi = (params: ManagerRequestsParams) => run(() => api.get("manager/requests", { params }));
export const exportManagerRequestsApi = (params: ManagerRequestsParams) => run<Blob>(() => api.get("manager/requests", { params: { ...params, format: "excel" }, responseType: "blob" }));
export const createManagerRequestApi = (data: ManagerRequestPayload & { projectId: string }) => run(() => api.post("manager/requests", data));
export const updateManagerRequestApi = (id: string, data: ManagerRequestPayload) => run(() => api.patch(`manager/requests/${id}`, data));
export const updateManagerRequestStatusApi = (id: string, data: { status: ManagerRequestStatus; adminNotes?: string }) => run(() => api.patch(`manager/requests/${id}/status`, data));

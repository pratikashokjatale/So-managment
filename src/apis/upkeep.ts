import { api, handleApiError } from "@/utils/axios";

export type UpkeepDepartment = "SECURITY" | "HOUSEKEEPING" | "MAINTENANCE" | "FACILITY" | "ADMINISTRATION" | "SUPPORT" | "OTHER";
export type UpkeepStatus = "OPEN" | "COMPLETED" | "CANCELLED" | "ALL";

export interface UpkeepRoundsParams {
  projectId?: string;
  staffId?: string;
  department?: UpkeepDepartment;
  status?: UpkeepStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  format?: "excel";
}

export interface CreateUpkeepRoundPayload {
  projectId: string;
  name: string;
  roundDate: string;
  roundTime: string;
  staffId: string;
  notes?: string;
  items: Array<{ itemName: string; sortOrder: number }>;
}

const request = async <T>(run: () => Promise<{ data: T }>) => {
  try { return (await run()).data; } catch (error) { throw handleApiError(error); }
};

export const getUpkeepSummaryApi = (params?: { projectId?: string; date?: string }) =>
  request(() => api.get("manager/upkeep/summary", { params }));

export const getUpkeepRoundsApi = (params: UpkeepRoundsParams) =>
  request(() => api.get("manager/upkeep/rounds", { params }));

export const createUpkeepRoundApi = (data: CreateUpkeepRoundPayload) =>
  request(() => api.post("manager/upkeep/rounds", data));

export const checkUpkeepItemApi = (itemId: string, data: { isDone: boolean; notes?: string }) =>
  request(() => api.patch(`manager/upkeep/items/${itemId}/check`, data));

export const exportUpkeepRoundsApi = (params: UpkeepRoundsParams) =>
  request<Blob>(() => api.get("manager/upkeep/rounds", {
    params: { ...params, format: "excel" },
    responseType: "blob",
  }));

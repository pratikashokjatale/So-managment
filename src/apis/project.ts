import { api, handleApiError } from "@/utils/axios";

export interface GetProjectsParams {
  page?: number;
  limit?: number;
  status?: string;
}

export interface CreateProjectPayload {
  name: string;
  code: string;
  description?: string;
  location?: string;
}

export interface UpdateProjectPayload {
  name?: string;
  description?: string;
  location?: string;
  status?: string;
}

export const getProjectsApi = async (params?: GetProjectsParams) => {
  try {
    const res = await api.get("projects", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProjectDetailsApi = async (projectId: string) => {
  try {
    const res = await api.get(`projects/${projectId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createProjectApi = async (data: CreateProjectPayload) => {
  try {
    const res = await api.post("projects", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateProjectApi = async (projectId: string, data: UpdateProjectPayload) => {
  try {
    const res = await api.patch(`projects/${projectId}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

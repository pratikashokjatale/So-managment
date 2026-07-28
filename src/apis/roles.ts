import { api, handleApiError } from "@/utils/axios";

export interface RolePermissions {
  view?: boolean;
  book?: boolean;
  blockCards?: boolean;
  attendance?: boolean;
  documents?: boolean;
  crm?: boolean;
  issuePasses?: boolean;
  analytics?: boolean;
  enroll?: boolean;
  integrations?: boolean;
  roles?: boolean;
}

export interface RoleProfile {
  id: string;
  name: string;
  code: string;
  baseRole: string;
  projectId?: string;
  description?: string;
  permissions: RolePermissions;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface GetRolesParams {
  projectId?: string;
  baseRole?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateRolePayload {
  projectId?: string;
  name: string;
  code: string;
  baseRole: string;
  description?: string;
  permissions: RolePermissions;
  status: "ACTIVE" | "INACTIVE";
}

export interface UpdateRolePayload {
  name?: string;
  description?: string;
  permissions?: RolePermissions;
  status?: "ACTIVE" | "INACTIVE";
}

export const getRolesApi = async (params?: GetRolesParams) => {
  try {
    const res = await api.get("roles", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createRoleApi = async (data: CreateRolePayload) => {
  try {
    const res = await api.post("roles", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateRoleApi = async (id: string, data: UpdateRolePayload) => {
  try {
    const res = await api.patch(`roles/${id}`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const assignRoleToUserApi = async (userId: string, roleProfileId: string, projectId?: string) => {
  try {
    const res = await api.post(`roles/users/${userId}/profiles`, { roleProfileId, projectId });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getUserRolesApi = async (userId: string) => {
  try {
    const res = await api.get(`roles/users/${userId}/profiles`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const removeUserRoleApi = async (userId: string, roleProfileId: string) => {
  try {
    const res = await api.delete(`roles/users/${userId}/profiles/${roleProfileId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

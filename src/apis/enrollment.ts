import { api, handleApiError } from "@/utils/axios";

export interface PendingEnrollmentsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getPendingEnrollmentsApi = async (params?: PendingEnrollmentsParams) => {
  try {
    const res = await api.get("enrollment/pending", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Approve an enrollment request.
 * Per API spec, admin approval = PATCH /users/:id { status: "ACTIVE" }
 * Falls back to POST enrollment/approve { userId } if the patch endpoint fails.
 */
export const approveEnrollmentApi = async (userId: string) => {
  try {
    // Primary: update user status to ACTIVE via PATCH /users/:id
    const res = await api.patch(`users/${userId}`, { status: "ACTIVE" });
    return res?.data;
  } catch (patchError) {
    // Fallback: try the enrollment/approve endpoint
    try {
      const res = await api.post("enrollment/approve", { userId });
      return res?.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

/**
 * Reject an enrollment request.
 * Sets user status to SUSPENDED via PATCH /users/:id.
 * Falls back to POST enrollment/reject { userId, reason }.
 */
export const rejectEnrollmentApi = async (userId: string, reason?: string) => {
  try {
    // Primary: update user status to SUSPENDED via PATCH /users/:id
    const res = await api.patch(`users/${userId}`, { status: "SUSPENDED" });
    return res?.data;
  } catch (patchError) {
    // Fallback: try the enrollment/reject endpoint
    try {
      const res = await api.post("enrollment/reject", { userId, reason });
      return res?.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};

import { api, handleApiError } from "@/utils/axios";

export const getCrmOnboardingSummaryApi = async () => {
  try {
    const res = await api.get("crm/onboarding/summary");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCrmResidentInventorySummaryApi = async () => {
  try {
    const res = await api.get("crm/resident-inventory/summary");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCrmPopulationSummaryApi = async (params?: any) => {
  try {
    const res = await api.get("crm/population/summary", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getReminderTemplateApi = async () => {
  try {
    const res = await api.get("crm/reminder-template");
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateReminderTemplateApi = async (data: any) => {
  try {
    const res = await api.patch("crm/reminder-template", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const previewReminderApi = async (data: { milestoneId: string, channel: string }) => {
  try {
    const res = await api.post("crm/reminders/preview", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const sendRemindersApi = async (data: { milestoneIds: string[], channel: string }) => {
  try {
    const res = await api.post("crm/reminders/send", data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getReminderLogsApi = async (params: { caseId?: string, channel?: string, status?: string, page?: number, limit?: number }) => {
  try {
    const res = await api.get("crm/reminders/logs", { params });
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};


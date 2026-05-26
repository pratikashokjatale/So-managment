import { api, handleApiError } from "@/utils/axios";

export const uploadDocumentApi = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("enrollment/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const url = res?.data?.data?.url || res?.data?.url || res?.data;
    if (!url) throw new Error("Upload succeeded but no URL returned");
    return url as string;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface UploadDocumentPayload {
  documentType: string;
  documentCategory: string;
  title: string;
  description?: string;
  photoUrl?: string;
  photoFileName?: string;
  photoSize?: number;
  pdfUrl?: string;
  pdfFileName?: string;
  pdfSize?: number;
}

export const uploadUserDocumentApi = async (userId: string, data: UploadDocumentPayload) => {
  try {
    const res = await api.post(`users/${userId}/documents`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteUserDocumentApi = async (userId: string, documentId: string) => {
  try {
    const res = await api.delete(`users/${userId}/documents/${documentId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const uploadFamilyDocumentApi = async (userId: string, familyMemberId: string, data: UploadDocumentPayload) => {
  try {
    const res = await api.post(`family/${userId}/members/${familyMemberId}/documents`, data);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteFamilyDocumentApi = async (userId: string, familyMemberId: string, documentId: string) => {
  try {
    const res = await api.delete(`family/${userId}/members/${familyMemberId}/documents/${documentId}`);
    return res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

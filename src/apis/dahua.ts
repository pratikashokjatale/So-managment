import { api, handleApiError } from "@/utils/axios";

// ── Types ─────────────────────────────────────────────────────────────

export interface DahuaBridgeStatus {
  enabled: boolean;
  bridgeSecretConfigured: boolean;
  decisionTtlSeconds: number;
  scanMaxAgeSeconds: number;
  timeZone: string;
  controllerCredentialsStoredInBackend: boolean;
}

export type RfidProvider = "DAHUA" | "ISECURE" | "GENERIC";
export type RfidPurpose = "FACILITY_ACCESS" | "SOCIETY_GATE" | "STAFF_ATTENDANCE";
export type RfidDirection = "ENTRY" | "EXIT" | "BOTH";
export type DeviceStatus = "ACTIVE" | "INACTIVE" | "MAINTENANCE";

export interface RfidDevice {
  id: string;
  name: string;
  provider: RfidProvider;
  serialNumber: string;
  projectId: string;
  facilityId?: string | null;
  purpose: RfidPurpose;
  direction: RfidDirection;
  accessZone: string;
  status: DeviceStatus;
  createdAt?: string;
  updatedAt?: string;
  project?: { id: string; name: string };
  facility?: { id: string; name: string };
}

export interface RegisterDevicePayload {
  name: string;
  provider: "DAHUA";
  serialNumber: string;
  projectId: string;
  facilityId?: string;
  purpose: RfidPurpose;
  direction: RfidDirection;
  accessZone: string;
  status: DeviceStatus;
}

export type AccessMode = "AUTO" | "SUBSCRIPTION" | "BOOKING";

export interface DahuaMapping {
  id: string;
  deviceId: string;
  cgiDeviceId: string;
  doorIndex: number;
  accessMode: AccessMode;
  bookingGraceMinutes: number;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
  device?: RfidDevice;
}

export interface CreateMappingPayload {
  deviceId: string;
  cgiDeviceId: string;
  doorIndex: number;
  accessMode: AccessMode;
  bookingGraceMinutes?: number;
  enabled?: boolean;
}

export interface UpdateMappingPayload {
  cgiDeviceId?: string;
  doorIndex?: number;
  accessMode?: AccessMode;
  bookingGraceMinutes?: number;
  enabled?: boolean;
}

export interface GetMappingsParams {
  page?: number;
  limit?: number;
  projectId?: string;
  enabled?: boolean;
  cgiDeviceId?: string;
}

export type HardwareResult = "OPENED" | "DENIED" | "FAILED" | "TIMEOUT";

export interface AccessAttempt {
  id: string;
  attemptId?: string;
  transmissionUuid: string;
  cgiDeviceId?: string;
  doorIndex?: number;
  cardUid: string;
  vendorUserId?: string;
  userName?: string;
  direction: RfidDirection;
  scannedAt: string;
  evaluatedAt: string;
  expiresAt: string;
  accessGranted: boolean;
  reason: string;
  hardwareResult?: HardwareResult | null;
  hardwareAnomaly?: boolean;
  hardwareErrorCode?: number | string | null;
  errorCode?: string | null;
  occurredAt?: string | null;
  projectId?: string;
  facilityId?: string;
  userId?: string;
  mappingId?: string;
  decision?: {
    source?: string;
    [key: string]: any;
  };
  user?: { id: string; name: string; email?: string; role?: string };
  project?: { id: string; name: string };
  facility?: { id: string; name: string };
}



export interface GetAttemptsParams {
  page?: number;
  limit?: number;
  projectId?: string;
  facilityId?: string;
  userId?: string;
  mappingId?: string;
  accessGranted?: boolean;
  hardwareResult?: HardwareResult;
  hardwareAnomaly?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// ── API Functions ─────────────────────────────────────────────────────

/**
 * GET /api/v1/rfid/dahua/status
 * Returns Dahua Bridge status & configuration info
 */
export const getDahuaBridgeStatusApi = async (): Promise<DahuaBridgeStatus> => {
  try {
    const res = await api.get("rfid/dahua/status");
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * GET /api/v1/rfid/devices
 * List registered RFID devices (supports DAHUA, etc.)
 */
export const getRfidDevicesApi = async (params?: { projectId?: string; provider?: string; page?: number; limit?: number }): Promise<RfidDevice[]> => {
  try {
    const res = await api.get("rfid/devices", { params });
    const data = res?.data;
    if (Array.isArray(data?.data?.items)) return data.data.items;
    if (Array.isArray(data?.data?.data)) return data.data.data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST /api/v1/rfid/devices
 * Register a physical device in the registry
 */
export const registerRfidDeviceApi = async (payload: RegisterDevicePayload): Promise<RfidDevice> => {
  try {
    const res = await api.post("rfid/devices", payload);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * DELETE /api/v1/rfid/devices/:id
 * Refused while the reader still has a door mapping.
 */
export const deleteRfidDeviceApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`rfid/devices/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * GET /api/v1/rfid/dahua/mappings
 * List Dahua CGI door mappings
 */
export const getDahuaMappingsApi = async (params?: GetMappingsParams): Promise<{ items: DahuaMapping[]; total: number }> => {
  try {
    const res = await api.get("rfid/dahua/mappings", { params });
    const data = res?.data;
    const items = data?.items || data?.data?.items || data?.data || (Array.isArray(data) ? data : []);
    const total = data?.pagination?.total || data?.total || items.length;
    return { items, total };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST /api/v1/rfid/dahua/mappings
 * Create a new Dahua CGI Door Mapping
 */
export const createDahuaMappingApi = async (payload: CreateMappingPayload): Promise<DahuaMapping> => {
  try {
    const res = await api.post("rfid/dahua/mappings", payload);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PATCH /api/v1/rfid/dahua/mappings/:id
 * Update an existing mapping (e.g. toggle enabled, change accessMode, grace minutes)
 */
export const updateDahuaMappingApi = async (id: string, payload: UpdateMappingPayload): Promise<DahuaMapping> => {
  try {
    const res = await api.patch(`rfid/dahua/mappings/${id}`, payload);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * DELETE /api/v1/rfid/dahua/mappings/:id
 * Rule: Only after the mapping has been turned off for 2 minutes. Otherwise its cards would stay valid on the controller.
 */
export const deleteDahuaMappingApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`rfid/dahua/mappings/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * GET /api/v1/rfid/dahua/attempts
 * Audit and verify real-time controller attempts and hardware results.
 * Returns newest tap first, plus a userName field (e.g. "Yash" instead of controller ID "2").
 */
export const getDahuaAttemptsApi = async (params?: GetAttemptsParams): Promise<{ items: AccessAttempt[]; total: number }> => {
  try {
    const res = await api.get("rfid/dahua/attempts", { params });
    const data = res?.data;
    const items = data?.items || data?.data?.items || data?.data || (Array.isArray(data) ? data : []);
    const total = data?.pagination?.total || data?.total || items.length;
    return { items, total };
  } catch (error) {
    throw handleApiError(error);
  }
};


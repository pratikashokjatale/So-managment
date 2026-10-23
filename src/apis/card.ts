import { api, handleApiError } from "@/utils/axios";

export type CardType = "RFID" | "FOB";
export type HolderType = "RESIDENT" | "GUEST" | "STAFF";
export type CardStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "EXPIRED";

export interface CardItem {
  id: string;
  cardUid: string;
  cardType: CardType;
  holderType: HolderType;
  userId: string;
  flatId?: string | null;
  status: CardStatus;
  validFrom?: string | null;
  validTo?: string | null;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    accountRole?: string;
  };
  flat?: {
    id: string;
    number?: string;
    flatNumber?: string;
  };
}

export interface GetCardsParams {
  userId?: string;
  page?: number;
  limit?: number;
  status?: CardStatus;
  search?: string;
}

export interface CreateCardPayload {
  cardUid: string;
  cardType: CardType;
  holderType: HolderType;
  userId: string;
  flatId?: string | null;
}

export interface UpdateCardPayload {
  status?: CardStatus;
}

/**
 * GET /api/v1/cards
 * Query physical RFID/FOB cards linked to users
 */
export const getCardsApi = async (params?: GetCardsParams): Promise<{ items: CardItem[]; total: number }> => {
  try {
    const res = await api.get("cards", { params });
    const data = res?.data;
    const items =
      data?.items ||
      data?.data?.items ||
      data?.data?.cards ||
      data?.data ||
      (Array.isArray(data) ? data : []);
    const total = data?.pagination?.total || data?.data?.pagination?.total || data?.total || items.length;
    return { items, total };
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * GET /api/v1/cards/:id
 */
export const getCardDetailsApi = async (cardId: string): Promise<CardItem> => {
  try {
    const res = await api.get(`cards/${cardId}`);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * POST /api/v1/cards
 * Link physical cardUid to user
 */
export const createCardApi = async (payload: CreateCardPayload): Promise<CardItem> => {
  try {
    const res = await api.post("cards", payload);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * PATCH /api/v1/cards/:id
 * E.g. block lost card: { status: "BLOCKED" }
 */
export const updateCardApi = async (cardId: string, payload: UpdateCardPayload): Promise<CardItem> => {
  try {
    const res = await api.patch(`cards/${cardId}`, payload);
    return res?.data?.data || res?.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

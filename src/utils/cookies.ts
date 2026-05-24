import Cookies from "js-cookie";

interface CookieOptions {
  expires: number;
  secure: boolean;
  sameSite: "strict" | "lax" | "none";
  path: string;
}

const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

const defaultOptions: CookieOptions = {
  secure: isHttps,
  sameSite: "strict",
  path: "/",
  expires: 20,
};

export const setCookies = (accessToken: string) => {
  Cookies.set("accessToken", accessToken, {
    ...defaultOptions,
    expires: 7,
  });
};

export const setRefreshToken = (refreshToken: string) => {
  Cookies.set("refreshToken", refreshToken, {
    ...defaultOptions,
    expires: 7,
  });
};

export const clearCookies = () => {
  const options = { path: "/" };
  Cookies.remove("accessToken", options);
  Cookies.remove("refreshToken", options);
};

export const getRefreshToken = () => {
  try {
    return Cookies.get("refreshToken");
  } catch {
    return null;
  }
};

export const getCookie = () => {
  try {
    const value = Cookies.get("accessToken");
    return value;
  } catch {
    return null;
  }
};

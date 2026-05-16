export const setSession = (accessToken: string) => {
  try {
    sessionStorage.setItem("accessToken", accessToken);
  } catch {
    console.warn("Session storage not available");
  }
};

export const getSession = () => {
  try {
    return sessionStorage.getItem("accessToken");
  } catch {
    return null;
  }
};

export const setSessionRefreshToken = (refreshToken: string) => {
  try {
    sessionStorage.setItem("refreshToken", refreshToken);
  } catch {
    console.warn("Session storage not available");
  }
};

export const getSessionRefreshToken = () => {
  try {
    return sessionStorage.getItem("refreshToken");
  } catch {
    return null;
  }
};

export const clearSession = () => {
  try {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
  } catch {
    console.warn("Session storage not available");
  }
};

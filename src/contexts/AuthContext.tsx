import React, { createContext, useContext, useEffect, useReducer } from "react";
import { toast } from "react-hot-toast";
import accountReducer from "../store/accountReducer";
import {
  AUTH_LOADING,
  IS_LOGINLODING,
  LOGIN,
  LOGOUT,
  SET_USER,
} from "../store/actionType";
import {
  clearCookies,
  getCookie,
  setCookies,
  setRefreshToken,
  getRefreshToken,
} from "../utils/cookies";
import {
  clearSession,
  getSession,
  setSession,
  setSessionRefreshToken,
  getSessionRefreshToken,
} from "../utils/session";
import { loginApi, logoutApi } from "../apis/auth";
import { getCachedMe, clearApiCache } from "@/utils/apiCache";

type AuthContextType = {
  isLoggedIn: any;
  isInitialized: any;
  isAuthLoading: any;
  isLoginLoading: any;
  user: any;
  projectId: any;
  errors: any;
  isAdmin: boolean;
  login: (
    email: string,
    password: string,
    isLoggingIn: boolean,
  ) => Promise<any>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refreshUser: () => void;
  logout: () => Promise<void>;
};

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
  isAuthLoading: true,
  isLoginLoading: false,
  user: null,
  projectId: null,
  errors: null,
  refreshUser: async () => {},
  login: async () => {},
  logout: () => {},
  sendOtp: async () => {},
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  resetPassword: async () => {},
  updateProfile: () => {},
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(accountReducer, initialState);

  const refreshUser = async () => {
    dispatch({
      type: AUTH_LOADING,
      payload: true,
    });
    try {
      const token = getCookie() || getSession();

      if (token) {
        const res = await getCachedMe();
        dispatch({
          type: SET_USER,
          payload: {
            isLoggedIn: true,
            user: res?.data?.user || res?.user || res?.data || res || {},
          },
        });
      } else {
        dispatch({
          type: LOGOUT,
        });
      }
    } catch (error) {
      console.error("Authentication error:", error);
      dispatch({
        type: LOGOUT,
      });
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (
    email: string,
    password: string,
    isLogin: boolean,
  ) => {
    dispatch({
      type: IS_LOGINLODING,
      payload: true,
    });
    try {
      clearApiCache();
      const res = await loginApi({ identifier: email, password });
      
      const accessToken = res?.data?.tokens?.accessToken || res?.tokens?.accessToken || res?.accessToken || res?.token || res?.data?.accessToken || res?.data?.token;
      const refreshToken = res?.data?.tokens?.refreshToken || res?.tokens?.refreshToken || res?.refreshToken || res?.data?.refreshToken;
      const user = res?.data?.user || res?.user || res?.data || res;

      if (accessToken) {
        if (isLogin) {
          setCookies(accessToken);
          if (refreshToken) setRefreshToken(refreshToken);
        } else {
          setSession(accessToken);
          if (refreshToken) setSessionRefreshToken(refreshToken);
        }
      }

      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: user,
        },
      });

      return res;
    } catch (error: any) {
      toast.error(error?.message || "Login failed");
      throw error;
    } finally {
      dispatch({
        type: IS_LOGINLODING,
        payload: false,
      });
    }
  };

  const logout = async () => {
    dispatch({
      type: AUTH_LOADING,
      payload: true,
    });
    try {
      const refreshToken = getRefreshToken() || getSessionRefreshToken();
      if (refreshToken) {
        await logoutApi(refreshToken);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearCookies();
      clearSession();
      clearApiCache();
      dispatch({ type: LOGOUT });
    }
  };

  const isAdmin =
    state.user?.role?.toLowerCase() === "admin" ||
    state.user?.roles?.some((role: string) => role?.toLowerCase() === "admin") ||
    state.user?.roles?.includes("admin") ||
    false;

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshUser, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

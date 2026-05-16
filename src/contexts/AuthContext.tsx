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
} from "../utils/cookies";
import {
  clearSession,
  getSession,
  setSession,
  setSessionRefreshToken,
} from "../utils/session";

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
  ) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  refreshUser: () => void;
  logout: () => void;
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
        dispatch({
          type: SET_USER,
          payload: {
            isLoggedIn: true,
            user: {},
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
    _username: string,
    _password: string,
    isLogin: boolean,
  ) => {
    dispatch({
      type: IS_LOGINLODING,
      payload: true,
    });
    try {
      const res = {
        accessToken: "",
        refreshToken: "",
        user: {},
      };
      if (res?.accessToken) {
        if (isLogin) {
          setCookies(res.accessToken);
          setRefreshToken(res?.refreshToken);
        } else {
          setSession(res.accessToken);
          setSessionRefreshToken(res?.refreshToken);
        }
      }
      dispatch({
        type: LOGIN,
        payload: {
          isLoggedIn: true,
          user: res.user,
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

  const logout = () => {
    dispatch({
      type: AUTH_LOADING,
      payload: true,
    });
    clearCookies();
    clearSession();
    dispatch({ type: LOGOUT });
  };

  const isAdmin =
    state.user?.roles?.some((role: string) => role === "admin") ?? false;

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, refreshUser, isAdmin }}
    >
      {children}
    </AuthContext.Provider>
  );
};

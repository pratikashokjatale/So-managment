// action - state management
import {
  LOGIN,
  LOGOUT,
  SET_USER,
  SET_LOGIN,
  SET_ERROR,
  AUTH_LOADING,
  IS_LOGINLODING,
} from "./actionType";

// ==============================|| ACCOUNT REDUCER ||============================== //

const initialState: any = {
  isAuthLoading: true,
  isLoggedIn: false,
  isInitialized: false,
  user: null,
  errors: null,
  isLoginLoading: false,
};

const accountReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case LOGIN: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        projectId: action.payload.projectId,
        isAuthLoading: false,
      };
    }
    case SET_USER: {
      const { user } = action.payload;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
        projectId: action.payload.projectId,
        isAuthLoading: false,
      };
    }
    case SET_LOGIN: {
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        isAuthLoading: false,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
        isAuthLoading: false,
      };
    }
    case SET_ERROR: {
      return {
        ...state,
        errors: action.payload,
        isAuthLoading: false,
      };
    }
    case AUTH_LOADING: {
      return {
        ...state,
        isAuthLoading: action.payload,
      };
    }
    case IS_LOGINLODING: {
      return {
        ...state,
        isLoginLoading: action.payload,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default accountReducer;

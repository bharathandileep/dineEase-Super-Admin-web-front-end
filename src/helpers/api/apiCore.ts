import jwtDecode from "jwt-decode";
import axios, { AxiosInstance } from "axios";
import config from "../../config";
import { authApiResponseSuccess } from "../../redux/actions";
import { AuthActionTypes } from "../../redux/auth/constants";

// Store reference for later use
let storeRef: any = null;

// Function to set store reference after store is created
export const setStoreReference = (store: any) => {
  storeRef = store;
};

const AUTH_SESSION_KEY = "Session_token";

const REFRESH_INTERVAL = 15 * 60 * 1000;

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const setAuthorization = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const getUserFromCookie = () => {
  const token = localStorage.getItem(AUTH_SESSION_KEY);
  return token ? token : null;
};

// Helper function to dispatch to Redux store if available
const dispatchToStore = (action: any) => {
  if (storeRef) {
    storeRef.dispatch(action);
  } else {
    // Queue action to be dispatched once store is available
    pendingActions.push(action);
  }
};

// Queue for actions that need to be dispatched once store is available
const pendingActions: any[] = [];

// Process any pending actions once store becomes available
export const processPendingActions = () => {
  if (storeRef && pendingActions.length > 0) {
    console.log(`Processing ${pendingActions.length} pending actions`);
    pendingActions.forEach(action => {
      storeRef.dispatch(action);
    });
    pendingActions.length = 0; // Clear the array
  }
};

const refreshTokenLogic = async (): Promise<string> => {
  try {
    console.log("Refreshing token");
    const response = await axiosInstance.post(
      "/auth/new/access-token",
      {},
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.data;
    
    // Store the token in localStorage
    new APICore().setLoggedInUser(accessToken);
    
    // Decode user info
    const userInfo = jwtDecode(accessToken);
    
    // Dispatch to Redux store if available
    dispatchToStore(authApiResponseSuccess(AuthActionTypes.GOOGLE_LOGIN_USER, userInfo));
    
    // Set authorization header
    setAuthorization(accessToken);
    
    console.log("Token refreshed successfully");
    return accessToken;
  } catch (error: any) {
    console.error("Token refresh failed:", error);
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "/";
    throw error;
  }
};

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const token = await refreshTokenLogic();
        
        // Update the original request with the new token
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        
        // Retry the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getUserFromCookie();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Setup token refresh interval
const setupTokenRefreshInterval = () => {
  // Clear any existing interval
  if (window._tokenRefreshInterval) {
    clearInterval(window._tokenRefreshInterval);
  }

  // Set up a new interval with immediate check
  const checkAndRefreshToken = async () => {
    const apiCore = new APICore();
    const tokenExpiresSoon = !apiCore.isUserAuthenticated();
    const tokenExists = apiCore.getLoggedInUser();
    
    if (tokenExists && tokenExpiresSoon) {
      try {
        await refreshTokenLogic();
      } catch (error: any) {
        console.error("Token refresh failed:", error);
      }
    }
  };
  
  // Check immediately on setup
  checkAndRefreshToken();
  
  // Then set interval
  window._tokenRefreshInterval = setInterval(checkAndRefreshToken, REFRESH_INTERVAL);
};

class APICore {
  get = (url: string, params: any) => {
    return axiosInstance.get(url, { params });
  };

  getFile = (url: string, params: any) => {
    return axiosInstance.get(url, { params, responseType: "blob" });
  };

  create = (url: string, data: any) => {
    return axiosInstance.post(url, data);
  };

  updatePatch = (url: string, data: any) => {
    return axiosInstance.patch(url, data);
  };

  update = (url: string, data: any) => {
    return axiosInstance.put(url, data);
  };

  delete = (url: string) => {
    return axiosInstance.delete(url);
  };

  createWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    return axiosInstance.post(url, formData, {
      headers: { "content-type": "multipart/form-data" },
    });
  };

  updateWithFile = (url: string, data: any) => {
    const formData = new FormData();
    for (const k in data) {
      formData.append(k, data[k]);
    }
    return axiosInstance.patch(url, formData, {
      headers: { "content-type": "multipart/form-data" },
    });
  };

  getLoggedInUserInfo = () => {
    const token = this.getLoggedInUser();
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        console.error("Invalid token format:", error);
        return null;
      }
    }
    return null;
  };

  isUserAuthenticated = () => {
    const token = this.getLoggedInUser();
    if (!token) {
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      // Check if token is expired or about to expire (within 2 minutes)
      if (decoded.exp < currentTime + 120) {
        console.warn("Token expired or about to expire");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  setLoggedInUser = (session: any) => {
    if (session) {
      const tokenValue = typeof session === "string" ? session : session.token;
      localStorage.setItem(AUTH_SESSION_KEY, tokenValue);
      
      // Also update Redux store if available
      try {
        const userInfo = jwtDecode(tokenValue);
        dispatchToStore(authApiResponseSuccess(AuthActionTypes.GOOGLE_LOGIN_USER, userInfo));
      } catch (error) {
        console.error("Error updating Redux store:", error);
      }
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  };

  getLoggedInUser = () => {
    return getUserFromCookie();
  };

  // Force refresh the token manually
  refreshToken = async () => {
    return await refreshTokenLogic();
  };
}

// Add type declaration for window
declare global {
  interface Window {
    _tokenRefreshInterval: any | undefined;
  }
}

const initializeAxios = () => {
  const token = getUserFromCookie();
  if (token) {
    setAuthorization(token);
    
    // Also update Redux store if available
    try {
      const userInfo = jwtDecode(token);
      dispatchToStore(authApiResponseSuccess(AuthActionTypes.GOOGLE_LOGIN_USER, userInfo));
    } catch (error) {
      console.error("Error updating Redux store on init:", error);
    }
  }
  
  setupTokenRefreshInterval();
};

// Initialize but wait for store to be available
setTimeout(initializeAxios, 500);

export { APICore, setAuthorization, axiosInstance };
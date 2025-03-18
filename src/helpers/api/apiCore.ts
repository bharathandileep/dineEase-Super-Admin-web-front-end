import jwtDecode from "jwt-decode";
import axios, { AxiosInstance } from "axios";
import config from "../../config";
import { authApiResponseSuccess } from "../../redux/actions";
import { AuthActionTypes } from "../../redux/auth/constants";

let storeRef: any = null;

export const setStoreReference = (store: any) => {
  storeRef = store;
};

const AUTH_SESSION_KEY = "Session_token";
const REFRESH_INTERVAL = 10 * 60 * 1000;

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

const dispatchToStore = (action: any) => {
  if (storeRef) {
    storeRef.dispatch(action);
  } else {
    pendingActions.push(action);
  }
};
const pendingActions: any[] = [];

// Process any pending actions once store becomes available
export const processPendingActions = () => {
  if (storeRef && pendingActions.length > 0) {
    pendingActions.forEach((action) => {
      storeRef.dispatch(action);
    });
    pendingActions.length = 0;
  }
};

const refreshTokenLogic = async (): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      "/auth/new/access-token",
      {},
      {
        withCredentials: true,
      }
    );
    const accessToken = response.data.data;
    new APICore().setLoggedInUser(accessToken);
    const userInfo = jwtDecode(accessToken);
    // authApiResponseSuccess(AuthActionTypes.LOGIN_USER, userInfo);
    setAuthorization(accessToken);
    return accessToken;
  } catch (error: any) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "/";
    throw error;
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshTokenLogic();
        originalRequest.headers["Authorization"] = `Bearer ${token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
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

// Calculate time until token expiration in seconds
const getTimeUntilExpiration = (token: string): number => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp - currentTime;
  } catch (error) {
    console.error("Error calculating token expiration:", error);
    return -1;
  }
};

// Setup token refresh interval
const setupTokenRefreshInterval = () => {
  if (window._tokenRefreshInterval) {
    clearInterval(window._tokenRefreshInterval);
  }

  window._tokenRefreshInterval = setInterval(async () => {
    const token = getUserFromCookie();
    console.log(token, "token");
    await refreshTokenLogic();
    // if (token) {
    //   const timeUntilExpiration = getTimeUntilExpiration(token);
    //   if (timeUntilExpiration < 120 && timeUntilExpiration > 0) {
    //     try {
    //       await refreshTokenLogic();
    //     } catch (error) {}
    //   } else if (timeUntilExpiration <= 0) {
    //     try {

    //     } catch (error) {
    //       console.error("Token refresh failed:", error);
    //     }
    //   }
    // }
  }, REFRESH_INTERVAL);

  const immediateCheck = async () => {
    const token = getUserFromCookie();
    if (token) {
      const timeUntilExpiration = getTimeUntilExpiration(token);
      if (timeUntilExpiration < 300) {
        try {
          await refreshTokenLogic();
        } catch (error) {
          console.error("Initial token refresh failed:", error);
        }
      }
    }
  };

  immediateCheck();
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

      // Return true if the token is valid for more than 2 minutes
      return decoded.exp > currentTime + 120;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  setLoggedInUser = (session: any) => {
    if (session) {
      const tokenValue = typeof session === "string" ? session : session.token;
      localStorage.setItem(AUTH_SESSION_KEY, tokenValue);
      try {
        const userInfo = jwtDecode(tokenValue);
        dispatchToStore(
          authApiResponseSuccess(AuthActionTypes.GOOGLE_LOGIN_USER, userInfo)
        );
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
    try {
      const userInfo = jwtDecode(token);
      authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, userInfo);
    } catch (error) {
      console.error("Error updating Redux store on init:", error);
    }
  }
  setupTokenRefreshInterval();
};

// Initialize immediately instead of with a timeout
initializeAxios();
export { APICore, setAuthorization, axiosInstance };

import jwtDecode from "jwt-decode";
import axios, { AxiosInstance } from "axios";
import config from "../../config";
 
const AUTH_SESSION_KEY = "Session_token";
const REFRESH_INTERVAL = 14 * 60 * 1000;
 
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
  const user = localStorage.getItem(AUTH_SESSION_KEY);
  return user ? (typeof user == "object" ? user : JSON.parse(user)) : null;
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
    localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(accessToken));
    setAuthorization(accessToken);
    return accessToken;
  } catch (error:any) {
    localStorage.removeItem(AUTH_SESSION_KEY);
    window.location.href = "/auth/login";
    throw error;
  }
};
 
// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = getUserFromCookie();
    if (session) {
      config.headers["Authorization"] = `Bearer ${session}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
 
// Setup periodic token refresh
const setupTokenRefreshInterval = () => {
  setInterval(async () => {
    if (new APICore().isUserAuthenticated()) {
      try {
        await refreshTokenLogic();
      } catch (error:any) {
        console.error("Periodic token refresh failed:", error);
      }
    }
  }, REFRESH_INTERVAL);
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
    const user = this.getLoggedInUser();
    return jwtDecode(user);
  };
 
  isUserAuthenticated = () => {
    const user = this.getLoggedInUser();
    if (!user) {
      return false;
    }
    const decoded: any = this.getLoggedInUserInfo();
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      console.warn("Please log in again");
      return false;
    } else {
      return true;
    }
  };
 
  setLoggedInUser = (session: any) => {
    console.log(session, "haii");
    if (session) {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session?.token));
    } else {
      localStorage.removeItem(AUTH_SESSION_KEY);
    }
  };
 
  getLoggedInUser = () => {
    return getUserFromCookie();
  };
 
  setUserInSession = (modifiedUser: any) => {
    let userInfo = localStorage.getItem(AUTH_SESSION_KEY);
    if (userInfo) {
      const { token, user } = JSON.parse(userInfo);
      this.setLoggedInUser({ token, ...user, ...modifiedUser });
    }
  };
}
 
const initializeAxios = () => {
  const session = getUserFromCookie();
  if (session?.token) {
    setAuthorization(session.token);
  }
  setupTokenRefreshInterval();
};
 
initializeAxios();
 
export { APICore, setAuthorization, axiosInstance };
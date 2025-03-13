import { toast } from "react-toastify";
import { APICore, axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

interface UserData {
  username: string;
  password: string;
}

const api = new APICore();

export const authAccessCredentials = async (adminCredentials: UserData) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.auth.accessAccount}`,
      adminCredentials
    );
    api.setLoggedInUser(response.data.data);
    if (response.data.status) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }
    return response.data; 
  } catch (error: any) {
    toast.error(error.response?.data.message);
    console.error("Login Error:", error.response?.data || error.message);
  }
};

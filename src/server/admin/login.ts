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
    api.setLoggedInUser(response.data.data)
    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
  }
};

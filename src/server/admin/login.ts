import { toast } from "react-toastify";
import { APICore, axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";
import { setContext } from "../../helpers/api/utils";

interface UserData {
  email: string;
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
    const { employeeDetails } = response.data.data;
    setContext({
      contextId: employeeDetails.contextId,
      contextType: employeeDetails.contextType,
      slug: employeeDetails.slug,
      role: employeeDetails.role,
    });
    if (response.data.status) {
      toast.success(response.data.message);
    } else {
      toast.error(response.data.message);
    }

    return response.data;
  } catch (error: any) {
    // Handle errors
    toast.error(error.response?.data.message);
    console.error("Login Error:", error.response?.data || error.message);
  }
};

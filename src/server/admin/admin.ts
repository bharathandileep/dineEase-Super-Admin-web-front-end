import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const approveOrganisation = async (query: any) => {
  try {
    const response = await axiosInstance.patch(
      `${apiConfig.admin.approveOrganization(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching unapproved kitchens",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const approveKitchen = async (query: any) => {
  try {
    const response = await axiosInstance.patch(
      `${apiConfig.admin.approvekitchen(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching unapproved kitchens:",
      error.response?.data || error.message
    );
    throw error;
  }
};

import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";


const extractErrorMessage = (error: any) => {
    console.error("API Error:", error.response?.data || error.message);
    return error.response?.data?.message || "Something went wrong. Please try again.";
  };


export const collaborateKitchen = async (organization_id: string, kitchen_id: string) => {
    try {
        const response = await axiosInstance.post(apiConfig.collab.collaborateKitchen, {
            organization_id,
            kitchen_id
        });
        return response.data;
    } catch (error: any) {
        throw new Error(extractErrorMessage(error));
    }
};

export const listCollaboratedKitchens = async (organization_id: string) => {
    try {
        const response = await axiosInstance.get(`${apiConfig.collab.listCollaboratedKitchens}/${organization_id}`);
        return response.data;
    } catch (error: any) {
        throw new Error(extractErrorMessage(error));
    }
};


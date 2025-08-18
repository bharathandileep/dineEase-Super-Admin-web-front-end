import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

const extractErrorMessage = (error: any) => {
  console.error("API Error:", error.response?.data || error.message);
  return (
    error.response?.data?.message || "Something went wrong. Please try again."
  );
};

export const collaborateKitchen = async (
  organization_id: string,
  kitchen_id: string
) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.collab.collaborateKitchen,
      {
        organization_id,
        kitchen_id,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const listCollaboratedKitchens = async (orgId: string) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.collab.listCollaboratedKitchens(orgId)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getAllCollaborations = async () => {
  try {
    const response = await axiosInstance.get(
      apiConfig.collab.getAllCollaborations
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getCollaborationById = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.collab.getCollaborationById(id)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};
export const requestCollaboration = async (formData: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.collab.requestCollaboration,  // Example endpoint
      formData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "An error occurred while processing the request.");
  }
};
export const getCollaborationDetails = async (data: any) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.collab.getCollaborationDetails,
      { params: data } // this is how query params are passed
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

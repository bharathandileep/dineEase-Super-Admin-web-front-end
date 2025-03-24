import {axiosInstance} from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const getAllDesignations = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.designation.getAllDesignations(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching designations:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};



export const getDesignationById = async (id: string) => {
  try {
    const response = await axiosInstance.get(apiConfig.designation.getDesignationById(id));
    return response.data;
  } catch (error: any) {
    console.error("Error fetching designation:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const createDesignation = async (data: { designation_name: string; created_by: string }) => {
  try {
    const response = await axiosInstance.post(apiConfig.designation.createDesignation, data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating designation:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const updateDesignation = async (id: string, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.designation.updateDesignation(id), data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating designation:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const toggleDesignationStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(apiConfig.designation.toggleDesignationStatus(id));
    return response.data;
  } catch (error: any) {
    console.error("Error toggling designation status:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const deleteDesignation = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiConfig.designation.deleteDesignation(id));
    return response.data;
  } catch (error: any) {
    console.error("Error deleting designation:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

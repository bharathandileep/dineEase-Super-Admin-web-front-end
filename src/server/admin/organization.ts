import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";
import axios from "axios";

const extractErrorMessage = (error: any) => {
  console.error("API Error:", error.response?.data || error.message);
  return error.response?.data?.message || "Something went wrong. Please try again.";
};

export const getAllOrg = async (query: any) => {
  try {
    const url = apiConfig.organization.getAllOrganization(query);
    console.log("Request URL:", url); // Debug log

    const response = await axiosInstance.get(url);
    console.log("Response Data:", response.data); // Debug log

    return response.data;
  } catch (error: any) {
    console.error("Error in getAllOrg:", error);
    throw new Error(extractErrorMessage(error));
  }
};

export const createNewOrg = async (orgData: any) => {
  try {
    const response = await axiosInstance.post(`${apiConfig.organization.newOrganization}`, orgData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getOrgDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`${apiConfig.organization.getOrganizationById(id)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const updateOrgDetails = async (id: string | undefined, orgDetails: any) => {
  try {
    const response = await axiosInstance.put(`${apiConfig.organization.updateOrganization(id)}`, orgDetails);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const deleteOrgDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(`${apiConfig.organization.deleteOrganization(id)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const toggleOrganizationStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(`${apiConfig.organization.toggleOrgStatus(id)}`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getUserApprovedOrganizations = async () => {
  try {
    const response = await axiosInstance.get(`${apiConfig.organization.getUserApprovedOrganizations}`);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgCreateCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(apiConfig.organization.createCategory, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgGetAllCategories = async (query: any) => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getAllCategories(query));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgUpdateCategory = async (id: string | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.organization.updateCategory(id), { category: data });
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgDeleteCategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(apiConfig.organization.deleteCategory(id));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgToggleCategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(apiConfig.organization.toggleCategoryStatus(id));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgCreateSubcategory = async (data: any | undefined) => {
  try {
    const response = await axiosInstance.post(apiConfig.organization.createSubcategory, data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgGetSubcategoriesByCategory = async (categoryId: string | undefined) => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getSubcategoriesByCategory(categoryId));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgGetSubcategories = async (query: any) => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getAllSubCategories(query));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgGetSubcategoryById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getSubcategoryById(id));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgUpdateSubcategory = async (id: string | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.organization.updateSubcategory(id), data);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgDeleteSubcategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(apiConfig.organization.deleteSubcategory(id));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const orgToggleSubcategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(apiConfig.organization.toggleSubcategoryStatus(id));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getAllCategoriesByStatus = async () => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getAllCategoriesByStatus);
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};


export const getUnapprovedOrganizations = async (query: any) => {
  try {
    const response = await axiosInstance.get(apiConfig.organization.getUnapprovedOrganizations(query));
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
}

export const getAllKitches = async (query:any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens.getAllkitchens(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching kitchens:", error.response?.data || error.message);
    throw error;
  }
};

// In server/admin/organization.ts

export const selectKitchen = async (orgId: string, kitchenId: string) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.organization.selectKitchen(orgId),
      { orgId, kitchenId }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(extractErrorMessage(error));
  }
};

export const getSelectedKitchen = async (orgId: string) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.organization.getSelectedKitchen(orgId)
    );
    return response.data;
  } catch (error: any) {
    // Handle the specific error for no kitchen selected
    if (error.response && error.response.status === 400) {
      return { status: false, message: "No kitchen selected", data: { kitchen: null } };
    }
    throw new Error(extractErrorMessage(error));
  }
};

import {axiosInstance} from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const getAllOrg = async (query:any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.organization.getAllOrganization(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching organizations:", error.response?.data || error.message);
    throw error;
  }
};


export const createNewOrg = async (orgData: any) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.organization.newOrganization}`,
      orgData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getOrgDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.organization.getOrganizationById(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const updateOrgDetails = async (
  id: string | undefined,
  orgDetails: any
) => {
  try {
    const response = await axiosInstance.put(
      `${apiConfig.organization.updateOrganization(id)}`,
      orgDetails
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return error
  }
};
export const deleteOrgDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      `${apiConfig.organization.deleteOrganization(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return error.response?.data
  }
};
export const toggleOrganizationStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.organization.toggleOrgStatus(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching kitchens:", error.response?.data || error.message);
    throw error;
  }
};

export const orgCreateCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.organization.createCategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgGetAllCategories = async (query: any) => {
  try {
    console.log("Sending API Query:", query);
    const url = apiConfig.organization.getAllCategories(query);
    console.log("Constructed URL:", url);
    const response = await axiosInstance.get(url);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const orgUpdateCategory = async (id: string | undefined, data: any) => {
  console.log(id, data);
  try {
    const response = await axiosInstance.put(
      apiConfig.organization.updateCategory(id),
      { category: data }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgDeleteCategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.organization.deleteCategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgToggleCategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.organization.toggleCategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgCreateSubcategory = async (data: any | undefined) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.organization.createSubcategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgGetSubcategoriesByCategory = async (
  categoryId: string | undefined
) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.organization.getSubcategoriesByCategory(categoryId)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgGetSubcategories = async (query: any) => {
  try {

    const url = `${apiConfig.organization.getAllSubCategories(query)}`;
  
    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error: any) {
    console.error("Error fetching subcategories:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};



export const orgGetSubcategoryById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.organization.getSubcategoryById(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgUpdateSubcategory = async (
  id: string | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      apiConfig.organization.updateSubcategory(id),
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgDeleteSubcategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.organization.deleteSubcategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const orgToggleSubcategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.organization.toggleSubcategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getAllCategoriesByStatus = async () => {
  try {
    const response = await axiosInstance.get(
      apiConfig.organization.getAllCategoriesByStatus
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

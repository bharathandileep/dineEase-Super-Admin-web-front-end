import {axiosInstance} from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";
 
 
 
export const getAllKitches = async (query: any) => {
  console.log(query)
  try {
    const url = `${apiConfig.kitchens.getAllkitchens(query)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching kitchens:", error.response?.data || error.message);
    throw error;
  }
};
 
export const createNewkitchen = async (kitchenData: any) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.kitchens.newkitchens}`,
      kitchenData
    );
    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
  }
};
 
export const getkitchenDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens.getkitchensById(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};
 
export const updatekitchenDetails = async (
  id: string | undefined,
  kitchenDetails: any
) => {
  try {
    const response = await axiosInstance.put(
      `${apiConfig.kitchens.updatekitchens(id)}`,
      kitchenDetails
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};
 
export const deletekitchenDetails = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      `${apiConfig.kitchens.deletekitchens(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};
export const toggleKitchenStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens.toggleKitchenStatus(id)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching kitchens:", error.response?.data || error.message);
    throw error;
  }
};
 
export const getUserApprovedKitchens = async () => {
  try {
    const response = await axiosInstance.get(`${apiConfig.kitchens.getUserApprovedKitchens}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user's approved kitchens:", error.response?.data || error.message);
    throw error;
  }
};
 
export const kitchenCreateCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(apiConfig.kitchens.createCategory, data);
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "An error occurred while creating the kitchen category.");
  }
};

export const kitchensGetAllCategories = async (query: any) => {
  try {
    const url = `${apiConfig.kitchens.getallCategories(query)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to fetch kitchen categories.");
  }
};

export const kitchensUpdateCategory = async (id: string | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.kitchens.updateCategory(id), { category: data });
    return response.data;
  } catch (error: any) {
  
    throw new Error(error.response?.data?.message || "An error occurred while updating the kitchen category.");
  }
};

export const kitchensDeleteCategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(apiConfig.kitchens.deleteCategory(id));
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "An error occurred while deleting the kitchen category.");
  }
};

export const kitchensToggleCategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(apiConfig.kitchens.toggleCategoryStatus(id));
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "An error occurred while toggling category status.");
  }
};

export const kitchensCreateSubcategory = async (data: any | undefined) => {
  try {
    const response = await axiosInstance.post(apiConfig.kitchens.createSubcategory, data);
    return response.data;
  } catch (error: any) {
   
    throw new Error(error.response?.data?.message || "An error occurred while creating the kitchen subcategory.");
  }
};

export const kitchensGetSubcategoriesByCategory = async (categoryId: string | undefined) => {
  try {
    const response = await axiosInstance.get(apiConfig.kitchens.getSubcategoriesByCategory(categoryId));
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to fetch subcategories for the specified category.");
  }
};

export const kitchensGetSubcategories = async (query: any) => {
  try {
    const url = `${apiConfig.kitchens.getallSubCategories(query)}`;
    const response = await axiosInstance.get(url);

    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to fetch kitchen subcategories.");
  }
};

export const kitchensGetSubcategoryById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(apiConfig.menu.getSubcategoryById(id));
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "Failed to fetch subcategory details.");
  }
};

export const kitchensUpdateSubcategory = async (id: string | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.kitchens.updateSubcategory(id), data);
    return response.data;
  } catch (error: any) {

    throw new Error(error.response?.data?.message || "An error occurred while updating the subcategory.");
  }
};

 
export const kitchensDeleteSubcategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.kitchens.deleteSubcategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};
 
export const kitchensToggleSubcategoryStatus = async (
  id: string | undefined
) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.kitchens.toggleSubcategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};
 
export const getUnapprovedKitchens = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens. getUnapprovedKitchens(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching unapproved kitchens:", error.response?.data || error.message);
    throw error;
  }
}


 

import {axiosInstance} from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";



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

export const kitchenCreateCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.kitchens.createCategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensGetAllCategories = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens.getAllCategories(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching kitechn categories", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const kitchensUpdateCategory = async (
  id: string | undefined,
  data: any
) => {

  try {
    const response = await axiosInstance.put(
      apiConfig.kitchens.updateCategory(id),
      { category: data }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensDeleteCategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.kitchens.deleteCategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensToggleCategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.kitchens.toggleCategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensCreateSubcategory = async (data: any | undefined) => {

  try {
    const response = await axiosInstance.post(
      apiConfig.kitchens.createSubcategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensGetSubcategoriesByCategory = async (
  categoryId: string | undefined
) => {
  try {

    const response = await axiosInstance.get(
      apiConfig.kitchens.getSubcategoriesByCategory(categoryId)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensGetSubcategories = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchens.getAllSubCategories( query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensGetSubcategoryById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.menu.getSubcategoryById(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const kitchensUpdateSubcategory = async (
  id: string | undefined,
  data: any
) => {
  try {
    const response = await axiosInstance.put(
      apiConfig.kitchens.updateSubcategory(id),
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
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

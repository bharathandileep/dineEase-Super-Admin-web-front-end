import {axiosInstance} from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const createCategory = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.menu.createCategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getAllCategories = async (query: any) => {
  try {
    console.log("Sending API Query:", query);
    const url = `${apiConfig.menu.getAllCategories(query)}`;
    console.log("Constructed URL:", url); // Log the full URL
    const response = await axiosInstance.get(url);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const getAllCategoriesByStatus = async () => {
  try {
    const response = await axiosInstance.get(
      apiConfig.menu.getAllCategoriesByStatus
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const updateCategory = async (id: string | undefined, data: any) => {

  try {
    const response = await axiosInstance.put(
      apiConfig.menu.updateCategory(id),
      { category: data }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const deleteCategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.menu.deleteCategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const toggleCategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.menu.toggleCategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const createSubcategory = async (data: any | undefined) => {

  try {
    const response = await axiosInstance.post(
      apiConfig.menu.createSubcategory,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getSubcategoriesByCategory = async (
  categoryId: string | undefined
) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.menu.getSubcategoriesByCategory(categoryId)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const getSubcategories = async (query: any) => {
  try {

    const url = `${apiConfig.menu.getAllSubCategories(query)}`;
   
    const response = await axiosInstance.get(url);
    console.log("API Response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subcategories:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};


export const getSubcategoryById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.menu.getSubcategoryById(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const updateSubcategory = async (id: string | undefined, data: any) => {

  try {
    const response = await axiosInstance.put(
      apiConfig.menu.updateSubcategory(id),
      data
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const deleteSubcategory = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.menu.deleteSubcategory(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
  }
};

export const toggleSubcategoryStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.menu.toggleSubcategoryStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error:", error.response?.data || error.message);
    return error;
  }
};

export const getMenuItemsByKitchen = async(id:string | undefined)=>{
  try{
    const response = await axiosInstance.get(
      apiConfig.menu.getMenuItemsByKitchen(id)
    );
    return response.data;
  }catch(error:any){
    console.log("Error:",error.response?.data || error.message);
  }
} ;

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

export const getAllAdminEmployees = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.adminEmployee.getAllEmployees(query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching employees:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const getEmployeeById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.adminEmployee.getEmployeeById(id)
    );
    const employee = response.data;

    const address = employee.address || {};

    return {
      ...employee,
      address,
    };
  } catch (error: any) {
    console.error(
      "Error fetching employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const createAdminEmployee = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.adminEmployee.createEmployee,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const updateEmployee = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      apiConfig.adminEmployee.updateEmployee(id),
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

export const toggleEmployeeStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.adminEmployee.toggleEmployeeStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error toggling employee status:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const deleteEmployee = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.adminEmployee.deleteEmployee(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

export const verifyDocument = async (
  docId: string | undefined,
  docType: string
) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.adminEmployee.verifyDocument(docId, docType)
    );
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};

export const createNewTags = async (tags: string[]) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.menu.createNewMenutags,
      tags
    );
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};
export const getAllTags = async (query: any) => {
  try {
    const url = `${apiConfig.menu.getAllTags(query)}`;
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};

export const deleteTag = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.delete(apiConfig.menu.deleteTag(id));
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};

export const toggleTagStatus = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.menu.toggleTagStatus(id)
    );
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};

export const updateTag = async (id: string | undefined, data: any) => {
  try {
    const response = await axiosInstance.put(apiConfig.menu.updateTag(id), {
      name: data,
    });
    return response.data;
  } catch (error: any) {
    return error.response?.data || error;
  }
};

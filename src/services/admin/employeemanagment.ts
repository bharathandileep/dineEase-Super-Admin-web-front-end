import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const getAllEmployees = async (query: any) => {
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

export const createEmployee = async (data: any) => {
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

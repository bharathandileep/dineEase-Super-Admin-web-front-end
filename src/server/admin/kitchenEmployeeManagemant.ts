import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

export const createKitchenEmployee = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.kitchenEmployee.createEmployee,
      data,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating organization employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const getAllKitchenEmployees = async (orgId: any, query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.kitchenEmployee.getAllEmployees(orgId, query)}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching organization employees:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const getKitchenEmployeeById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.kitchenEmployee.getEmployeeById(id)
    );
    const Employee = response.data;

    const address = Employee.address || {};

    return {
      ...Employee,
      address,
    };
  } catch (error: any) {
    console.error(
      "Error fetching organization employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const updateKitchenEmployee = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      apiConfig.kitchenEmployee.updateEmployee(id),
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
export const toggleKitchenEmployeeStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.kitchenEmployee.toggleEmployeeStatus(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error toggling organization employee status:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};
export const deleteKitchenEmployee = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.kitchenEmployee.deleteEmployee(id)
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error deleting organization employee:",
      error.response?.data || error.message
    );
    throw error.response?.data || error;
  }
};

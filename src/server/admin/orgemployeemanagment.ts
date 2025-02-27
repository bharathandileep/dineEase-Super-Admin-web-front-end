import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

// ✅ Get all organization employees
export const getAllOrgEmployees = async () => {
  try {
    const response = await axiosInstance.get(apiConfig.orgemployee.getAllOrgEmployees);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching organization employees:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Get a single organization employee by ID
export const getOrgEmployeeById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(apiConfig.orgemployee.getOrgEmployeeById(id));
    const Employee = response.data;

    // Extract address information from the organization employee data
    const address = Employee.address || {};

    return {
      ...Employee,
      address,
    };
  } catch (error: any) {
    console.error("Error fetching organization employee:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Create a new organization employee
export const createOrgEmployee = async (data: any) => {
  try {
    const response = await axiosInstance.post(apiConfig.orgemployee.createOrgEmployee, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error creating organization employee:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

// ✅ Update organization employee details
export const updateOrgEmployee = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(apiConfig.orgemployee.updateOrgEmployee(id), data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};

// ✅ Toggle organization employee status (Activate/Deactivate)
export const toggleOrgEmployeeStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(apiConfig.orgemployee.toggleOrgEmployeeStatus(id));
    return response.data;
  } catch (error: any) {
    console.error("Error toggling organization employee status:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

export const deleteOrgEmployee = async (id: string) => {
  try {
    const response = await axiosInstance.delete(apiConfig.orgemployee.deleteOrgEmployee(id));
    return response.data;
  } catch (error: any) {
    console.error("Error deleting organization employee:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};

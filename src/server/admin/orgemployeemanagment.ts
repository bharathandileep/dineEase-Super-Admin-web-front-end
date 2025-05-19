import { axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";
import { emails } from "../../pages/apps/Email/data";

export const getAllOrgEmployees = async (orgId: any, query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.orgemployee.getAllOrgEmployees(orgId, query)}`
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
export const getOrgEmployeeById = async (id: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.orgemployee.getOrgEmployeeById(id)
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
export const createOrgEmployee = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.orgemployee.createOrgEmployee,
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
export const updateOrgEmployee = async (id: string, data: FormData) => {
  try {
    const response = await axiosInstance.put(
      apiConfig.orgemployee.updateOrgEmployee(id),
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
export const toggleOrgEmployeeStatus = async (id: string) => {
  try {
    const response = await axiosInstance.patch(
      apiConfig.orgemployee.toggleOrgEmployeeStatus(id)
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
export const deleteOrgEmployee = async (id: string) => {
  try {
    const response = await axiosInstance.delete(
      apiConfig.orgemployee.deleteOrgEmployee(id)
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
export const getEmployeeOrg = async (empEmail: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.orgemployee.getEmployeeOrg(empEmail)
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
export const createNewDesignation = async (data: any) => {
  try {
    const response = await axiosInstance.post(
      apiConfig.roleAndAccess.newDesignation,
      data
    );
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error;
  }
};
export const getDesignation = async (entity_id: any, entity_type: any) => {
  try {
    const response = await axiosInstance.get(
      apiConfig.roleAndAccess.getDesignation(entity_id, entity_type)
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

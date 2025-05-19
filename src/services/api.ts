// import { API } from "../api/axios";
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1', 
});


// Create Organization
export const createOrganisation = async (organizationData: any) => {
  try {
    const response = await API.post("/organizations", organizationData);
    return response.data;
  } catch (error:any) {
  
  }
};

// Get Organizations  t2
export const getOrganisation = async () => {
  try {
    const response = await API.get("/organizations");
    return response.data;
  } catch (error:any) {

  }
};

export const deleteOrganization = async (orgId: string) => {
  try {
    const response = await API.delete(`/organizations/${orgId}`);

    return response.data;
  } catch (error:any) {
    console.error(
      "Error deleting organization and associated addresses:",
      error
    );
    throw error;
  }
};

export const getOrganizationById = async (orgId: string) => {
  try {
    const response = await API.get(`http://localhost:5000/api/v1/organizations/${orgId}`);
    return response.data;
  } catch (error:any) {

    throw new Error("Failed to fetch organization");
  }
};

export const updateOrganization = async (
  orgId: string,
  organizationData: any
) => {
  try {
    const response = await API.put(`/organizations/${orgId}`, organizationData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating organization:", error.message || error);
    throw new Error(error.message || "Failed to update the organization.");
  }
};

export default API;
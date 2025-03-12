// import { API } from "../api/axios";
import axios from 'axios';

export const API = axios.create({
  baseURL: 'http://localhost:5000/api/v1', 
});


// Create Organization
export const createOrganisation = async (organizationData: any) => {
  try {
    console.log(organizationData);
    const response = await API.post("/organizations", organizationData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Get Organizations  t2
export const getOrganisation = async () => {
  try {
    const response = await API.get("/organizations");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
export const deleteOrganization = async (orgId: string) => {
  console.log("Deleting organization with ID:", orgId);
  try {
    const response = await API.delete(`/organizations/${orgId}`);
    console.log("Organization deleted successfully:", response.data);

    return response.data;
  } catch (error) {
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
    console.log(response.data); // You can process this data as required
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch organization");
  }
};

export const updateOrganization = async (
  orgId: string,
  organizationData: any
) => {
  try {
    const response = await API.put(`/organizations/${orgId}`, organizationData);
    console.log("Updated Organization:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating organization:", error.message || error);
    throw new Error(error.message || "Failed to update the organization.");
  }
};


export default API;
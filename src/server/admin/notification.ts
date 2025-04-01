import { AxiosInstance } from "axios";
import { apiConfig } from "../../helpers/api/apis";
import axios from "axios";
import { axiosInstance } from "../../helpers/api/apiCore";

export const generateKitchenNotification = async (
  userId: string | undefined,
  kitchenName: string | undefined
) => {
  try {
    const response = await axiosInstance.get(
      `${
        apiConfig.notification.generateKitchenNotification
      }?userId=${userId}&kitchenName=${encodeURIComponent(kitchenName || "")}`
    );
    return response.data;
  } catch (error: any) {
    console.log("error", error.response?.data || error.message);
    throw error;
  }
};

export const getUserNotifications = async (userId: string | undefined) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.notification.getUserNotifications(userId)}`
    );
    return response.data;
  } catch (error: any) {
    console.log("Error", error.response?.data || error.message);
  }
};

export const getAllNotifications = async (query: any) => {
  try {
    const response = await axiosInstance.get(
      `${apiConfig.notification.getAllNotifications}`
    );
    return response.data;
  } catch (error: any) {
    console.log("error", error.response?.data || error.message);
  }
};

export const generateOrganizationNotification = async (
  userId: string | undefined,
  organizationName: string | undefined
) => {
  try {
    const response = await axiosInstance.get(
      `${
        apiConfig.notification.generateOrganizationNotification
      }?userId=${userId}&organizationName=${encodeURIComponent(
        organizationName || ""
      )}`
    );
    return response.data;
  } catch (error: any) {
    console.log("error", error.response?.data || error.message);
    throw error;
  }
};

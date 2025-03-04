import { APICore, axiosInstance } from "../../helpers/api/apiCore";
import { apiConfig } from "../../helpers/api/apis";

import { firebaseAuth } from "../../firebase.config";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";


interface UserData {
  username: string;
  password: string;
}

const api = new APICore();

interface ForgotPasswordData {
  email: string;
}

interface VerifyOtpData {
  email: string;
  otp: string;
  token: string;
}

interface UpdatePasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
  token: string;
}

export const AuthAdminCredentials = async (adminCredentials: UserData) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.admin.login}`,
      adminCredentials
    );
    return response.data;
  } catch (error: any) {
    console.error("Login Error:", error.response?.data || error.message);
  }
};
export const googleAuth = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(firebaseAuth, provider);
    const {
      user: { displayName, photoURL, email },
    } = result;
    const token = await result.user.getIdToken();
    const response = await axiosInstance.post(
      "/auth/google-auth",
      {
        displayName,
        photoURL,
        email,
      },
      {
        headers: {
          Google_authorization: `Bearer ${token}`,
        },
      }
    );
    api.setLoggedInUser(response.data.data);
    return response.data;
  } catch (error: any) {
    return error;
  }
};
export const authUserWithCredentials = async (userCredentials: any) => {
  try {
    const response = await axiosInstance.post(
      "/auth/send-otp",
      userCredentials
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const authvaliadateOTP = async (userCredentials: any) => {
  try {
    const response = await axiosInstance.post(
      "/auth/verify-otp",
      userCredentials
    );
    api.setLoggedInUser(response.data.data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const loginUserWithMail = async (userCredentials: any) => {
  try {
    console.log(userCredentials);
    const response = await axiosInstance.post(
      "/auth/login-Otp",
      userCredentials
    );
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};

export const loginOTPVerify = async (userCredentials: any) => {
  try {
    console.log(userCredentials);
    const response = await axiosInstance.post(
      "/auth/verify-loginotp",
      userCredentials
    );
    api.setLoggedInUser(response.data.data);
    return response.data;
  } catch (error: any) {
    return error.response.data;
  }
};
export const generateForgotPasswordOtp = async (
  emailData: ForgotPasswordData
) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.admin.generateForgotOtp}`,
      emailData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Forgot Password OTP Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const verifyForgotPasswordOtp = async (otpData: VerifyOtpData) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.admin.verifyForgotOtp}`,
      otpData
    );
    return response.data;
  } catch (error: any) {
    console.error("Verify OTP Error:", error.response?.data || error.message);
    throw error;
  }
};

export const updateAdminPassword = async (passwordData: UpdatePasswordData) => {
  try {
    const response = await axiosInstance.post(
      `${apiConfig.admin.updatePassword}`,
      passwordData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Update Password Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

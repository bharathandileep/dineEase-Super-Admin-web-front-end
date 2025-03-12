// constants
import { AuthActionTypes } from "./constants";

export interface AuthActionType {
  type:
    | AuthActionTypes.API_RESPONSE_SUCCESS
    | AuthActionTypes.API_RESPONSE_ERROR
    | AuthActionTypes.FORGOT_PASSWORD
    | AuthActionTypes.FORGOT_PASSWORD_CHANGE
    | AuthActionTypes.LOGIN_USER
    | AuthActionTypes.LOGOUT_USER
    | AuthActionTypes.RESET
    | AuthActionTypes.SIGNUP_USER
    | AuthActionTypes.VERIFY_OTP
    | AuthActionTypes.RESET_PASSWORD
    | AuthActionTypes.GOOGLE_LOGIN_USER;
  payload: {} | string;
}

interface UserData {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  token: string;
}

// common success
export const authApiResponseSuccess = ( 
  actionType: string,
  data: any
): AuthActionType => ({
  type: AuthActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const authApiResponseError = (
  actionType: string,
  error: string
): AuthActionType => ({
  type: AuthActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const loginUser = (
  username: string,
  password: string
): AuthActionType => ({
  type: AuthActionTypes.LOGIN_USER,
  payload: { username, password },
});

export const logoutUser = (): AuthActionType => ({
  type: AuthActionTypes.LOGOUT_USER,
  payload: {},
});

export const signupUser = (
  fullname: string,
  email: string,
  password: string
): AuthActionType => ({
  type: AuthActionTypes.SIGNUP_USER,
  payload: { fullname, email, password },
});

export const forgotPassword = (username: string): AuthActionType => ({
  type: AuthActionTypes.FORGOT_PASSWORD,
  payload: { username },
});

export const resetAuth = (): AuthActionType => ({
  type: AuthActionTypes.RESET,
  payload: {},
});
 
export const verifyOtp = (otp: string): AuthActionType => ({
type: AuthActionTypes.VERIFY_OTP,
payload: { otp },
});
export const resetPassword = (otp: string): AuthActionType => ({
type: AuthActionTypes.RESET_PASSWORD,
payload: { otp },
});
export const googleLoginUser = (): AuthActionType => ({
  type: AuthActionTypes.GOOGLE_LOGIN_USER,
  payload: {},
});

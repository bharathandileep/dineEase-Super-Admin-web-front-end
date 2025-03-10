import { all, fork, put, takeEvery, call } from "redux-saga/effects";
import { SagaIterator } from "@redux-saga/core";

// apicore
import { APICore, setAuthorization } from "../../helpers/api/apiCore";

// helpers
import {
  login as loginApi,
  logout as logoutApi,
  signup as signupApi,
  forgotPassword as forgotPasswordApi,
} from "../../helpers/";

// actions
import { authApiResponseSuccess, authApiResponseError } from "./actions";

// constants
import { AuthActionTypes } from "./constants";
import { googleAuth } from "../../server/admin/auth";
import jwtDecode from "jwt-decode";

interface UserData {
  payload: {
    username: string;
    password: string;
    fullname: string;
    email: string;
  };
  type: string;
}

const api = new APICore();

/**
 * Login the user
 * @param {*} payload - username and password
 */

function* login({
  payload: { username, password },
  type,
}: UserData): SagaIterator {
  try {
    const response = yield call(loginApi, { username, password });
    const user = response.data;
    api.setLoggedInUser(user);
    setAuthorization(user["token"]);
    yield put(authApiResponseSuccess(AuthActionTypes.LOGIN_USER, user));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGIN_USER, error));
    api.setLoggedInUser(null);
    setAuthorization(null);
  }
}

/**
 * Logout the user
 */
function* logout(): SagaIterator {
  try {
    yield call(logoutApi);
    api.setLoggedInUser(null);
    setAuthorization(null);
    yield put(authApiResponseSuccess(AuthActionTypes.LOGOUT_USER, {}));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.LOGOUT_USER, error));
  }
}
function* googleLogin(): SagaIterator {
  try {
    const response = yield call(googleAuth);
    const user = response.data;
    api.setLoggedInUser(user);
    setAuthorization(user["token"]);
    const loginUser = api.getLoggedInUserInfo()
    yield put(
      authApiResponseSuccess(AuthActionTypes.GOOGLE_LOGIN_USER, loginUser)
    );
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.GOOGLE_LOGIN_USER, error));
    setAuthorization(null);
  }
}

function* signup({
  payload: { fullname, email, password },
}: UserData): SagaIterator {
  try {
    const response = yield call(signupApi, { fullname, email, password });
    const user = response.data;
    api.setLoggedInUser(user);
    setAuthorization(user["token"]);
    yield put(authApiResponseSuccess(AuthActionTypes.SIGNUP_USER, api.getLoggedInUserInfo));
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.SIGNUP_USER, error));
    api.setLoggedInUser(null);
    setAuthorization(null);
  }
}
function* forgotPassword({ payload: { username } }: UserData): SagaIterator {
  try {
    const response = yield call(forgotPasswordApi, { username });
    yield put(
      authApiResponseSuccess(AuthActionTypes.FORGOT_PASSWORD, response.data)
    );
  } catch (error: any) {
    yield put(authApiResponseError(AuthActionTypes.FORGOT_PASSWORD, error));
  }
}

export function* watchGoogleLogin() {
  yield takeEvery(AuthActionTypes.GOOGLE_LOGIN_USER, googleLogin);
}
export function* watchLoginUser() {
  yield takeEvery(AuthActionTypes.LOGIN_USER, login);
}

export function* watchLogout() {
  yield takeEvery(AuthActionTypes.LOGOUT_USER, logout);
}

export function* watchSignup(): any {
  yield takeEvery(AuthActionTypes.SIGNUP_USER, signup);
}

export function* watchForgotPassword(): any {
  yield takeEvery(AuthActionTypes.FORGOT_PASSWORD, forgotPassword);
}

function* authSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogout),
    fork(watchSignup),
    fork(watchForgotPassword),
    fork(watchGoogleLogin),
  ]);
}

export default authSaga;

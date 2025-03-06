import { AuthAdminCredentials } from "../../server/admin/auth";
import { APICore } from "./apiCore";

const api = new APICore();

function login(params: { username: string; password: string }) {
  return AuthAdminCredentials(params);
}

function logout() {
  localStorage.removeItem("Session_token");
  const baseUrl = "/logout/";
  return api.create(`${baseUrl}`, {});
}

function signup(params: { fullname: string; email: string; password: string }) {
  const baseUrl = "/register/";
  return api.create(`${baseUrl}`, params);
}

function forgotPassword(params: { username: string }) {
  const baseUrl = "/forget-password/";
  return api.create(`${baseUrl}`, params);
}

export { login, logout, signup, forgotPassword };

import { createApiInstance } from "../requestApi";
import type { User } from "../../types/user";
import type { ApiResponse, loginResponse } from "../../types/apiResponse";
import type { LoginRequest, RegisterRequest } from "../../types/apiRequest";

const authApiBaseURL = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(authApiBaseURL);

const login = async (
  request: LoginRequest
): Promise<ApiResponse<loginResponse>> => {
  return api.makeRequest<ApiResponse<loginResponse>>({
    url: "/auth/login",
    method: "POST",
    data: request,
  });
};

const register = async (
  request: RegisterRequest
): Promise<ApiResponse<User>> => {
  return api.makeRequest<ApiResponse<User>>({
    url: "/auth/register",
    method: "POST",
    data: request,
  });
};

export const authApi = { login, register };

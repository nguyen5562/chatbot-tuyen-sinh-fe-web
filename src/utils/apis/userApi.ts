import type { ApiResponse } from "../../types/apiResponse";
import type { User } from "../../types/user";
import { createApiInstance } from "../requestApi";

const userApiBaseUrl = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(userApiBaseUrl);

const getAllUser = async (): Promise<ApiResponse<User>> => {
  return api.makeRequest<ApiResponse<User>>({
    url: `/user`,
    method: "GET",
  });
};

// const getUserById = async (id: string): Promise<ApiResponse<User>> => {
//   return api.makeRequest<ApiResponse<User>>({
//     url: `/user/${id}`,
//     method: "GET",
//   });
// };

const updateUser = async (
  id: string,
  user: Partial<User>
): Promise<ApiResponse<User>> => {
  return api.makeRequest<ApiResponse<User>>({
    url: `/user/${id}`,
    method: "PUT",
    data: user,
  });
};

const createUser = async (user: Omit<User, 'id'>): Promise<ApiResponse<User>> => {
  return api.makeRequest<ApiResponse<User>>({
    url: `/user`,
    method: "POST",
    data: user,
  });
};

const deleteUser = async (id: string): Promise<ApiResponse> => {
  return api.makeRequest<ApiResponse>({
    url: `/user/${id}`,
    method: "DELETE",
  });
};

export const userApi = {
  getAllUser,
  createUser,
  // getUserById,
  updateUser,
  deleteUser,
};

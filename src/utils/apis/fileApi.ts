import { createApiInstance } from "../requestApi";
import type { FileDB } from "../../types/file";
import type { ApiResponse } from "../../types/apiResponse";

const fileApiBaseURL = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(fileApiBaseURL);

const getFiles = async (): Promise<ApiResponse<FileDB[]>> => {
  return api.makeRequest<ApiResponse<FileDB[]>>({
    url: "/file",
    method: "GET",
  });
};

const createFile = async (
  file: Partial<FileDB>
): Promise<ApiResponse<FileDB>> => {
  return api.makeRequest<ApiResponse<FileDB>>({
    url: "/file",
    method: "POST",
    data: file,
  });
};

const checkExits = async (
  filename: string,
): Promise<ApiResponse<boolean>> => {
  return api.makeRequest<ApiResponse<boolean>>({
    url: `/file/check-exists`,
    method: "PUT",
    data: { filename },
  });
};

export const fileApi = {
  getFiles,
  createFile,
  checkExits,
};

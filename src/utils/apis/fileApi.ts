import { createApiInstance } from "../requestApi";
import type { FileDB } from "../../types/file";
import type { ApiResponse } from "../../types/apiResponse";

const fileApiBaseURL = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(fileApiBaseURL);

const getFiles = async (): Promise<ApiResponse<FileDB[]>> => {
  return api.makeRequest<ApiResponse<FileDB[]>>({
    url: "/files",
    method: "GET",
  });
};

const getFileById = async (id: string): Promise<ApiResponse<FileDB>> => {
  return api.makeRequest<ApiResponse<FileDB>>({
    url: `/files/${id}`,
    method: "GET",
  });
};

const createFile = async (
  file: Partial<FileDB>
): Promise<ApiResponse<FileDB>> => {
  return api.makeRequest<ApiResponse<FileDB>>({
    url: "/files",
    method: "POST",
    data: file,
  });
};

const deleteFile = async (id: string): Promise<ApiResponse> => {
  return api.makeRequest<ApiResponse>({
    url: `/files/${id}`,
    method: "DELETE",
  });
};

export const fileApi = {
  getFiles,
  getFileById,
  createFile,
  deleteFile,
};

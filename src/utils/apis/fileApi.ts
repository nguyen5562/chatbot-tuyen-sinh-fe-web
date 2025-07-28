import { createApiInstance } from "../requestApi";
import type { FileDB } from "../../types/file";

const fileApiBaseURL = import.meta.env.VITE_API_BE_URL;
const api = createApiInstance(fileApiBaseURL);

const getFiles = async (): Promise<FileDB[]> => {
  return api.makeRequest<FileDB[]>({
    url: "/files",
    method: "GET",
  });
};

const getFileById = async (id: string): Promise<FileDB> => {
  return api.makeRequest<FileDB>({
    url: `/files/${encodeURIComponent(id)}`,
    method: "GET",
  });
};

const createFile = async (file: Partial<FileDB>): Promise<FileDB> => {
  return api.makeRequest<FileDB>({
    url: "/files",
    method: "POST",
    data: file,
  });
};

const deleteFile = async (id: string): Promise<void> => {
  return api.makeRequest<void>({
    url: `/files/${encodeURIComponent(id)}`,
    method: "DELETE",
  });
};

export const fileApi = {
  getFiles,
  getFileById,
  createFile,
  deleteFile,
};

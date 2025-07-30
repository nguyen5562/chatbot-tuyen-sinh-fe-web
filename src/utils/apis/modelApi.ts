import { createApiInstance } from "../requestApi";

const modelApiBaseUrl = import.meta.env.VITE_API_BE_URL;
// const modelApiBaseUrl = import.meta.env.VITE_API_MODEL_URL;
const api = createApiInstance(modelApiBaseUrl);

const getResponse = async (query: string): Promise<string> => {
  return api.makeRequest<string>({
    url: "get-response",
    method: "POST",
    data: {
      query,
    },
  });
};

export const modelApi = { getResponse };
